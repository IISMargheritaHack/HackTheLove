import './App.css'

import React from "react";
import LoginPage from './component/loginPage';
import { isMobile } from "react-device-detect";

function App() {
  React.useEffect(() => {
    if (!isMobile) {
      alert("ATTENTO Il sito e' disponibile solo da cellulare!");
    }
  }, []);
  return (
   <LoginPage>
   </LoginPage>
  );

}

export default App;


