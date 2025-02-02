import './App.css';

import React from 'react';
import LoginPage from '@pages/loginPage/loginPage';
import { isMobile } from 'react-device-detect';
import { BrowserRouter, Route, Routes } from 'react-router';
import IntroPage from '@pages/introPage/introPage.jsx';
import ProtectedRoute from '@components/protectedRoutes';
import BioPage from '@pages/bioPage/bioPage';
import SurveyPage from '@pages/surveyPage/surveyPage';
import HomePage from './pages/homePage/homePage';
import Page404 from './pages/404Page';

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
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />{' '}
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/intro"
          element={
            <ProtectedRoute>
              <IntroPage /> {/* Homepage */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/bio"
          element={
            <ProtectedRoute>
              <BioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/survey"
          element={
            <ProtectedRoute>
              <SurveyPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
