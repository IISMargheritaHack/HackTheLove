import './App.css';

import ProtectedRoute from '@components/protectedRoutes';
import Page404 from '@pages/404Page';
import BioPage from '@pages/bioPage/bioPage';
import HomePage from '@pages/homePage/homePage';
import IntroPage from '@pages/introPage/introPage.jsx';
import LoginPage from '@pages/loginPage/loginPage';
import ProfilePage from '@pages/profilePage/profilePage';
import SurveyPage from '@pages/surveyPage/surveyPage';
import PaginaWaiting from '@pages/paginaWaiting';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { Route, Routes } from 'react-router';
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";

function App() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const AlertMessageDesktop =
    'ATTENTO Il sito è disponibile solo da cellulare!';

  React.useEffect(() => {
    if (!isMobile) {
      onOpen();
    }
  }, [onOpen]);

  return (
    <div>
      {isOpen ? (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onOpen} backdrop="blur">
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1">{AlertMessageDesktop}</ModalHeader>
              </>
            )}
          </ModalContent>
        </Modal>
      ) : (
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/intro" element={<IntroPage />} />
            <Route path="/waiting" element={<PaginaWaiting />} />
            <Route path="/bio" element={<BioPage />} />
            <Route path="/survey" element={<SurveyPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Page404 />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
