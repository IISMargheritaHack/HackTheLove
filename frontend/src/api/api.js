import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.BACKEND_URL || 'http://localhost:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error.response ? error.response.data : { error: 'Network Error' });
  }
);

const handleRequest = async (callback) => {
  try {
    const response = await callback();
    return response.data;
  } catch (error) {
    return error;
  }
};

// GET Requests
export const getUser = () => handleRequest(() => api.get('/getUser'));
export const getUserByParams = (email) => handleRequest(() => api.get('/getUserByParams', { params: { email } }));
export const getSurvey = () => handleRequest(() => api.get('/getSurvey'));
export const getMatches = () => handleRequest(() => api.get('/getMatches'));
export const getQuestions = () => handleRequest(() => api.get('/getQuestions'));
export const healCheck = () => handleRequest(() => api.get('/health'));

export const getPhotos = () => handleRequest(() => api.get('/getPhoto', { responseType: 'json' }));
export const getPhotosByParams = (email) => handleRequest(() =>
  api.get('/getPhotoByParams', { responseType: 'json', params: { email } })
);

// POST Requests
export const addSurvey = (surveyResponse) => {
  const isValid = validateSurvey(surveyResponse);
  if (!isValid.valid) return { error: isValid.message };

  return handleRequest(() => api.post('/addSurvey', { response: surveyResponse }));
};

export const addUserInfo = (userInfo) => {
  const result = validateUserData(userInfo);
  if (!result.valid) return { error: result.message };

  return handleRequest(() => api.post('/addUserInfo', userInfo));
};

export const addPhotos = (files) => {
  const validationError = validatePhotos(files);
  if (validationError) return { error: validationError };

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  return handleRequest(() =>
    api.post('/addPhoto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  );
};

export const setLike = (emailMatched, valueLike) =>
  handleRequest(() => api.post('/setLike', { email_matched: emailMatched, value_like: valueLike }));

function validateSurvey(surveyResponse) {
  if (surveyResponse.length !== 11) {
    return { valid: false, message: 'Error: response not valid' };
  }

  const validAnswers = ['a', 'b', 'c', 'd'];
  if ([...surveyResponse].some((res) => !validAnswers.includes(res.toLowerCase()))) {
    return { valid: false, message: 'Error: invalid answer detected' };
  }

  return { valid: true };
}

function validatePhotos(files) {
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/gif'];
  const maxFileSize = 10 * 1024 * 1024; // 10 MB

  if (files.length > 5) {
    return 'You can upload up to 5 photos only.';
  }

  for (const file of files) {
    if (!allowedMimeTypes.includes(file.type)) {
      return `File "${file.name}" is not supported. Only PNG, JPEG, and GIF are allowed.`;
    }
    if (file.size > maxFileSize) {
      return `File "${file.name}" exceeds the 10MB limit.`;
    }
  }

  return null;
}

function validateUserData(data) {
  const errors = [];

  // Normalize phone number
  if (data.phone && !data.phone.startsWith('+')) {
    data.phone = `+39${data.phone}`;
  }

  const phoneRegex = /^\+\d{1,3}\d{6,14}$/;
  if (!phoneRegex.test(data.phone)) {
    errors.push('Invalid phone number format.');
  }

  if (typeof data.age !== 'number' || data.age < 13 || data.age > 99) {
    errors.push('Age must be between 13 and 99.');
  }

  const sectionRegex = /^[A-I]$/;
  if (!sectionRegex.test(data.section)) {
    errors.push('Section must be a letter from A to I.');
  }

  if (typeof data.bio !== 'string' || data.bio.length > 500) {
    errors.push('Bio must be under 500 characters.');
  }

  if (typeof data.sex !== 'boolean') {
    errors.push('Sex must be a boolean value.');
  }

  return {
    valid: errors.length === 0,
    message: errors.length > 0 ? errors.join(' ') : 'Data is valid.',
  };
}
