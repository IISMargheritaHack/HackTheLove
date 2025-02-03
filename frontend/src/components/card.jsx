import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { useState } from 'react';

export default function Card({ image, color, index, totalCards }) {
  const motionValue = useMotionValue(0);
  const animControls = useAnimation();
  const [hasSwiped, setHasSwiped] = useState(false);

  const style = {
    height: '70vh',
    borderRadius: '0.5rem',
    width: '80vw',
    maxWidth: '400px',
    zIndex: totalCards - index,
    background: `linear-gradient(135deg, ${color}, #ffffff)`,
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const swipeConfidenceThreshold = 100;
  const velocityThreshold = 500;

  const handleDragEnd = (event, info) => {
    if (hasSwiped) return;

    const { offset, velocity } = info;

    if (Math.abs(offset.x) > swipeConfidenceThreshold || Math.abs(velocity.x) > velocityThreshold) {
      setHasSwiped(true);

      const direction = offset.x > 0 ? 1 : -1;
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
          console.log(direction == 1 ? 'RIGHT' : 'LEFT');
        });
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
      dragElastic={0.2} // Leggera resistenza per migliorare il controllo
      dragTransition={{ bounceStiffness: 200, bounceDamping: 15 }}
      style={style}
      className="absolute transition-transform duration-300 ease-in-out cursor-grab"
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col rounded-lg justify-end max-w-md h-full p-6 dark:bg-gray-50 dark:text-gray-800 select-none pointer-events-none">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Leroy Jenkins</h2>
          <span className="block pb-2 text-sm dark:text-gray-600">CTO of Company Inc.</span>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, eligendi dolorum sequi illum qui unde aspernatur non deserunt.</p>
        </div>
      </div>
    </motion.div>
  );
}
