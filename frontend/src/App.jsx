import './App.css';

import ProtectedRoute from '@components/protectedRoutes';
import Page404 from '@pages/404Page';
import BioPage from '@pages/bioPage';
import HomePage from '@pages/homePage';
import IntroPage from '@pages/introPage.jsx';
import LoginPage from '@pages/loginPage';
import ProfilePage from '@pages/profilePage';
import SurveyPage from '@pages/surveyPage';
import PaginaWaiting from '@pages/paginaWaiting';
import MatchPage from '@pages/matchPage';

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
            <Route path="/likes" element={<MatchPage />} />
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
