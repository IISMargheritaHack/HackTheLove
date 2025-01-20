import './App.css'
import { GoogleLogin } from '@react-oauth/google';
import * as jwtDecode from 'jwt-decode';

function App() {
  return (
    <GoogleLogin
      hosted_domain='iismargheritahackbaronissi.edu.it'
      onSuccess={(CredentialResponse) => {
        const CredentialResponseDecoded = jwtDecode.jwtDecode(
          CredentialResponse.credential
        );
        console.log(CredentialResponseDecoded);
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );

}

export default App;