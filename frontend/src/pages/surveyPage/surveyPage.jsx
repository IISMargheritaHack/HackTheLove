import './surveyPage.css';
import ArrowRight from '@icons/arrowRight';
import { useNavigate } from 'react-router';
import { useState } from 'react';
function SurveyPage() {
  return (
    <div className="max-w-[350px]">
      <div className="ml-3" id="header">
        <img id="logoBioPage" src={'logo.svg'} alt="Logo" />
      </div>
      <div className="mt-6 ml-1" id="title">
        <h1 className="question  text-nowrap text-[25px]" id="">
          La tua &quot;zona di interesse&quot;
        </h1>
      </div>

      <div className="mt-[20vh] mr-10">
        <div className="w-[35vh]">
          <h1 className="question  text-left text-[18px]  ml-1 text-nowrap">
            1. Come preferisci passare il tempo libero?
          </h1>
        </div>

        <div className="mt-2 ml-2 flex items-start">
          <input
            type="checkbox"
            className=" accent-pink-800 size-[20px] shrink-0  mt-0.5 border-gray-200 appearance-none rounded disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:border-neutral-700 dark:checked:bg-pink-800"
            id="hs-default-checkbox"
          />

          <label
            htmlFor="hs-default-checkbox"
            className="  text-white text-left ms-3 text-[12px] text-nowrap"
          >
            a) relax a casa(film, libri, videogiochi).
          </label>
        </div>

        <div className="mt-8 ml-2 flex items-start w-[vh]">
          <input
            type="checkbox"
            className="accent-pink-800 size-[20px] shrink-0  mt-0.5 border-gray-200 appearance-none rounded disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:border-neutral-800 dark:checked:bg-pink-800"
          />

          <label
            htmlFor="hs-default-checkbox"
            className=" text-white text-left ms-3 text-[12px] text-nowrap"
          >
            b) Attività all'aperto (sport, passeggiate, escursioni).
          </label>
        </div>
        <div className="mt-8 ml-2 flex items-start w-[vh]">
          <input
            type="checkbox"
            className="accent-pink-800 size-[20px] shrink-0  mt-0.5 border-gray-200 appearance-none rounded disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:border-neutral-700 dark:checked:bg-pink-800"
          />

          <label
            htmlFor="hs-default-checkbox"
            className=" text-white text-left ms-3 text-[12px] text-nowrap"
          >
            b) Attività all'aperto (sport, passeggiate, escursioni).
          </label>
        </div>
        <div className="mt-8 ml-2 flex items-start w-[vh]">
          <input
            type="checkbox"
            className="accent-pink-800 size-[20px] shrink-0  mt-0.5 border-gray-200 appearance-none rounded disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:border-neutral-700 dark:checked:bg-pink-800"
          />

          <label
            htmlFor="hs-default-checkbox"
            className=" text-white text-left ms-3 text-[12px] text-nowrap"
          >
            b) Attività all'aperto (sport, passeggiate, escursioni).
          </label>
        </div>
      </div>

      <div className="mt-[13vh] ml-[vh]">
        <button
          className="w-[291px] h-[43px] rounded-[47px] bg-white  text-black mt-28 "
          //onClick={() => navigate('/')}
        >
          <div className="flex items-center">
            <span className="ml-[120px] font-bold">Avanti</span>
            <div className="ml-auto">
              <ArrowRight className="text-8xl " />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default SurveyPage;
