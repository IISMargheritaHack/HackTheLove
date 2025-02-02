import React from 'react';
import img1 from '@assets/img/gabibbo.webp';
import img2 from '@assets/img/Martin_Luther_King_Jr.webp';
import img3 from '@assets/img/pietro.webp';
import img4 from '@assets/img/turetta.webp';
import { Card, CardWrapper } from 'react-swipeable-cards';

const cardsData = [
  { id: '1', src: img1 },
  { id: '2', src: img2 },
  { id: '3', src: img3 },
  { id: '4', src: img4 },
];

function HomePage() {
  const onSwipe = (data) => console.log('I was swiped.', data);
  const onSwipeLeft = (data) => console.log('I was swiped left.', data);
  const onSwipeRight = (data) => console.log('I was swiped right.', data);
  const onDoubleTap = (data) => console.log('I was double tapped.', data);

  return (
    <CardWrapper>
      {cardsData.map((card) => (
        <Card
          key={card.id}
          onSwipe={() => onSwipe(card)}
          onSwipeLeft={() => onSwipeLeft(card)}
          onSwipeRight={() => onSwipeRight(card)}
          onDoubleTap={() => onDoubleTap(card)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff', // Imposta il colore di sfondo per evitare trasparenze
            borderRadius: '12px',
            overflow: 'hidden', // Evita che l'immagine si distorca
            width: '320px', // Imposta una dimensione fissa
            height: '480px',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)', // Aggiunge un'ombra per un look migliore
          }}
        >
          <img
            src={card.src}
            alt="Swipe Card"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // Assicura che l'immagine riempia la card senza muoversi
            }}
          />
        </Card>
      ))}
    </CardWrapper>
  );
}

export default HomePage;
