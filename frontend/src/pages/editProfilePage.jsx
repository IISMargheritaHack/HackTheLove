import { addUserInfo, getUser, getPhotos, addPhotos } from '@api/api';
import Header from '@components/header';
import { showToast } from '@components/toast';
import { useEffect, useState } from 'react';
import 'toastify-js/src/toastify.css';
import { Spacer } from '@heroui/spacer';
import { handleError } from '@utils/utils';
import Spinner from '@components/spinner';
import { useNavigate } from 'react-router';

function UpdateProfile() {
  const [age, setAge] = useState(14);
  const [user, setUser] = useState(null);
  const [classe, setClasse] = useState("");
  const [sex, setSex] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatPhoto, setUpdatPhoto] = useState(false);
  const [section, setSection] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resultUser = await getUser();
        const user = resultUser.data;

        let resPhotos = await getPhotos();
        if (resPhotos.error === "No images found") {
          setUpdatPhoto(true);
        }

        if (resultUser?.error) {
          showToast(resultUser.error, 'error');
        }

        if (user?.user_info) {
          setClasse(user.user_info.classe || "");
          setSection(user.user_info.section || "A");
          setAge(user.user_info.age || 14)
          setSex(user.user_info.sex ? "true" : "false");
        }

        setUser(user);
      } catch (error) {
        console.error("Errore nel recupero dell'utente:", error);
      }
    };

    fetchUser();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length + files.length > 3) {
      showToast("⚠️ Puoi caricare un massimo di 3 foto!", "error");
      e.target.value = "";
      return;
    }

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    const maxSizeMB = 3 * 1024 * 1024;

    const checkMagicBytes = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const bytes = new Uint8Array(e.target.result).slice(0, 4);
          const magicNumbers = {
            png: [0x89, 0x50, 0x4e, 0x47],
            jpg: [0xff, 0xd8, 0xff],
            jpeg: [0xff, 0xd8, 0xff],
          };

          const isValid = Object.entries(magicNumbers).some(([type, magic]) =>
            magic.every((byte, index) => byte === bytes[index])
          );

          resolve(isValid);
        };
        reader.readAsArrayBuffer(file.slice(0, 4));
      });
    };

    const processFiles = async () => {
      const filteredFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          if (!validTypes.includes(file.type)) {
            showToast(
              `⚠️ Formato non valido: ${file.name}. Usa PNG, JPEG o JPG.`,
              "error"
            );
            return null;
          }

          if (file.size > maxSizeMB) {
            showToast(`⚠️ L'immagine ${file.name} supera i 3MB!`, "error");
            return null;
          }

          const isValidMagicBytes = await checkMagicBytes(file);
          if (!isValidMagicBytes) {
            showToast(
              `⚠️ Il file ${file.name} non ha una firma valida!`,
              "error"
            );
            return null;
          }

          return {
            file,
            preview: URL.createObjectURL(file),
          };
        })
      );

      const validFiles = filteredFiles.filter((file) => file !== null);
      console.log(validFiles)
      if (validFiles.length > 0) {
        setFiles([...files, ...validFiles]);
      }
    };
    console.log(files)
    processFiles();
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

    if (!telefono || !sesso || !sezione || !bio || !classe) {
      showToast('⚠️ Tutti i campi sono obbligatori!', 'error');
      return false;
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(telefono)) {
      showToast('⚠️ numero di telefono almeno 10 cifre!', 'error');
      return false;
    }

    return true;
  };

  const handleSubmitInfo = async () => {
    const phone = document.getElementById('input-phone').value.trim();
    const sex = document.getElementById('input-sex').value;
    const section = document.getElementById('input-section').value;
    const bio = document.getElementById('input-bio').value.trim();
    const classe = document.getElementById('input-class').value.trim();

    const data = {
      phone,
      sex: sex === 'true',
      section: section.toUpperCase(),
      bio,
      age: age,
      classe: parseInt(classe),
    };

    let results = await addUserInfo(data);
    const errorUserInfo = handleError(results);
    if (errorUserInfo) {
      showToast(errorUserInfo.error, 'error');
      return true;
    }

    if (updatPhoto) {
      results = await addPhotos(files.map(fileObj => fileObj.file));
      let error = handleError(results);
      if (error) {
        showToast(results.data.message || "Errore durante il caricamento delle foto.", 'error');
        return true;
      }
    }
    return false;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      let result = await handleSubmitInfo();
      if (result) {
        setLoading(false);
        showToast('Errore durante il caricamento delle foto.', 'error');
        return;
      }
      showToast('✅ Informazioni salvate con successo!', 'success');
      navigate('/profile');
    }
  };

  const encreaseAge = () => setAge(prevEta => Math.min(prevEta + 1, 100));
  const decreaseAge = () => setAge(prevEta => Math.max(prevEta - 1, 1));

  return (
    <div>
      <Header />
      <Spacer y={10} />
      <div id="main" className="flex flex-col items-left justify-start min-h-screen px-4 py-6 m-2">
        {loading ? (
          <div className="absolute inset-0 m-auto flex items-center justify-center opacity-105">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="mt-3" id="title">
              <h1 className="text-left text-[1.2rem] font-bold selection:bg-pink-300 selection:text-white">Modifica il profilo</h1>
            </div>

            <div className="w-full max-w-md flex flex-col items-left">
              <div className="mt-5">
                <label className="block text-left font-medium mb-2">Numero di telefono</label>
                <input
                  type="text"
                  id="input-phone"
                  defaultValue={user?.user_info?.phone || ''}
                  className="bg-white focus:outline-pink-500 text-black rounded-lg h-10 py-3 px-4 block w-full"
                  placeholder="+39123456790 (prefisso non obbligatorio)"
                />
              </div>

              <div className="mt-5 flex gap-x-4">
                <div className="w-1/2">
                  <label className="block text-left font-medium mb-2">Classe</label>
                  <select
                    id="input-class"
                    value={classe}
                    onChange={(e) => setClasse(e.target.value)}
                    className="bg-white focus:outline-pink-500 text-black rounded-lg py-3 px-4 block w-full"
                  >
                    <option value="">Seleziona...</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className="w-1/2">
                  <label className="block text-left font-medium mb-2">Sezione</label>
                  <select
                    id="input-section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="bg-white focus:outline-pink-500 text-black rounded-lg py-3 px-4 block w-full"
                  >
                    <option value="">Seleziona...</option>
                    {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>
              </div>


              <div className="mt-5 flex gap-x-4">
                <div className="w-1/2">
                  <label className="block text-left font-medium mb-2">Sesso</label>
                  <select id="input-sex" value={sex} onChange={(e) => setSex(e.target.value)} className="bg-white focus:outline-pink-500 text-black rounded-lg py-3 px-4 block w-full">
                    <option value="">Seleziona...</option>
                    <option value="true">Uomo</option>
                    <option value="false">Donna</option>
                  </select>
                </div>

                <div className="w-1/2">
                  <label className="block text-left font-medium mb-2">Età</label>
                  <div className="py-2 px-3 bg-gray-100 rounded-lg">
                    <div className="w-full flex justify-between items-center gap-x-5">
                      <div className="grow">
                        <input className="w-full focus:outline-pink-500 p-0 bg-transparent border-0 text-gray-800" type="number" aria-roledescription="Number field" value={age} onChange={() => { }} />
                      </div>
                      <div className="flex justify-end items-center gap-x-1.5">
                        <button onClick={decreaseAge} type="button" className="inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none">
                          <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 12h14"></path>
                          </svg>
                        </button>
                        <button onClick={encreaseAge} type="button" className="inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none">
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
                  defaultValue={user?.user_info?.bio || ''}
                  className="bg-white text-black focus:outline-pink-500 selection:bg-pink-300 selection:text-white rounded-lg py-3 px-4 block w-full"
                  rows="3"
                  placeholder="Mi piace il calcio"
                ></textarea>
              </div>

              {updatPhoto ? (
                <div className="max-w-[40vh] mt-10">
                  <form>
                    <label className="block">
                      <span className="sr-only">Scegli le foto del profilo</span>
                      <input
                        type="file"
                        multiple
                        max={5}
                        accept="image/png, image/jpeg, image/jpg"
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
                          loading='lazy'
                          src={file.preview}
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
              ) : null}

              <div className="w-full mt-10 flex justify-center">
                <button
                  className="w-[80vw] h-[43px] rounded-4xl bg-white text-black flex items-center justify-center gap-2 shadow-md"
                  onClick={handleSubmit}
                >
                  <span className="font-bold">Update</span>
                </button>
              </div>
            </div>
          </>)}
      </div>
    </div>
  );
}

export default UpdateProfile;
