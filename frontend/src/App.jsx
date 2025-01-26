import './App.css';

import React from 'react';
import LoginPage from '@pages/loginPage/loginPage';
import { isMobile } from 'react-device-detect';
import { BrowserRouter, Route, Routes } from 'react-router';
import IntroPage from '@pages/introPage/introPage.jsx';
import ProtectedRoute from '@components/protectedRoutes';
import BioPage from '@pages/bioPage/bioPage';
// import { healCheck } from './api/api';

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

  // (async () => {
  //   console.log(await healCheck())
  // })();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />{' '}
        {/* To remove and add homepage */}
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/introPage"
          element={
            <ProtectedRoute>
              <IntroPage /> {/* Homepage */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/bioPage"
          element={
            <ProtectedRoute>
              <BioPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
