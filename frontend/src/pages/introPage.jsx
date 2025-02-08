import Logo from '@components/logo';
import SlideIntroPage from '@components/slideIntroPage';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
function IntroPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('introCompleted') === 'true') {
      navigate('/bio');
    }
  }, [navigate]);

  return (
    <div id="main" className="flex flex-col items-center min-h-screen px-4 py-6">
      <div id="header" className="mt-[20vh] flex flex-col items-center text-center">
        <Logo width={6} />
        <div className="flex justify-center w-full mt-4">
          <SlideIntroPage />
        </div>
      </div>
    </div>
  );
}

export default IntroPage;
