import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
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


// GETS

async function getUser() {
  try {
    const response = await api.get('/getUser');
    return response.data;
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    return error.response.data;
  }
}

async function getSurvey() {
  try {
    const response = await api.get('/getSurvey');
    return response.data;
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    return error.response.data;
  }
}

async function getMatches() {
  try {
    const response = await api.get('/getMatches');
    return response;
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    return error.response.data;
  }
}

async function getPhotos() {
  try {
    const response = await api.get('/getPhoto', {
      responseType: 'json',
    });
    return response.data.images;
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    return [];
  }
}

async function getQuestions() {
  try {
    const response = await api.get('/getQuestions');
    return response.data;
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    return error.response.data;
  }
}


// POST

async function addSurvey(surveyResponse) {
  if (surveyResponse.length !== 11) {
    return { error: 'Error: response not valid' }
  };


  if (surveyResponse.split("").some(response => !['a', 'b', 'c', 'd'].includes(response.toLowerCase()))) {
    return { error: 'Error: response not valid' };
  }

  try {
    await api.post('/addSurvey', { "response": surveyResponse });
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    return error.response.data;
  }
}

/*
Example of userInfo object:
{
  "phone": "+393391859180",
  "bio": "Pippo baudo",
  "age": 18,
  "section": "E",
  "sex": true
}
*/
async function addUserInfo(userInfo) {

  let result = validateUserData(userInfo);

  if (!result.valid) {
    return { error: result.message }
  }

  try {
    await api.post('/addUserInfo', userInfo);
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    return error.response.data;
  }
}

async function addPhotos(files) {
  try {
    const allowedMimeTypes = {
      'image/png': true,
      'image/jpeg': true,
      'image/gif': true,
    };
    const maxFileSize = 10 * 1024 * 1024; // 10 MB in byte

    if (files.length > 5) {
      return { error: 'Puoi caricare un massimo di 5 foto.' };
    }

    for (let file of files) {
      if (!allowedMimeTypes[file.type]) {
        return { error: `Il file "${file.name}" non è in un formato supportato. (Solo PNG, JPEG, GIF)` };
      }

      if (file.size > maxFileSize) {
        return { error: `Il file "${file.name}" supera la dimensione massima di 10 MB.` };
      }
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const response = await api.post('/addPhoto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    return error.response?.data || { error: 'Errore sconosciuto' };
  }
}

async function setLike(email_matched, value_like) {
  try {
    const response = await api.post('/setLike', { "email_matched": email_matched, "value_like": value_like });
    return response.data;
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    return error.response.data;
  }
}


// OTHER

async function healCheck() {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
    return error.response.data;
  }
}

export { api, getUser, getSurvey, getMatches, getPhotos, getQuestions, healCheck, setLike, addSurvey, addUserInfo, addPhotos };


function validateUserData(data) {
  const errors = [];

  if (!data.phone?.startsWith('+')) {
    data.phone = `+39${data.phone}`;
  }

  console.log(data);

  const phoneRegex = /^\+\d{1,3}\d{6,14}$/;
  if (!phoneRegex.test(data.phone)) {
    errors.push("Invalid phone number. It should start with a prefix and contain 9-15 digits.");
  }

  if (typeof data.classe !== 'number' || isNaN(data.classe)) {
    errors.push("Invalid class. It should be a non-empty number.");
  }

  if (typeof data.bio !== 'string' || data.bio.length > 500) {
    errors.push("Invalid bio. It should be a non-empty string with a maximum of 500 characters.");
  }

  if (typeof data.age !== 'number' || data.age < 13 || data.age > 99) {
    errors.push("Invalid age. It should be a number between 13 and 99.");
  }

  const sectionRegex = /^[A-I]$/;
  if (!sectionRegex.test(data.section)) {
    errors.push("Invalid section. It should be a single uppercase letter (A-I).");
  }

  if (typeof data.sex !== 'boolean') {
    errors.push("Invalid sex. It should be a boolean value (true or false).");
  }

  if (errors.length > 0) {
    return { valid: false, message: errors };
  }

  return { valid: true, message: "Data is valid." };
}
