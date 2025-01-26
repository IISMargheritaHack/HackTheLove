import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router';
import { GetSignedJWT } from '../api/auth';

export default function LoginButton() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/introPage', {});
  };

  const handleLoginSuccess = async (CredentialResponse) => {
    try {
      await GetSignedJWT(CredentialResponse.credential);
      handleRedirect();
    } catch (error) {
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
        console.log('Login Failed');
      }}
    />
  );
}
