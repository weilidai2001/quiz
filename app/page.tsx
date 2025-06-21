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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-2 text-blue-700">Question {current + 1} of {quiz.length}</h2>
        <p className="text-lg mb-8 text-gray-800" dangerouslySetInnerHTML={{ __html: q.question }} />
        <div className="mb-8">
          {q.answers.map((a) => (
            <button
              key={a.id}
              onClick={() => handleSelect(a.id)}
              className={`block w-full text-left mb-3 px-5 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm
                ${selected === a.id ? 'border-blue-500 bg-blue-50 font-bold text-blue-800 ring-2 ring-blue-200' : 'border-gray-200 bg-gray-50 font-normal text-gray-700'}
                ${showResult ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={showResult}
            >
              <span dangerouslySetInnerHTML={{ __html: a.value }} />
            </button>
          ))}
        </div>
        {!showResult && (
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className={`px-6 py-2 text-base rounded-lg bg-blue-600 text-white border-none transition-colors
              ${selected ? 'hover:bg-blue-700 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
          >
            Submit
          </button>
        )}
        {showResult && (
          <div className="mt-6">
            <h3 className={isCorrect ? "text-green-600" : "text-red-600"}>{isCorrect ? "Correct!" : "Incorrect."}</h3>
            <p dangerouslySetInnerHTML={{ __html: q.explanation }} />
            {current < quiz.length - 1 ? (
              <button onClick={handleNext} className="mt-4 px-6 py-2 text-base rounded-lg bg-blue-600 text-white border-none hover:bg-blue-700 cursor-pointer">
                Next Question
              </button>
            ) : (
              <div className="mt-4 font-bold">Quiz Complete!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
