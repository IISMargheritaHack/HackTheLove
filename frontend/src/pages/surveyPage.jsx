import ArrowRight from '@icons/arrowRight';
import Logo from '@components/logo';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { showToast } from '@components/toast';
import 'toastify-js/src/toastify.css';
import { useNavigate } from 'react-router';
import { addSurvey, getQuestions } from '@api/api';

function SurveyPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { questions: questionsData } = await getQuestions();
        console.log(questionsData);
        setQuestions(questionsData);
      } catch (error) {
        console.error('Errore durante il recupero delle domande:', error);
      }
    }

    fetchQuestions();

    if (localStorage.getItem('surveyCompleted') === 'true') {
      navigate('/');
    }
  }, [navigate]);

  async function handleSendSurvey(response) {
    let error = await addSurvey(response);
    if (error) {
      console.error('Errore durante la richiesta:', error);
      return error.response?.data || { error: 'Errore durante la richiesta' };
    }
  }

  const handleNext = async () => {
    if (!answers[questions[currentQuestion].id]) {
      showToast('⚠️ Devi rispondere prima di andare avanti!', 'error');
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      let err = await handleSendSurvey(
        Object.values(answers).map(item => item).join('')
      );
      if (err) {
        showToast('⚠️ Errore durante l\'invio del questionario!', 'error');
      } else {
        showToast('✅ Survey completato! 🎉', 'success');
        localStorage.setItem('surveyCompleted', 'true');
        navigate('/');
      }
    }
  };

  const handleSelect = (letter) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: letter,
    });
  };

  return (
    <div className="max-w-screen flex flex-col justify-between min-h-[90vh] items-center">
      <div>
        <div className="ml-3 mt-5" id="header">
          <Logo width={4} />
        </div>
        <div className="mt-6 ml-1" id="title">
          <h1 className="question font-bold text-nowrap text-[25px]">
            La tua &quot;zona di interesse&quot;
          </h1>
        </div>
      </div>
      <div className="m-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-[90vw]">
              <h1 className="text-left font-bold text-[1rem] ml-1">
                {questions[currentQuestion]?.id}.{' '}
                {questions[currentQuestion]?.question}
              </h1>
            </div>

            {questions[currentQuestion]?.options.map((option, index) => (
              <div key={index} className="mt-4 ml-2 flex items-start">
                <input
                  type="radio"
                  name={`question-${questions[currentQuestion].id}`}
                  className="accent-pink-800 size-[20px] shrink-0 mt-0.5 border-gray-200 appearance-none rounded disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:border-neutral-800 dark:checked:bg-pink-800"
                  id={`option-${index}`}
                  onChange={() => { handleSelect(questions[currentQuestion].values[index]) }}
                  checked={answers[questions[currentQuestion].id] === questions[currentQuestion].values[index]}
                />

                <label
                  htmlFor={`option-${index}`}
                  className="text-white text-left ms-3 text-[12px] mt-1"
                >
                  {option}
                </label>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          className="w-[80vw] h-[43px] rounded-[47px] bg-white text-black flex items-center justify-center shadow-md"
          onClick={handleNext}
        >
          <span className="font-bold text-center">Avanti</span>
          <ArrowRight className="text-xl ml-2" width="30" height="25" />
        </button>
      </div>
    </div>
  );
}

export default SurveyPage;
