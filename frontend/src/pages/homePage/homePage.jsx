
import Logo from '@components/logo';
import { showToast } from '@components/toast';
import { useEffect, useState, useCallback } from 'react';
import { getMatches, getUserByParams, getPhotosByParams } from '@api/api';
import MenuHamburger from '@icons/menuHamburger';
import { v4 as uuidv4 } from 'uuid';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown";
import { Button } from '@heroui/button';
import Card from '@components/card';
import { useContext } from 'react';
import UserContext from '@provider/userContext';
import { useNavigate } from 'react-router';

function HomePage() {
  const [matches, setMatches] = useState([]);
  const [cards, setCards] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  async function createCards(newMatches, numbers = 3) {
    if (!newMatches || newMatches.length === 0) return;

    const initialCards = newMatches.slice(cards.length, cards.length + numbers);

    try {
      const enrichedCards = await Promise.all(
        initialCards.map(async (card) => {
          const emailToGet = card.user_email1 === user.email ? card.user_email2 : card.user_email1;

          try {
            const [userMatchData, photos] = await Promise.all([
              getUserByParams(emailToGet),
              getPhotosByParams(emailToGet)
            ]);

            return {
              ...card,
              user: userMatchData,
              id: uuidv4(),
              image: photos.images[0] || '',
            };
          } catch (error) {
            console.error('Error while retrieving user data:', error);
            return null;
          }
        })
      );

      setCards((prevCards) => {
        const uniqueCards = [...new Set([...prevCards, ...enrichedCards.filter(Boolean)])];
        return uniqueCards;
      });

    } catch (error) {
      console.error('Error during the creation of card:', error);
    }
  }

  async function handleMatch() {
    try {
      const response = await getMatches();

      if (!Array.isArray(response) || response.length === 0) {
        showToast('Nessun match trovato', 'info');
        return;
      }

      setMatches(response);
      await createCards(response, 5);
    } catch (error) {
      showToast('Si è verificato un errore imprevisto', 'error');
      console.error('Errore:', error);
    }
  }

  const handleCardSwipe = useCallback((swipedCardId) => {
    setCards((prevCards) => {
      const updatedCards = prevCards.filter(card => card.id !== swipedCardId);

      if (matches.length > updatedCards.length) {
        const nextCard = matches[updatedCards.length];
        if (nextCard) {
          createCards(matches, 1);
        }
      }

      return updatedCards;
    });
  }, [matches]);

  function updateCard() {
    setCards((prevCards) => {
      const newCards = prevCards.slice(1);
      createCards(matches, 1);
      return newCards;
    });

    setMatches((prevMatches) => {
      if (prevMatches.length > 0) {
        return prevMatches.slice(1);
      }
      return prevMatches;
    });
  }

  useEffect(() => {
    if (user?.email && matches.length === 0) {
      handleMatch();
    }
  }, [user.email]);


  return (
    <div className="container relative w-full h-screen flex justify-center items-center bg-pink-600">
      <div className='flex z-50 absolute top-2 justify-around w-screen items-center'>
        <Logo width={2} />
        <h1 className="text-white text-[1rem] font-bold">HackTheLove</h1>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="bordered" className='rounded-lg'>
              <MenuHamburger width={50} height={50} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new" className='text-white bg-[#DD016D] rounded-lg' onPress={() => navigate('/profile')}>Profilo</DropdownItem>
            <DropdownItem key="new" className='text-white bg-[#DD016D] rounded-lg' onPress={() => navigate('/bio')}>Modifica bio</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
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
      <h1 className='absolute z-0 font-bold text-xl p-12 w-screen text-center'>Sembra siano finiti i match attendi i risultati!</h1>
    </div >
  );
}

export default HomePage;
