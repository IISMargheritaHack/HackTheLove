import { motion, useMotionValue, useAnimation } from 'framer-motion';

export default function Card({ image, color, index, totalCards }) {
  const motionValue = useMotionValue(0);

  const animControls = useAnimation();

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

  return (
    <motion.div
      animate={animControls}
      drag="x"
      x={motionValue}
      dragConstraints={{ left: -1000, right: 1000 }}
      style={style}
      className="absolute transition-transform duration-300 ease-in-out cursor-grab"
      onDragEnd={(event, info) => {
        console.log('Offset X:', info.offset.x);
        console.log('Velocity X:', info.velocity.x);
        console.log('Point X:', info.point.x);

        const swipeThreshold = 150;

        if (Math.abs(info.offset.x) <= swipeThreshold) {
          animControls.start({ x: 0 });
        } else {
          if (info.offset.x > 0) {
            animControls.start({ x: 500, opacity: 0 }).then(() => {
              console.log('Swipe a DESTRA');
            })
          } else {
            animControls.start({ x: -500, opacity: 0 }).then(() => {
              console.log('Swipe a SINISTRA');
            });
          }
        }
      }}
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
