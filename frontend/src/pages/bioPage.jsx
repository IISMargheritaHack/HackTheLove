import ArrowRight from '@icons/arrowRight';
import Logo from '@components/logo';
import { useNavigate } from 'react-router';
import { showToast } from '@components/toast';
import 'toastify-js/src/toastify.css';
import { useState } from 'react';
import { addUserInfo, addPhotos, getUser } from '@api/api';
import { handleError } from '@utils/utils';
import { useEffect } from 'react';
import Spinner from '@components/spinner';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import { Button } from '@heroui/button';


function BioPage() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [age, setEta] = useState(14);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchUser = async () => {
      let res = await getUser();
      let error = handleError(res);
      if (error) {
        navigate('/login');
      }

      if (res.data.user_info.age != null && res.data.user_info.sex != null) {
        navigate('/survey');
      }
    }
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Non ti consiglio di aggiornare le foto potrebbero andare perse!";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);


  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length + files.length > 3) {
      showToast("⚠️ Puoi caricare un massimo di 3 foto!", "error");
      e.target.value = "";
      return;
    }

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    const maxSizeMB = 3 * 1024 * 1024; // 5MB in byte

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
        setFiles((prevFiles) => [...prevFiles, ...validFiles]);
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

    if (!telefono || !sesso || !sezione || !bio || !classe || files.length === 0) {
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

  async function handleSubmitInfo() {
    const phone = document.getElementById('input-phone').value.trim();
    const sex = document.getElementById('input-sex').value;
    const section = document.getElementById('input-section').value;
    const bio = document.getElementById('input-bio').value.trim();
    const classe = document.getElementById('input-class').value.trim();
    const ageData = age;

    const data = {
      phone: phone,
      sex: sex === 'true',
      section: section.toUpperCase(),
      bio: bio,
      age: ageData,
      classe: parseInt(classe)
    };

    let results = await addUserInfo(data);
    let error = handleError(results);
    if (error) {
      showToast(results.data.message, 'error');
      return true;
    }

    results = await addPhotos(files.map(file => file.file));
    error = handleError(results);
    if (error) {
      showToast(results.data.message || "Errore durante il caricamento delle foto.", 'error');
      return true;
    }


    return false;
  }

  const handleSubmit = async () => {
    setLoading(true);
    if (validateForm()) {
      let err = await handleSubmitInfo();
      if (err) {
        setLoading(false);
        return;
      }
      showToast('✅ Informazioni salvate con successo!', 'success');
      navigate('/survey');
    } else {
      setLoading(false);
    }
  };

  const encreaseAge = () => setEta(prevEta => Math.min(prevEta + 1, 100));
  const decreaseAge = () => setEta(prevEta => Math.max(prevEta - 1, 1));

  return (
    <div id="main" className="flex flex-col items-left justify-start min-h-screen px-4 py-6 m-2">
      {loading ? (
        <div className="absolute inset-0 m-auto flex items-center justify-center opacity-105">
          <Spinner />
        </div>
      ) : (
        <>
          <Modal isOpen={isOpen} placement='auto' className='bg-white text-black rounded-lg m-0' onOpenChange={onOpenChange} backdrop="blur" radius="lg">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Sei sicuro?</ModalHeader>
                  <ModalBody> Le foto potranno essere scelte solo una volta!</ModalBody>
                  <div className="flex items-center gap-6 m-5 justify-center">
                    <Button className='bg-red-800 text-white min-w-[40vw] rounded-lg' color="danger" onPress={onClose}>Annulla</Button>
                    <Button className='bg-pink-500 text-white min-w-[40vw] rounded-lg ' color="primary" onPress={() => { handleSubmit(); onClose() }}>Conferma</Button>
                  </div>
                </>
              )}
            </ModalContent>
          </Modal>

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
                type="text"
                id="input-phone"
                className="bg-white focus:outline-pink-500 text-black rounded-lg h-10 py-3 px-4 block w-full"
                placeholder="+39123456790 (prefisso non obbligatorio)"
              />
            </div>

            <div className="mt-5 flex gap-x-4">
              <div className="w-1/2">
                <label className="block text-left font-medium mb-2">Classe</label>
                <select id="input-class" className="bg-white focus:outline-pink-500 text-black rounded-lg py-3 px-4 block w-full">
                  <option value="">Seleziona...</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label className="block text-left font-medium mb-2">Sezione</label>
                <select id="input-section" className="bg-white focus:outline-pink-500 text-black rounded-lg py-3 px-4 block w-full">
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
                <select id="input-sex" className="bg-white focus:outline-pink-500 text-black rounded-lg py-3 px-4 block w-full">
                  <option value="">Seleziona...</option>
                  <option value="true" >Uomo</option>
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

            <div className="w-full mt-10 flex justify-center">
              <button
                className="w-[80vw] h-[43px] rounded-4xl bg-white text-black flex items-center justify-center gap-2 shadow-md"
                onClick={onOpen}
              >
                <span className="font-bold">Avanti</span>
                <ArrowRight className="text-xl" width={30} height={25} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default BioPage;
