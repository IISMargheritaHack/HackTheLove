import img1 from '@assets/img/gabibbo.webp';
import img2 from '@assets/img/Martin_Luther_King_Jr.webp';
import img3 from '@assets/img/pietro.webp';
import img4 from '@assets/img/turetta.webp';
import { showToast } from '@components/toast';
import { useEffect } from 'react';
import Card from '@components/card';

function HomePage() {
  const cards = [
    { id: '1', image: img1, color: '#55ccff' },
    { id: '2', image: img2, color: '#e8e8e8' },
    { id: '3', image: img3, color: '#0a043c' },
    { id: '4', image: img4, color: 'black' },
  ];

  useEffect(() => {
    showToast('Swipe a destra per LIKE a sinistra per DISLIKE!', 'info');
  }, []);

  return (
    <div className="container relative w-full h-screen flex justify-center items-center bg-pink-600">
      <div className="cards_container">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            image={card.image}
            color={card.color}
            index={index}
            totalCards={cards.length}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
