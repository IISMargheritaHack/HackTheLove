import './surveyPage.css';
import ArrowRight from '@icons/arrowRight';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '../../components/toast';
import 'toastify-js/src/toastify.css';

function SurveyPage() {
  const questions = [
    {
      id: 1,
      question: 'Come preferisci passare il tempo libero?',
      options: [
        'Relax a casa (film, libri, videogiochi).',
        "Attività all'aperto (sport, passeggiate, escursioni).",
      ],
    },
    {
      id: 2,
      question: 'Qual è il tuo genere musicale preferito?',
      options: ['Pop', 'Rock', 'Hip-Hop', 'Classica'],
    },
    {
      id: 3,
      question: 'Ti piace viaggiare?',
      options: ['Sì', 'No'],
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleNext = () => {
    if (!answers[questions[currentQuestion].id]) {
      showToast('⚠️ Devi rispondere prima di andare avanti!', 'error');
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log('Risposte utente:', answers);
      showToast('✅ Survey completato! 🎉', 'success');
    }
  };

  const handleSelect = (option) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: option });
  };

  return (
    <div className="max-w-[350px]">
      <div className="ml-3" id="header">
        <img id="logoBioPage" src={'logo.svg'} alt="Logo" />
      </div>
      <div className="mt-6 ml-1" id="title">
        <h1 className="question text-nowrap text-[25px]">
          La tua &quot;zona di interesse&quot;
        </h1>
      </div>

      <div className="mt-[20vh] mr-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-[35vh]">
              <h1 className="question text-left text-[18px] ml-1 text-nowrap">
                {questions[currentQuestion].id}.{' '}
                {questions[currentQuestion].question}
              </h1>
            </div>

            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="mt-8 ml-2 flex items-start w-[vh]">
                <input
                  type="checkbox"
                  className="accent-pink-800 size-[20px] shrink-0 mt-0.5 border-gray-200 appearance-none rounded disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:border-neutral-800 dark:checked:bg-pink-800"
                  id={`option-${index}`}
                  onChange={() => handleSelect(option)}
                  checked={answers[questions[currentQuestion].id] === option}
                />

                <label
                  htmlFor={`option-${index}`}
                  className="text-white text-left ms-3 text-[12px] text-nowrap"
                >
                  {option}
                </label>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-[13vh] ml-[vh]">
        <button
          className="w-[291px] h-[43px] rounded-[47px] bg-white text-black mt-28"
          onClick={handleNext}
        >
          <div className="flex items-center">
            <span className="ml-[120px] font-bold">Avanti</span>
            <div className="ml-auto">
              <ArrowRight className="text-8xl" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default SurveyPage;
