import { googleClientId } from '@config';
import UserProvider from '@provider/userProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import './index.css';
import { HeroUIProvider } from "@heroui/system";

if (!googleClientId) {
  console.error('Error: GOOGLE_CLIENT_ID is not defined in environment variables.');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Error: 'root' element not found. Ensure the HTML file is correctly structured.");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <HeroUIProvider>
            <App />
          </HeroUIProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </UserProvider>
  </StrictMode>
);
