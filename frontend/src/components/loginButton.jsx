import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import { GetSignedJWT } from '../api/auth';
import { showToast } from './toast'
import 'toastify-js/src/toastify.css';

export default function LoginButton() {
  const navigate = useNavigate();

  

  const handleRedirect = () => {
    navigate('/introPage', {});
  };

  const handleLoginSuccess = async (CredentialResponse) => {
    try {
      await GetSignedJWT(CredentialResponse.credential);
      showToast('✅ Login avvenuto con successo!', 'success');
      handleRedirect();
    } catch (error) {
      showToast('❌ Errore durante il login. Riprova!', 'error');
      console.error('Errore durante il login:', error);
    }
  };

  return (
    <GoogleLogin
      hosted_domain="iismargheritahackbaronissi.edu.it"
      shape="pill"
      width={'350px'}
      onSuccess={handleLoginSuccess}
      onError={() => {
        showToast('❌ Login fallito. Riprova!', 'error');
        console.log('Login Failed');
      }}
    />
  );
}
