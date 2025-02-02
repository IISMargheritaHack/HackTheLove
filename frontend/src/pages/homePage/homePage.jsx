import img1 from '@assets/img/gabibbo.webp';
import img2 from '@assets/img/Martin_Luther_King_Jr.webp';
import img3 from '@assets/img/pietro.webp';
import img4 from '@assets/img/turetta.webp';
import Card from '@components/card';
import CardWrapper from '@components/cardWrapper';

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
        >
        </Card>
      ))}
    </CardWrapper>
  );
}

export default HomePage;
