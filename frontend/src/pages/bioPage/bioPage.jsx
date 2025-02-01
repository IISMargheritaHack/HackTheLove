import './bioPage.css';
import ArrowRight from '@icons/arrowRight';
import { useNavigate } from 'react-router';
import { showToast } from '../../components/toast';
import 'toastify-js/src/toastify.css';

function BioPage() {
  const navigate = useNavigate();

 

  // Funzione di validazione
  const validateForm = () => {
    const nome = document.getElementById('input-nome').value.trim();
    const cognome = document.getElementById('input-cognome').value.trim();
    const telefono = document.getElementById('input-telefono').value.trim();
    const sesso = document.getElementById('input-sesso').value;
    const sezione = document.getElementById('input-sezione').value;
    const bio = document.getElementById('input-bio').value.trim();

    // Controllo campi vuoti
    if (!nome || !cognome || !telefono || !sesso || !sezione || !bio) {
      showToast('⚠️ Tutti i campi sono obbligatori!', 'error');
      return false;
    }

    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(telefono)) {
      showToast('⚠️ numero di telefono almeno 10 cifre!', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      showToast('✅ Informazioni salvate con successo!', 'success');
      navigate('/surveyPage');
    }
  };

  return (
    <div className="max-w-[350px]">
      <div className="ml-[21px]" id="header">
        <img id="logoBioPage" src={'logo.svg'} alt="Logo" />
      </div>

      <div className="mt-3" id="title">
        <h1 id="titleBioPage">Alcune informazioni personali</h1>
      </div>

      <div id="input-nome/cognome" className="mt-12 mr-32 max-w-sm">
        <label className="block text-left font-medium mb-2 dark:text-white">
          Nome
        </label>
        <input
          type="text"
          id="input-nome"
          className="input py-3 px-4 block w-full"
          placeholder="Mario"
        />

        <div className="mt-5">
          <label className="block text-left font-medium mb-2 dark:text-white">
            Cognome
          </label>
          <input
            type="text"
            id="input-cognome"
            className="input py-3 px-4 block w-full"
            placeholder="Rossi"
          />
        </div>

        <div className="mt-5">
          <label className="block text-left font-medium mb-2 dark:text-white">
            Numero di telefono
          </label>
          <input
            type="number"
            id="input-telefono"
            className="input py-3 px-4 block w-full"
            placeholder="+39"
          />
        </div>

        <div className="mt-5 flex gap-x-4">
          <div>
            <label className="block text-left font-medium mb-2 dark:text-white">
              Sesso
            </label>
            <select id="input-sesso" className="select py-3 px-4 block w-full">
              <option value="">Seleziona...</option>
              <option>Maschio</option>
              <option>Donna</option>
            </select>
          </div>

          <div>
            <label className="block text-left font-medium mb-2 dark:text-white">
              Sezione
            </label>
            <select
              id="input-sezione"
              className="select py-3 px-4 block w-full"
            >
              <option value="">Seleziona...</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
              <option>E</option>
              <option>F</option>
              <option>G</option>
              <option>H</option>
              <option>I</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-left font-medium mb-2 dark:text-white">
            Bio
          </label>
          <textarea
            id="input-bio"
            className="textBio py-3 px-4 block w-full"
            rows="3"
            placeholder="Mi piace il calcio"
          ></textarea>
        </div>

        <div className="w-[40vh] mt-10">
          <button
            className="w-[291px] h-[43px] rounded-[47px] bg-white text-black mt-28"
            onClick={handleSubmit}
          >
            <div className="flex items-center">
              <span className="ml-[120px] font-bold">Avanti</span>
              <div className="ml-auto">
                <ArrowRight className="text-8xl" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BioPage;
