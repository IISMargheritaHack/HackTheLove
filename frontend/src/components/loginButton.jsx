import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import { GetSignedJWT } from '@api/auth';
import { showToast } from '@components/toast'
import 'toastify-js/src/toastify.css';
import { handleError } from '@utils/utils';

export default function LoginButton() {
  const navigate = useNavigate();
  const handleRedirect = () => {
    if (localStorage.getItem('introEnded') === 'true') {
      navigate('/bio', {});
      return;
    }
    navigate('/intro', {});
  };

  const handleLoginSuccess = async (CredentialResponse) => {
    try {
      let response = await GetSignedJWT(CredentialResponse.credential);
      const error = handleError(response);
      if (error) {
        showToast(`Errore nel caricamento del profilo: ${error.error}`, 'error');
        return;
      }
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
      }}
    />
  );
}
