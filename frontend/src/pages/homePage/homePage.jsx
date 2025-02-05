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

function HomePage() {
  const [matches, setMatches] = useState([]);
  const [cards, setCards] = useState([]);
  const { user, setUser } = useContext(UserContext);

  async function createCards(newMatches, numbers) {
    const initialCards = newMatches.slice(cards.length, cards.length + numbers || cards.length + 3);

    for (const card of initialCards) {
      let emailToGet = card.user_email1 === user.email ? card.user_email2 : card.user_email1;

      try {
        const userMatchData = await getUserByParams(emailToGet);
        card.user = userMatchData;
        card.id = uuidv4();
        const photos = await getPhotosByParams(emailToGet);
        card.image = photos[0];
      } catch (error) {
        console.error('Errore durante il recupero dei dati utente:', error);
      }
    }

    setCards((prevCards) => [...prevCards, ...initialCards]);
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
          updatedCards.push(nextCard);
        }
      }

      return updatedCards;
    });
  }, [matches]);

  function updateCard() {
    console.log("CIAO")
    createCards(matches, 1)
  }


  useEffect(() => {
    if (user?.email) {
      handleMatch();
    }
  }, [user]);

  return (
    <div className="container relative w-full h-screen flex justify-center items-center bg-pink-600">
      <div className='flex z-50 absolute top-2 justify-around w-screen items-center'>
        <Logo width={2} />
        <h1 className="text-white text-[1rem] font-bold">HackTheLove</h1>
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant="bordered" className='rounded-lg'>
              <MenuHamburger width={"50px"} height={"50px"} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem key="new" className='text-white bg-[#DD016D] rounded-lg'>Profilo</DropdownItem>
            <DropdownItem key="new" className='text-white bg-[#DD016D] rounded-lg'>Modifica bio</DropdownItem>
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
      <h1>Sembra siano finiti i match</h1>
    </div>
  );
}

export default HomePage;
