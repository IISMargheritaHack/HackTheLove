import './loginPage.css';
import LoginButton from '@components/loginButton';

function LoginPage() {
  return (
    <div id="main">
      <div id="header" className="mt-[28vh]">
        <div id="center" className="">
          <img className="logoPage" src={'logo.svg'} alt="Logo" />
        </div>

        <div id="Hack" className=" flex">
          <h1 className="ms-auto me-auto" id="titleLoginPage">
            Hack The Love
          </h1>
        </div>

        <div className="mt-2">
          <p id="Subtitle">Scopri chi è la tua anima gemella nella scuola</p>
        </div>
      </div>

      <div id="container-footer" className="center mt-56">
        <div id="services">
          <p id="pLoginPage">
            Cliccando Log in accetti automaticamente i nostri termini di
            servizio. Leggi come gestiamo i tuoi dati con la nostra <br></br>
            <span className="underline">Privacy Policy</span> e{' '}
            <span className="underline">Coockies Policy.</span>
          </p>
        </div>

        <div id="buttonLoginPage" className="">
          <LoginButton></LoginButton>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
