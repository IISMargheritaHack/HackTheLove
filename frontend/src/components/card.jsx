import { setLike } from '@api/api';
import { Button } from '@heroui/button';
import DislikeIcon from '@icons/dislikeIcon';
import LikeIcon from '@icons/likeIcon';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function Card({ callBack, image, index, totalCards, userInfo }) {
  const motionValue = useMotionValue(0);
  const animControls = useAnimation();
  const [hasSwiped, setHasSwiped] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (typeof image === 'string') {
      setImageUrl(image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`);
    } else if (image instanceof Uint8Array || image instanceof ArrayBuffer) {
      const blob = new Blob([image], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(image);
    }
  }, [image]);

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
          duration: 0.3,
        },
      })
      .then(() => {
        setLike(userInfo.user.email, direction === 1 ? 1 : 0);
        callBack();
        setHasSwiped(false);
      });
  };

  const style = {
    height: '100vh',
    width: '100vw',
    position: 'absolute',
    zIndex: totalCards - index,
    background: `linear-gradient(135deg, #ffffff, #ffffff)`,
    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
  };

  const handleDragEnd = (event, info) => {
    if (hasSwiped) return;

    const { offset, velocity } = info;
    const swipeThreshold = 100;
    const velocityThreshold = 500;

    if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
      triggerSwipe(offset.x > 0 ? 1 : -1);
    } else {
      animControls.start({ x: 0, rotate: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  return (
    <motion.div
      animate={animControls}
      drag={!hasSwiped ? 'x' : false}
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
          <h2 className="text-2xl font-semibold">
            {userInfo?.user.family_name} {userInfo.user.given_name} {userInfo?.user_info.age}
          </h2>
          <p className="text-sm">{userInfo.user_info.bio}</p>
        </div>
        <div className="flex items-center w-full justify-center gap-20 mb-4 mt-6">
          <Button isIconOnly className="z-50 w-[75px] h-[75px] pointer-events-auto" onPress={() => triggerSwipe(-1)}>
            <DislikeIcon />
          </Button>
          <Button isIconOnly className="z-50 w-[75px] h-[75px] pointer-events-auto" onPress={() => triggerSwipe(1)}>
            <LikeIcon />
          </Button>
        </div>
      </div>
      <div
        className="z-49 absolute top-0 w-full h-[10vh] bg-gradient-to-b from-black to-transparent"
        style={{ background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.6139) 55%, rgba(0, 0, 0, 0.01) 100%)' }}
      ></div>
      <div
        className="absolute bottom-0 w-full h-[20vh] bg-gradient-to-b from-black to-transparent"
        style={{ background: 'linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0.6139) 55%, rgba(0, 0, 0, 0.01) 100%)' }}
      ></div>
    </motion.div>
  );
}

Card.propTypes = {
  callBack: PropTypes.func.isRequired,
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Uint8Array),
    PropTypes.instanceOf(ArrayBuffer)
  ]).isRequired,
  index: PropTypes.number.isRequired,
  totalCards: PropTypes.number.isRequired,
  userInfo: PropTypes.shape({
    user: PropTypes.shape({
      family_name: PropTypes.string.isRequired,
      given_name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
    user_info: PropTypes.shape({
      age: PropTypes.number.isRequired,
      bio: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
