import { GoogleLogin } from '@react-oauth/google';
import * as jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router';

export default function LoginButton() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/introPage');
  };

  return (
    <GoogleLogin
      hosted_domain="iismargheritahackbaronissi.edu.it"
      shape="pill"
      width={'350px'}
      onSuccess={(CredentialResponse) => {
        const CredentialResponseDecoded = jwtDecode.jwtDecode(
          CredentialResponse.credential
        );
        console.log(CredentialResponseDecoded);
        handleRedirect();
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  );
}
