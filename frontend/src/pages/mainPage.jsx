import PaginaWaiting from '@pages/waitingPage';
import HomePage from '@pages/homePage';
import { useEffect, useState } from 'react';
import { getTime } from '@api/api';
import { handleError } from '@utils/utils';
import { showToast } from '@components/toast';
import { timeReleaseMatch } from '@config';

export default function MainPage() {
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        let result = await getTime();
        let error = handleError(result);

        if (error) {
          showToast(error.error, 'error');
          return;
        }
        const serverTime = new Date(result.data.time);
        const unlockTime = timeReleaseMatch;
        setIsAllowed(serverTime >= unlockTime);
      } catch (err) {
        console.error('Errore durante il recupero del tempo:', err);
        showToast("Errore nel recupero del tempo", 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTime();
  }, []);

  if (loading) {
    return <p>Caricamento...</p>;
  }

  return isAllowed ? <HomePage /> : <PaginaWaiting />;
}
