import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { showToast } from '@components/toast';
import { getMatches, getUserByParams, getPhotosByParams } from '@api/api';
import { v4 as uuidv4 } from 'uuid';
import Header from '@components/header';
import Card from '@components/card';
import { useContext } from 'react';
import UserContext from '@provider/userContext';
import { handleError } from '@utils/utils';
import Spinner from '@components/spinner';

function HomePage() {
  const [matches, setMatches] = useState([]);
  const [cards, setCards] = useState([]);
  const { user } = useContext(UserContext);
  const [color, setColor] = useState('transparent');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  async function createCards(newMatches, numbers = 3) {
    if (!newMatches || newMatches.length === 0) return;

    const initialCards = newMatches.slice(cards.length, cards.length + numbers);

    try {
      const enrichedCards = await Promise.all(
        initialCards.map(async (card) => {
          const emailToGet = card.user_email1 === user.email ? card.user_email2 : card.user_email1;

          const userMatchData = await getUserByParams(emailToGet);
          const errorUser = handleError(userMatchData);
          if (errorUser) {
            showToast(errorUser.error, 'error');
            return null;
          }

          const photos = await getPhotosByParams(emailToGet);
          const errorPhotos = handleError(photos);
          if (errorPhotos) {
            console.log(errorPhotos.error);
            return null;
          }

          return {
            ...card,
            user: userMatchData.data,
            id: uuidv4(),
            image: photos.data.images[0] || '',
          };
        })
      );

      setCards((prevCards) => {
        const uniqueCards = [...new Set([...prevCards, ...enrichedCards.filter(Boolean)])];
        return uniqueCards;
      });

      setLoading(false);
    } catch (error) {
      showToast('Errore durante la creazione delle carte', 'error');
      console.error('Error during card creation:', error);
    }
  }

  async function handleMatch() {
    try {
      const response = await getMatches();
      const error = handleError(response);
      if (error) {
        showToast(error.error, 'error');
        return;
      }

      if (!Array.isArray(response.data) || response.data.length === 0) {
        showToast('Nessun utente interessante trovato', 'info');
        setLoading(false);
        return;
      }

      setMatches(response.data);
      await createCards(response.data, 5);
    } catch (error) {
      showToast('Si è verificato un errore imprevisto', 'error');
      console.error('Errore:', error);
    }
  }

  const handleCardSwipe = useCallback((swipedCardId) => {
    setCards((prevCards) => {
      const updatedCards = prevCards.filter(card => card.id !== swipedCardId);

      if (matches.length > updatedCards.length) {
        createCards(matches, 1);
      }

      return updatedCards;
    });
  }, [matches]);

  function updateCard(direction) {
    setColor(
      direction === 1
        ? 'linear-gradient(180deg, #DD016D 0%, rgba(221, 1, 109, 0.6139) 55%, rgba(221, 1, 109, 0.01) 100%)'
        : 'linear-gradient(180deg, #871A1A 0%, rgba(135, 26, 26, 0.6139) 55%, rgba(135, 26, 26, 0.01) 100%)'
    );

    setCards((prevCards) => {
      createCards(matches, 1);
      return prevCards.slice(1);
    });

    setMatches((prevMatches) => prevMatches.length > 0 ? prevMatches.slice(1) : prevMatches);
    setIsVisible(true);

    setTimeout(() => setIsVisible(false), 1500);
  }

  useEffect(() => {
    if (user?.email && matches.length === 0) {
      handleMatch();
    }

  }, [user.email]);

  return (
    <div className="container relative w-full h-screen flex justify-center items-center bg-pink-600">
      <Header />
      {!loading ? (
        <>
          <div className="cards_container">
            {cards.map((card, index) => (
              <Card
                callBack={updateCard}
                key={card.id}
                index={index}
                image={card.image}
                totalCards={cards.length}
                userInfo={card.user}
                onSwipe={() => handleCardSwipe(card.id)}
              />
            ))}
          </div>
          <h1 className='absolute z-0 font-bold text-xl p-12 w-screen text-center'>Sembra siano finiti i match, attendi i risultati!</h1>
          {cards.length !== 0 && (
            <>
              <div
                className="z-49 absolute top-0 w-full h-[10vh] transition-all duration-300 ease-in-out"
                style={{
                  background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.6139) 55%, rgba(0, 0, 0, 0.01) 100%)'
                }}
              ></div>
              <motion.div
                className="z-49 absolute top-0 w-full h-[8vh]"
                style={{ background: color }}
                animate={{ opacity: isVisible ? 1 : 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
              <div
                className="absolute bottom-0 w-full h-[20vh]"
                style={{
                  background: 'linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0.6139) 55%, rgba(0, 0, 0, 0.01) 100%)',
                }}
              ></div>
            </>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default HomePage;
