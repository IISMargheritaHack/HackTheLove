import "./loginPage.css";
import "../component/loginButton";
import LButton from "../component/loginButton";
import { Link } from "react-router";
function LoginPage() {
  return (
    <div id="main">
      <div id="header" className="mt-[28vh]">
        <div id="center" className="">
          <img id="logo" src={"logo.svg"} alt="Logo" />
        </div>

        <div id="Hack" className=" flex">
          <h1 className="ms-auto me-auto" id="h1">
            Hack The Love
          </h1>
        </div>

        <div className="mt-2">
          <p id="p1">Scopri chi è la tua anima gemella nella scuola</p>
        </div>
      </div>

      <div id="container-footer" className="center mt-56">
        <div id="services">
          <p id="p2">
            Cliccando Log in accetti automaticamente i nostri termini di
            servizio. Leggi come gestiamo i tuoi dati con la nostra <br></br>
            <span className="underline">Privacy Policy</span> e{" "}
            <span className="underline">Coockies Policy.</span>
          </p>
        </div>

        <div id="button" className="">
          <Link to={"/page"}>
            <LButton></LButton>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
