import { useState, useEffect } from 'react';
import ArrowRight from '@icons/arrowRight';
import Header from '@components/header';
import { getUser, getPhotos, getUserByParams, getPhotosByParams } from '@api/api';
import { useNavigate, useLocation } from 'react-router';
import { Spacer } from '@heroui/spacer';
import { handleError } from '@utils/utils';
import { showToast } from '@components/toast';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [urls, setUrls] = useState([]);
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");

  useEffect(() => {
    async function fetchUser() {
      try {
        let response;
        if (!email) {
          response = await getUser();
        } else {
          response = await getUserByParams(atob(email));
        }

        const error = handleError(response);
        if (error) {
          showToast(`Errore nel caricamento del profilo: ${error.error}`, 'error');
          return;
        }

        setUser(response.data);
      } catch (error) {
        showToast('Errore imprevisto nel caricamento del profilo', 'error');
        console.error("Error in the fetch of data:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchPhotos() {
      try {
        let response;
        if (!email) {
          response = await getPhotos();
        } else {
          response = await getPhotosByParams(atob(email));
        }

        const error = handleError(response);
        if (error) {
          showToast(`Errore nel caricamento delle foto: ${error.error}`, 'error');
          return;
        }

        const imageUrls = response.data?.images?.map(image =>
          image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`
        ) || [];

        setUrls(imageUrls);
      } catch (error) {
        showToast('Errore imprevisto nel caricamento delle immagini', 'error');
        console.error('Errore nel recupero delle foto:', error);
      }
    }

    fetchUser();
    fetchPhotos();
  }, [email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-2xl">
        Caricamento...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-2xl">
        Errore nel caricamento
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-pink-700 p-4">
      <Header />
      <Spacer y={20} />
      <div className="mt-10 bg-white w-full max-w-md rounded-2xl p-6 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-black mb-5">
          PROFILO
        </h2>

        <div className="relative mx-auto w-24 h-24 bg-gray-200 rounded-full overflow-hidden border-4 border-pink-700">
          <img
            src={urls[0] || '/placeholder.jpg'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center mt-5">
          <h3 className="text-xl font-bold text-black">
            {user.user?.given_name || 'Nome non disponibile'}
          </h3>
          <p className="text-black text-sm">
            {user.user_info?.bio || 'Nessuna bio disponibile'}
          </p>
        </div>

        <div className="flex justify-between mt-6 px-10 text-black">
          <div className="text-center">
            <p className="text-sm font-bold">ETÁ</p>
            <p>{user.user_info?.age || 'N/D'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold">SESSO</p>
            <p>{user.user_info?.sex === true ? 'Uomo' : 'Donna'}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold">MATCH</p>
            <p>{user.user_info?.match || 0}</p>
          </div>
        </div>

        {/* Immagini extra */}
        <div className="mt-6">
          <p className="font-bold text-black">GALLERIA:</p>
          <div className="flex gap-2 mt-2">
            {urls.length > 0 ? (
              urls.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`User ${index}`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ))
            ) : (
              <p className="text-sm text-gray-500">
                Nessuna immagine disponibile
              </p>
            )}
          </div>
        </div>

        {email == null && (
          <div className="w-full mt-10 flex justify-center">
            <button
              onClick={() => navigate('/update')}
              className="w-[80%] h-[43px] rounded-3xl bg-pink-700 text-white flex items-center justify-center gap-2 shadow-md"
            >
              <span className="font-bold">Modifica</span>
              <ArrowRight className="text-xl" width="30" height="25" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
