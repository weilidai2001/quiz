"use client";
import { useEffect, useState } from "react";

interface Answer {
  id: string;
  value: string;
}

interface Question {
  question: string;
  answers: Answer[];
  correctAnswer: string;
  explanation: string;
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/quiz.json")
      .then((res) => res.json())
      .then((data) => setQuiz(data));
  }, []);

  if (quiz.length === 0)
    return <div className="p-8 text-center text-lg text-[var(--color-subtext)]">Loading quiz...</div>;
  const q = quiz[current];

  const handleSelect = (id: string) => {
    setSelected(id);
  };

  const handleSubmit = () => {
    if (!selected) return;
    setIsCorrect(selected === q.correctAnswer);
    setShowResult(true);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelected(null);
    setIsCorrect(null);
    setCurrent((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-2 bg-gray-100">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-200 p-0">
        {/* SELECT ONE pill */}
        <div className="flex justify-start px-8 pt-8">
          <span className="bg-red-600 text-white text-sm font-semibold rounded-full px-4 py-1 select-none">SELECT ONE</span>
        </div>
        <div className="px-8 pb-10 pt-6 flex flex-col gap-8">
          {/* Question */}
          <div className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-snug">
            <span dangerouslySetInnerHTML={{ __html: q.question }} />
          </div>

          {/* Options */}
          <fieldset className="flex flex-col gap-4">
            {q.answers.map((a) => (
              <button
                key={a.id}
                type="button"
                disabled={showResult}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 text-lg font-medium transition-all duration-150 focus:outline-none
                  ${selected === a.id ? 'border-red-600 bg-red-50' : 'border-gray-300 bg-white hover:border-red-400 hover:bg-red-50'}
                  ${showResult ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => handleSelect(a.id)}
              >
                {a.value}
              </button>
            ))}
          </fieldset>

          {/* Submit/Next button and feedback */}
          <div className="flex flex-col gap-4 mt-4">
            {!showResult ? (
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-xl text-lg shadow hover:bg-red-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            ) : (
              <>
                <div className={`text-lg font-semibold text-center ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isCorrect ? 'Correct!' : 'Incorrect'}</div>
                <div className="text-gray-700 text-center text-base mb-2">{q.explanation}</div>
                {current < quiz.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl text-lg shadow hover:bg-gray-900 transition-all"
                  >
                    Next Question
                  </button>
                )}
                {current === quiz.length - 1 && (
                  <div className="text-center font-bold text-gray-700 mt-4">Quiz complete!</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
