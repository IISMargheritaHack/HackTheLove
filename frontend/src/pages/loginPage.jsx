import Logo from '@components/logo';
import LoginButton from '@components/loginButton';
function LoginPage() {
  return (
    <div id="main" className="flex flex-col min-h-screen px-4 py-6 text-[1rem] justify-evenly mt-[10vh] md:text-[1.2rem] lg:text-[1.5rem]">
      <div id="header" className="flex flex-col items-center text-center">
        <Logo width={6} />
        <div id="Hack" className="flex">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-6" id="titleLoginPage">
            Hack The Love
          </h1>
        </div>
        <div className="mt-2">
          <p id="Subtitle" className="text-xs md:text-base lg:text-lg text-center leading-3.5">
            Scopri chi è la tua anima gemella nella scuola
          </p>
        </div>
      </div>
      <div id="container-footer" className="w-full max-w-xs mx-auto pb-4">
        <div id="services" className="text-center">
          <p id="pLoginPage" className="leading-3.5 text-xs md:text-sm lg:text-base">
            Cliccando Log in accetti automaticamente i nostri termini di
            servizio. Leggi come gestiamo i tuoi dati con la nostra <br />
            <span className="underline">Privacy Policy</span> e{' '}
            <span className="underline">Coockies Policy.</span>
          </p>
        </div>
        <div id="buttonLoginPage" className="mt-4 flex justify-center">
          <LoginButton className="w-full max-w-xs py-3 rounded-lg shadow-md transition duration-300" />
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
