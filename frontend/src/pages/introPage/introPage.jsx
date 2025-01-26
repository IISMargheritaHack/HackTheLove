import './introPage.css';
import SlideIntroPage from '@components/slideIntroPage';

function IntroPage() {
  return (
    <div id="main">
      <div id="header" className="mt-[28vh]">
        <div id="center" className="">
          <img className="logoPage" src={'logo.svg'} alt="Logo" />
        </div>
        <div>
          <SlideIntroPage />
        </div>
      </div>
    </div>
  );
}
export default IntroPage;
