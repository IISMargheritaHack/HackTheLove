import { useState, useEffect } from 'react';
import ArrowRight from '@icons/arrowRight';
import Logo from '@components/logo';
import img1 from '@assets/img/gabibbo.webp';
import img2 from '@assets/img/Martin_Luther_King_Jr.webp';
import img3 from '@assets/img/pietro.webp';
import img4 from '@assets/img/turetta.webp';
import { getUser } from '@api/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUser();
        setUser(data); // Aggiorna lo stato con i dati ottenuti
      } catch (error) {
        console.error("Errore nel recupero dell'utente:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-white text-2xl">Caricamento...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen text-white text-2xl">Errore nel caricamento</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-pink-700 p-4">
      <Logo width={60} />
      <div className="mt-10 bg-white w-full max-w-md rounded-2xl p-6 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-black mb-5">PROFILO</h2>

        {/* Immagine profilo */}
        <div className="relative mx-auto w-24 h-24 bg-gray-200 rounded-full overflow-hidden border-4 border-pink-700">
          <img src={user.profileImage || img1} alt="Profile" className="w-full h-full object-cover" />
        </div>

        <div className="text-center mt-5">
          <h3 className="text-xl font-bold text-black">{user.name || "Nome non disponibile"}</h3>
          <p className="text-black text-sm">{user.bio || "Nessuna bio disponibile"}</p>
        </div>

        {/* Info utente */}
        <div className="flex justify-between mt-6 px-10 text-black">
          <div className="text-center">
            <p className="text-sm font-bold">AGE</p>
            <p>{user.age || "N/D"}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold">SEX</p>
            <p>{user.sex || "N/D"}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold">MATCH</p>
            <p>{user.match || 0}</p>
          </div>
        </div>

        {/* Immagini extra */}
        <div className="mt-6">
          <p className="font-bold text-black">IMAGES:</p>
          <div className="flex gap-2 mt-2">
            {user.images?.length > 0 ? (
              user.images.map((img, index) => (
                <img key={index} src={img} alt={`User ${index}`} className="w-16 h-16 rounded-lg object-cover" />
              ))
            ) : (
              <p className="text-sm text-gray-500">Nessuna immagine disponibile</p>
            )}
          </div>
        </div>

        {/* Pulsante Modifica */}
        <div className="w-full mt-10 flex justify-center">
          <button className="w-[80%] h-[43px] rounded-3xl bg-pink-700 text-white flex items-center justify-center gap-2 shadow-md">
            <span className="font-bold">Modifica</span>
            <ArrowRight className="text-xl" width="30" height="25" />
          </button>
        </div>
      </div>
    </div>
  );
}
