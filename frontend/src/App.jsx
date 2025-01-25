import "./App.css";

import React from "react";
import LoginPage from "./pages/loginPage";
import { isMobile } from "react-device-detect";

function App() {
  const AlertMessageDesktop =
    "ATTENTO Il sito è disponibile solo da cellulare!";

  React.useEffect(() => {
    if (!isMobile) {
      {
        alert(AlertMessageDesktop);
      }
    }
  }, []);
  return <LoginPage></LoginPage>;
}

export default App;
