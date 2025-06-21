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

  if (quiz.length === 0) return <div className="p-8">Loading quiz...</div>;
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
    <div className="max-w-xl mx-auto mt-10 mb-10 p-6 bg-white rounded-xl shadow-lg">
      <h2>Question {current + 1} of {quiz.length}</h2>
      <p className="text-xl mb-6">{q.question}</p>
      <div className="mb-6">
        {q.answers.map((a) => (
          <button
            key={a.id}
            onClick={() => handleSelect(a.id)}
            className={`block w-full text-left mb-2 px-4 py-3 rounded-lg border transition-all duration-200 cursor-pointer
              ${selected === a.id ? 'border-blue-600 bg-blue-50 font-bold' : 'border-gray-300 bg-gray-50 font-normal'}
              ${showResult ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={showResult}
          >
            {a.value}
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
          <p>{q.explanation}</p>
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
  );
}
