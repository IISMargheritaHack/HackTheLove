import { GoogleLogin } from "@react-oauth/google";
import * as jwtDecode from "jwt-decode";

function LButton() {
  return (
    <GoogleLogin
      hosted_domain="iismargheritahackbaronissi.edu.it"
      shape="pill"
      width={"350px"}
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

export default LButton;
