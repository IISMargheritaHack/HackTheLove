import { api } from './api';

async function GetSignedJWT(googleToken) {
  try {
    const response = await api.post(
      '/verifyGoogleJWT',
      { idToken: googleToken },
    );
    console.debug(response.data.token)
    localStorage.setItem('jwt', response.data.token);
  } catch (error) {
    console.error('Errore durante la richiesta:', error);
  }
}

export { GetSignedJWT };
