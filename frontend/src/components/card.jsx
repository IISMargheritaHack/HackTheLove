import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { useState } from 'react';
import PropTypes from 'prop-types';
import LikeIcon from '@icons/likeIcon';
import DislikeIcon from '@icons/dislikeIcon';
import { Button } from '@heroui/button';

export default function Card({ image, index, totalCards, userInfo }) {
  const motionValue = useMotionValue(0);
  const animControls = useAnimation();
  const [hasSwiped, setHasSwiped] = useState(false);

  const triggerSwipe = (direction) => {
    if (hasSwiped) return;
    setHasSwiped(true);

    const rotateAmount = direction * 30;

    animControls
      .start({
        x: direction * 600,
        opacity: 0,
        rotate: rotateAmount,
        transition: {
          type: 'spring',
          stiffness: 500,
          damping: 20,
          duration: 0.3
        }
      })
      .then(() => {
        setHasSwiped(false);
        console.log(direction === 1 ? 'RIGHT' : 'LEFT');
      });
  };

  const style = {
    height: '100vh',
    width: '100vw',
    position: 'absolute',
    zIndex: totalCards - index,
    background: `linear-gradient(135deg, #ffffff, #ffffff)`,
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
  };

  const swipeConfidenceThreshold = 100;
  const velocityThreshold = 500;

  const handleDragEnd = (event, info) => {
    if (hasSwiped) return;

    const { offset, velocity } = info;

    if (Math.abs(offset.x) > swipeConfidenceThreshold || Math.abs(velocity.x) > velocityThreshold) {
      const direction = offset.x > 0 ? 1 : -1;
      triggerSwipe(direction);
    } else {
      animControls.start({
        x: 0,
        rotate: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20,
          duration: 0.2
        }
      }).then(() => {
        console.log('Animazione di ritorno completata');
      });
    }
  };

  return (
    <motion.div
      animate={animControls}
      drag={!hasSwiped ? "x" : false}
      x={motionValue}
      dragConstraints={{ left: -1000, right: 1000 }}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 200, bounceDamping: 15 }}
      style={style}
      className="absolute transition-transform duration-300 ease-in-out cursor-grab"
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col rounded-lg justify-end max-w-md h-full p-6 bg-gradient-to-t from-black/70 via-transparent to-transparent text-white select-none pointer-events-none">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">{userInfo?.user.family_name} {userInfo.user.given_name} {userInfo?.user_info.age}</h2>
          <p className='text-sm'>{userInfo.user_info.bio}</p>
        </div>
        <div className='flex items-center w-full justify-center gap-20 mb-4 mt-6'>
          <Button isIconOnly className='z-50 w-[75px] h-[75px] pointer-events-auto' onPress={() => triggerSwipe(-1)}>
            <DislikeIcon />
          </Button>
          <Button isIconOnly className='z-50 w-[75px] h-[75px] pointer-events-auto' onPress={() => triggerSwipe(1)}>
            <LikeIcon />
          </Button>
        </div>
      </div>
      <div className="z-49 absolute top-0 w-full h-[10vh] bg-gradient-to-b from-black to-transparent" style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.6139) 55%, rgba(0, 0, 0, 0.01) 100%)' }}></div>
      <div className="absolute bottom-0 w-full h-[20vh] bg-gradient-to-b from-black to-transparent" style={{ background: 'linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0.6139) 55%, rgba(0, 0, 0, 0.01) 100%)' }}></div>
    </motion.div>
  );
}

Card.propTypes = {
  image: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  totalCards: PropTypes.number.isRequired,
  userInfo: PropTypes.shape({
    user: PropTypes.shape({
      family_name: PropTypes.string.isRequired,
      given_name: PropTypes.string.isRequired,
    }).isRequired,
    user_info: PropTypes.shape({
      age: PropTypes.number.isRequired,
      bio: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
