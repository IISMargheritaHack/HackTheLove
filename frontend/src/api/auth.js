import { api } from './api';

async function GetSignedJWT(googleToken) {
  try {
    const response = await api.post(
      '/verifyGoogleJWT',
      { idToken: googleToken },
    );
    localStorage.setItem('jwt', response.data.token);
    return { "data": response.data, "status": response.status }
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
  }
}

export { GetSignedJWT };
