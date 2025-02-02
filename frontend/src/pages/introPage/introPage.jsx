import Logo from '@components/logo';
import SlideIntroPage from '@components/slideIntroPage';

function IntroPage() {
  return (
    <div id="main" className="flex flex-col items-center min-h-screen px-4 py-6">
      <div id="header" className="mt-[20vh] flex flex-col items-center text-center">
        <Logo />
        <div className="flex justify-center w-full mt-4">
          <SlideIntroPage />
        </div>
      </div>
    </div>
  );
}

export default IntroPage;
