import './App.css';

import ProtectedRoute from '@components/protectedRoutes';
import Page404 from '@pages/404Page';
import BioPage from '@pages/bioPage';
import MainPage from '@pages/mainPage';
import IntroPage from '@pages/introPage.jsx';
import LoginPage from '@pages/loginPage';
import ProfilePage from '@pages/profilePage';
import SurveyPage from '@pages/surveyPage';
import MatchPage from '@pages/matchPage';
import UpdateProfile from '@pages/editProfilePage'
import Logout from '@pages/logoutPage';

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
          <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/likes" element={<MatchPage />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/update" element={<UpdateProfile />} />
            <Route path="/intro" element={<IntroPage />} />
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
