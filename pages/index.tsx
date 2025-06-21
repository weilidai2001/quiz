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

  if (quiz.length === 0) return <div style={{padding: 32}}>Loading quiz...</div>;
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
    setCurrent((c) => (c + 1 < quiz.length ? c + 1 : 0));
  };

  return (
    <main style={{maxWidth: 600, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 4px 24px #0001"}}>
      <h1 style={{textAlign: "center"}}>TypeScript Quiz</h1>
      <div style={{marginBottom: 24}} dangerouslySetInnerHTML={{__html: q.question}} />
      <div>
        {q.answers.map((a) => (
          <button
            key={a.id}
            onClick={() => handleSelect(a.id)}
            disabled={showResult}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              margin: "12px 0",
              padding: "16px 12px",
              borderRadius: 8,
              border: selected === a.id ? "2px solid #0070f3" : "1px solid #ccc",
              background: selected === a.id ? "#e6f0fa" : "#fafbfc",
              cursor: showResult ? "default" : "pointer",
              fontWeight: selected === a.id ? "bold" : "normal",
              fontSize: 16,
              transition: "all 0.2s"
            }}
            dangerouslySetInnerHTML={{__html: a.value}}
          />
        ))}
      </div>
      {!showResult && (
        <button
          style={{marginTop: 24, width: "100%", padding: "14px 0", fontSize: 18, borderRadius: 8, background: "#0070f3", color: "#fff", border: "none", cursor: selected ? "pointer" : "not-allowed", opacity: selected ? 1 : 0.5}}
          onClick={handleSubmit}
          disabled={!selected}
        >
          Submit
        </button>
      )}
      {showResult && (
        <div style={{marginTop: 32, textAlign: "center"}}>
          <div style={{fontSize: 22, fontWeight: "bold", color: isCorrect ? "#0a0" : "#c00"}}>
            {isCorrect ? "Correct!" : "Incorrect"}
          </div>
          <div style={{margin: "20px 0", background: "#f3f3fa", padding: 16, borderRadius: 8}} dangerouslySetInnerHTML={{__html: q.explanation}} />
          <button
            style={{marginTop: 12, padding: "10px 32px", borderRadius: 8, background: "#0070f3", color: "#fff", border: "none", fontSize: 16, cursor: "pointer"}}
            onClick={handleNext}
          >
            Next Question
          </button>
        </div>
      )}
      <div style={{marginTop: 32, textAlign: "center", color: "#888"}}>
        Question {current + 1} of {quiz.length}
      </div>
    </main>
  );
}
