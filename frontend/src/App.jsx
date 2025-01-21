import './App.css'
import React from "react";
import LoginPage from './component/loginPage';
import { isMobile } from "react-device-detect";

function App() {
  React.useEffect(() => {
    if (!isMobile) {
      alert("Stai utilizzando un dispositivo non mobile!");
    }
  }, []);
  return (
   <LoginPage>
   </LoginPage>
  );

}

export default App;

