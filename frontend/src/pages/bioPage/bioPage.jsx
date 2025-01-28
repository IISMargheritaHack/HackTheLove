import './bioPage.css';
import ArrowRight from '@icons/arrowRight';
import { useNavigate } from 'react-router';

function BioPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-[350px]">
      <div className="ml-[21px]" id="header">
        <img id="logoBioPage" src={'logo.svg'} alt="Logo" />
      </div>

      <div className="mt-3" id="title">
        <h1 id="titleBioPage">Alcune informazioni personali</h1>
      </div>

      <div id="input-nome/cognome" className="mt-12 mr-32 max-w-sm">
        <label
          htmlFor="input-label"
          className="block text-left font-medium mb-2 dark:text-white"
        >
          Nome
        </label>
        <input
          type="text"
          id="input-label"
          className=" input py-3 px-4 block w-full border-gray-200 rounded-lg text-sm placeholder:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-pink-600 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
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
            className=" input text-pink-600 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm placeholder:opacity-50  disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-pink-600 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="Rossi"
          />
        </div>
        <div className="mt-5">
          <label
            htmlFor="input-label"
            className="block text-left font-medium mb-2 dark:text-white"
          >
            Numero di telefono
          </label>
          <input
            type="number"
            id="input-label"
            className=" input py-3 px-4 block w-full border-gray-200 rounded-lg text-sm placeholder:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            placeholder="+39"
          />
          <div className="mt-7">
            <div className="flex">
              <label
                htmlFor="input-label"
                className="block text-left font-medium mb-2 dark:text-white"
              >
                Sesso
              </label>
              <div className="px-13">
                <label
                  htmlFor="input-label"
                  className="block text-left font-medium mb-2 dark:text-white"
                >
                  Sezione
                </label>
              </div>
            </div>
            <div className="flex pr-10">
              <select className=" select py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                <option selected=""></option>
                <option>Maschio</option>
                <option>Donna</option>
                <option>Viscardi</option>
              </select>

              <select className=" select py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                <option selected=""></option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
                <option>E</option>
                <option>F</option>
                <option>G</option>
                <option>H</option>
              </select>
            </div>
          </div>
          <div className="mt-5">
            <label
              htmlFor="input-label"
              className="block text-left font-medium mb-2 dark:text-white"
            >
              Bio
            </label>
            <div className="max-w-sm space-y-3">
              <textarea
                className="textBio py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                rows="3"
                placeholder="Mi piace il calcio"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="mt-[50px] ml-[34px]">
          <button
            className="w-[291px] h-[43px] rounded-[47px] bg-white  text-black mt-28 "
            onClick={() => navigate('/questionPage')}
          >
            <div className="flex items-center">
              <span className="ml-[120px] font-bold">Avanti</span>
              <div className="ml-auto">
                <ArrowRight className="text-8xl " />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BioPage;
