import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ArrowRight from '@icons/arrowRight';
import { useNavigate } from 'react-router';

const responsive = {
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const items = [
  <div key={0}>
    <div className="">
      <h1 className="ms-auto me-auto font-bold" id="h1-slide1">
        Tutte le info!
      </h1>
    </div>
    <div className="mb-36">
      <p className="mt-2" id="p1-slide1">
        Per poter far lavorare il nostro algoritmo e far funzionare il sito
        abbiamo bisogno di alcune informazioni su di te
      </p>
    </div>
  </div>,

  <div key={1}>
    <div className="">
      <h1 className="ms-auto me-auto" id="h1-slide2">
        Attento alla compilazione!
      </h1>
    </div>
    <div className="mb-36">
      <p className="mt-2" id="p1-slide2">
        Se dovessi inserire foto che non riguardano te o dati personali non
        congrui con le tue informazioni gli altri utenti si “insospettiranno” e
        probabilmente non riceverai alcun match.
      </p>
    </div>
  </div>,

  <div key={2}>
    <div className="">
      <h1 className="ms-auto me-auto" id="h1-slide3">
        La selezione è a tuo vantaggio
      </h1>
    </div>
    <div className="mb-36">
      <p className="mt-2" id="p1-slide3">
        Una volta che i moderatori attiveranno l’app ti verrano mostrate dieci
        potenziali match potrai scegliere tra “si” e “no”, dopo che risponderai
        a tutte le proposte ti verrano ripresentati tutti i tuoi “no” per
        poterli rivalutare
      </p>
    </div>
  </div>,
];


export default function SlideIntroPage() {
  const navigate = useNavigate();
  const ButtonGroup = ({ next }) => {    // eslint-disable-line react/prop-types

    return (
      <div className="carousel-button-group">
        {' '}
        <button
          className="w-[291px] h-[43px] rounded-[47px] bg-white  text-black mt-28 "
          onClick={() => next()}
        >
          {' '}
          <div className="flex items-center">
            <span className="ml-[120px] font-bold">Avanti</span>
            <div className="ml-auto">
              <ArrowRight className="text-8xl " />
            </div>
          </div>
        </button>
      </div>
    );
  };

  const handleAfterChange = (previousSlide, state) => {
    localStorage.setItem('introEnded', true);
    if (state.currentSlide === 2) {
      navigate('/bio');
    }
  };

  return (
    <div className="w-[80vw]">
      <Carousel
        customButtonGroup={<ButtonGroup />}
        renderButtonGroupOutside={true}
        swipeable={false}
        draggable={false}
        showDots={true}
        responsive={responsive}
        ssr={true}
        removeArrowOnDeviceType={['tablet', 'mobile']}
        afterChange={handleAfterChange}
      >
        {items}
      </Carousel>
    </div>
  );
}
