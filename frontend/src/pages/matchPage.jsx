import { useEffect, useState } from 'react'
import { getLikesMatches, getUserByParams, getPhotosByParams } from '@api/api'
import CardLike from '@components/cardLike'
import Header from '@components/header'
import { Spacer } from "@heroui/spacer";
import { handleError } from '@utils/utils'
import { showToast } from '@components/toast'

export default function MatchPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getLikesMatches()
        const error = handleError(response);
        if (error) {
          showToast(error.error, 'error');
          return;
        }

        if (!response.data || !Array.isArray(response.data.likes_by) || response.data.likes_by.length === 0) {
          showToast('Nessun match trovato', 'info');
          return
        }

        const usersDataPromises = response.data.likes_by.map(email => getUserByParams(email));
        const imagesDataPromises = response.data.likes_by.map(email => getPhotosByParams(email));

        const usersData = await Promise.all(usersDataPromises);
        const imagesData = await Promise.all(imagesDataPromises);

        const validUsers = usersData.map((user, index) => {
          const errorUser = handleError(user);
          if (errorUser) {
            showToast(`Errore nel recupero dell'utente: ${errorUser.error}`, 'error');
            return null;
          }

          const errorPhotos = handleError(imagesData[index]);
          if (errorPhotos) {
            showToast(`Errore nel recupero delle immagini: ${errorPhotos.error}`, 'error');
            return null;
          }

          const image = imagesData[index]?.data?.images?.[0] || '';

          return {
            ...user.data,
            image: image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`
          };
        }).filter(Boolean);

        setUsers(validUsers);

      } catch (error) {
        showToast('Errore nel recupero dei match', 'error');
        console.error("Errore nel recupero dei match:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Header />
      <Spacer y={20} />
      {users.length === 0 ? (
        <p className='text-center m-3'>Sembra che nessuno abbia ancora ricambiato il tuo like!</p>
      ) : (
        users.map((user, index) => (
          <CardLike userInfo={user} key={index} />
        ))
      )}
    </div>
  );
}
