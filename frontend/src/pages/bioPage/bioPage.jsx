import './bioPage.css';

function BioPage() {
  return (
    <div>
      <div id="header">
        <img id="logoBioPage" src={'logo.svg'} alt="Logo" />
      </div>

      <div className="" id="title">
        <h1 id="titleBioPage">Alcune informazioni personali</h1>
      </div>

      <div id="input-nome/cognome" className="mt-12 max-w-sm">
        <label
          htmlFor="input-label"
          className="block text-left font-medium mb-2 dark:text-white"
        >
          Nome
        </label>
        <input
          type="text"
          id="input-label"
          className=" inputNS py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 placeholder:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          placeholder="Mario"
        />

        <div className="mt-5">
          <label
            htmlFor="input-label"
            className="block text-left font-medium mb-2 dark:text-white"
          >
            Cognome
          </label>
          <input
            type="text"
            id="input-label"
            className=" inputNS text-pink-600 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 placeholder:opacity-50  disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-pink-600 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Rossi"
          />
        </div>
        <div className="mt-15">
          <label
            htmlFor="input-label"
            className="block text-left font-medium mb-2 dark:text-white"
          >
            Numero di telefono
          </label>
          <input
            type="number"
            id="input-label"
            className=" inputTelephone py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 placeholder:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="+39"
          />
        </div>
      </div>
    </div>
  );
}

export default BioPage;
