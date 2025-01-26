import './bioPage.css';

function BioPage() {
  return (
    <div>
      <div id="header">
        <img className="logoPage" src={'logo.svg'} alt="Logo" />
      </div>

      <div className="" id="title">
        <h1 id="titleBioPage">Alcune informazioni personali</h1>
      </div>

      <div id="input-nome/cognome" className="mt-10">
        <label className="text-left">Nome</label>
        <div className="">
          <input className="inputNS" />
        </div>
        <div className="mt-10">
          <label className="text-left ">Cognome</label>
          <div>
            <input className="inputNS" />
          </div>
          <div className="mt-10">
            <label className="text-left ">Numero di telefono</label>
            <div>
              <input className="inputTelephone" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BioPage;
