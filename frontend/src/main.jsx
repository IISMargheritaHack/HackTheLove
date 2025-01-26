import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Route, Routes } from 'react-router';
import IntroPage from '@pages/introPage/introPage.jsx';

const devTokenOAuth =
  '443648413060-db7g7i880qktvmlemmcnthg4qptclu2l.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={devTokenOAuth}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} /> {/* Homepage */}
          <Route path="/introPage" element={<IntroPage />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
