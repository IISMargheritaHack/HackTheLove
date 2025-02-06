import ArrowRight from '@icons/arrowRight';
import Logo from '@components/logo';
import { useNavigate } from 'react-router';
import { showToast } from '@components/toast';
import 'toastify-js/src/toastify.css';
import { useState } from 'react';
import { addUserInfo, addPhotos } from '@api/api';

function BioPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [age, setEta] = useState(14);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      showToast("Puoi caricare un massimo di 5 foto!", 'error');
      e.target.value = "";
      return;
    }
    setFiles(selectedFiles)
  };

  const removeImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const telefono = document.getElementById('input-phone').value.trim();
    const sesso = document.getElementById('input-sex').value;
    const sezione = document.getElementById('input-section').value;
    const bio = document.getElementById('input-bio').value.trim();
    const classe = document.getElementById('input-class').value.trim();

    if (!telefono || !sesso || !sezione || !bio || !classe || files.length === 0) {
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

  async function handleSubmitInfo() {
    const phone = document.getElementById('input-phone').value.trim();
    const sex = document.getElementById('input-sex').value;
    const section = document.getElementById('input-section').value;
    const bio = document.getElementById('input-bio').value.trim();
    const classe = document.getElementById('input-class').value.trim();
    const ageData = age;

    const data = {
      phone: phone,
      sex: sex == 'true',
      section: section.toUpperCase(),
      bio: bio,
      age: ageData,
      classe: parseInt(classe)
    };

    let error = await addUserInfo(data);
    if (error) {
      console.error('Errore durante la richiesta:', error);
      return error.response?.data || { error: 'Errore sconosciuto' };
    }

    error = await addPhotos(files);
    if (error) {
      console.error('Errore durante la richiesta:', error);
      return error.response?.data || { error: 'Errore sconosciuto' };
    }
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      let err = await handleSubmitInfo();
      if (err != null) {
        console.log('Errore durante la richiesta:', err);
        showToast('🟥 Errore nella richiesta!', 'error');
        return;
      }

      showToast('✅ Informazioni salvate con successo!', 'success');
      localStorage.setItem('bioCompleted', 'true');
      navigate('/survey');
    }
  };

  const encreaseAge = () => setEta(prevEta => Math.min(prevEta + 1, 100));
  const decreaseAge = () => setEta(prevEta => Math.max(prevEta - 1, 1));

  return (
    <div id="main" className="flex flex-col items-left justify-start min-h-screen px-4 py-6 m-2">
      <div id="header" className="">
        <Logo width={4} />
      </div>

      <div className="mt-3" id="title">
        <h1 id="titleBioPage" className="text-left text-[1.2rem] font-bold selection:bg-pink-300 selection:text-white">Alcune informazioni personali</h1>
      </div>

      <div className="w-full max-w-md flex flex-col items-left">

        <div className="mt-5">
          <label className="block text-left font-medium mb-2">Numero di telefono</label>
          <input
            type="number"
            id="input-phone"
            className="bg-white focus:outline-pink-500 text-black rounded-lg h-10 py-3 px-4 block w-full"
            placeholder="+39 123456790 (prefisso non obbligatorio)"
          />
        </div>

        <div className="mt-5 flex gap-x-4">
          <div className="w-1/2">
            <label className="block text-left font-medium mb-2">Classe</label>
            <select id="input-class" className="bg-white focus:outline-pink-500 text-black rounded-lg py-3 px-4 block w-full">
              <option value="">Seleziona...</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>

          <div className="w-1/2">
            <label className="block text-left font-medium mb-2">Sezione</label>
            <select id="input-section" className="bg-white focus:outline-pink-500 text-black rounded-lg py-3 px-4 block w-full">
              <option value="">Seleziona...</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="H">H</option>
              <option value="I">I</option>
            </select>
          </div>

        </div>

        <div className="mt-5 flex gap-x-4">
          <div className="w-1/2">
            <label className="block text-left font-medium mb-2">Sesso</label>
            <select id="input-sex" className="bg-white focus:outline-pink-500 text-black rounded-lg py-3 px-4 block w-full">
              <option value="">Seleziona...</option>
              <option value="true" >Maschio</option>
              <option value="false">Donna</option>
            </select>
          </div>

          <div className="w-1/2">
            <label className="block text-left font-medium mb-2">Età</label>
            <div className="py-2 px-3 bg-gray-100 rounded-lg" data-hs-input-number="">
              <div className="w-full flex justify-between items-center gap-x-5">
                <div className="grow">
                  <input className="w-full focus:outline-pink-500 p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" aria-roledescription="Number field" value={age} onChange={() => { }} data-hs-input-number-input="" />
                </div>
                <div className="flex justify-end items-center gap-x-1.5">
                  <button onClick={decreaseAge} type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" aria-label="Decrease" data-hs-input-number-decrement="">
                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14"></path>
                    </svg>
                  </button>
                  <button onClick={encreaseAge} type="button" className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" aria-label="Increase" data-hs-input-number-increment="">
                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-5">
          <label className="block text-left font-medium mb-2">Bio</label>
          <textarea
            maxLength="500"
            id="input-bio"
            className="bg-white text-black focus:outline-pink-500 selection:bg-pink-300 selection:text-white rounded-lg py-3 px-4 block w-full"
            rows="3"
            placeholder="Mi piace il calcio"
          ></textarea>
        </div>

        <div className="max-w-[40vh] mt-10">
          <form>
            <label className="block">
              <span className="sr-only">Scegli le foto del profilo</span>
              <input
                type="file"
                multiple
                max={5}
                accept="image/png, image/jpeg, image/jpg, image/gif"
                onChange={handleFileChange}
                className="block w-full text-sm text-white
                      file:me-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-white file:text-black
                      hover:file:bg-pink-700
                      file:disabled:opacity-50 file:disabled:pointer-events-none
                      dark:text-neutral-500
                      dark:file:bg-white
                      dark:hover:file:bg-blue-400"
              />
            </label>
          </form>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mt-10 flex justify-center">
          <button
            className="w-[80vw] h-[43px] rounded-4xl bg-white text-black flex items-center justify-center gap-2 shadow-md"
            onClick={handleSubmit}
          >
            <span className="font-bold">Avanti</span>
            <ArrowRight className="text-xl" width={30} height={25} />
          </button>
        </div>
      </div>
    </div >

  );
}

export default BioPage;
