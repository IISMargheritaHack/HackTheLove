import './App.css';

import React from 'react';
import LoginPage from '@pages/loginPage/loginPage';
import { isMobile } from 'react-device-detect';
import { BrowserRouter, Route, Routes } from 'react-router';
import IntroPage from '@pages/introPage/introPage.jsx';

function App() {

  const AlertMessageDesktop =
    'ATTENTO Il sito è disponibile solo da cellulare!';

  React.useEffect(() => {
    if (!isMobile) {
      {
        alert(AlertMessageDesktop);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Homepage */}
        <Route path="/introPage" element={<IntroPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
