import ArrowRight from '@icons/arrowRight';
import Logo from '@components/logo';
import { useNavigate } from 'react-router';
import { showToast } from '@components/toast';
import 'toastify-js/src/toastify.css';

function BioPage() {
  const navigate = useNavigate();

  const validateForm = () => {
    const nome = document.getElementById('input-nome').value.trim();
    const cognome = document.getElementById('input-cognome').value.trim();
    const telefono = document.getElementById('input-telefono').value.trim();
    const sesso = document.getElementById('input-sesso').value;
    const sezione = document.getElementById('input-sezione').value;
    const bio = document.getElementById('input-bio').value.trim();

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
    <div id="main" className="flex flex-col items-center justify-center min-h-screen px-4 py-6">
      <div id="header" className="mb-6">
        <Logo />
      </div>

      <div className="mt-3" id="title">
        <h1 id="titleBioPage" className="text-center text-2xl font-bold">Alcune informazioni personali</h1>
      </div>

      <div className="w-full max-w-md flex flex-col items-center">
        <div id="input-nome/cognome" className="mt-6 w-full max-w-sm">
          <label className="block text-left font-medium mb-2">Nome</label>
          <input
            type="text"
            id="input-nome"
            className="bg-white text-black focus:outline-pink-500 rounded-lg h-10 py-3 px-4 block w-full"
            placeholder="Mario"
          />

          <div className="mt-5">
            <label className="block text-left font-medium mb-2">Cognome</label>
            <input
              type="text"
              id="input-cognome"
              className="bg-white text-black focus:outline-pink-500 rounded-lg h-10 py-3 px-4 block w-full"
              placeholder="Rossi"
            />
          </div>

          <div className="mt-5">
            <label className="block text-left font-medium mb-2">Numero di telefono</label>
            <input
              type="number"
              id="input-telefono"
              className="bg-white focus:outline-pink-500 text-black rounded-lg h-10 py-3 px-4 block w-full"
              placeholder="+39"
            />
          </div>

          <div className="mt-5 flex gap-x-4">
            <div className="w-1/2">
              <label className="block text-left font-medium mb-2">Sesso</label>
              <select id="input-sesso" className="bg-white focus:outline-pink-500 text-black rounded-lg py-3 px-4 block w-full">
                <option value="">Seleziona...</option>
                <option value="true" >Maschio</option>
                <option value="false">Donna</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="block text-left font-medium mb-2">Sezione</label>
              <select id="input-sezione" className="bg-white focus:outline-pink-500 text-black rounded-lg py-3 px-4 block w-full">
                <option value="">Seleziona...</option>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
                <option value="e">E</option>
                <option value="f">F</option>
                <option value="g">G</option>
                <option value="h">H</option>
                <option value="i">I</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-left font-medium mb-2">Bio</label>
            <textarea
              id="input-bio"
              className="bg-white text-black focus:outline-pink-500 rounded-lg py-3 px-4 block w-full"
              rows="3"
              placeholder="Mi piace il calcio"
            ></textarea>
          </div>

          <div className="w-full mt-10 flex justify-center">
            <button
              className="w-[80vw] h-[43px] rounded-4xl bg-white text-black flex items-center justify-center gap-2 shadow-md"
              onClick={handleSubmit}
            >
              <span className="font-bold">Avanti</span>
              <ArrowRight className="text-xl" width="30" height="25" />
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}

export default BioPage;
