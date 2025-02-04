import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import UserProvider from '@provider/userProvider';

const devTokenOAuth =
  '443648413060-db7g7i880qktvmlemmcnthg4qptclu2l.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <GoogleOAuthProvider clientId={devTokenOAuth}>
        <App />
      </GoogleOAuthProvider>
    </UserProvider>
  </StrictMode>
);
