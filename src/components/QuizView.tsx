import { useEffect, useMemo, useState } from "react";
import type { Term } from "../types";
import { QUIZ_LABELS } from "../types";
import { buildQuizQuestion, truncate } from "../utils/study";

interface QuizViewProps {
  term: Term;
  pool: Term[];
  onNext: () => void;
}

export function QuizView({ term, pool, onNext }: QuizViewProps) {
  const question = useMemo(
    () => buildQuizQuestion(term, pool),
    [term, pool],
  );

  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [term.id]);

  const answered = selected !== null;
  const isCorrect = selected === question.correctIndex;

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
  };

  const handleNext = () => {
    setSelected(null);
    onNext();
  };

  return (
    <div className="study-panel">
      <div className="quiz-card">
        <span className="flashcard__label">Term</span>
        <h2 className="quiz-card__title">{term.term}</h2>
        <p className="quiz-card__prompt">Choose the correct definition (A–E)</p>
      </div>

      <ul className="quiz-options" role="listbox" aria-label="Answer options">
        {question.options.map((option, index) => {
          const label = QUIZ_LABELS[index];
          let stateClass = "";
          if (answered) {
            if (index === question.correctIndex) stateClass = "quiz-option--correct";
            else if (index === selected) stateClass = "quiz-option--wrong";
          }

          return (
            <li key={`${term.id}-${index}`}>
              <button
                type="button"
                className={`quiz-option ${stateClass}`}
                onClick={() => handleSelect(index)}
                disabled={answered}
                title={option}
                aria-label={`Option ${label}`}
              >
                <span className="quiz-option__badge">{label}</span>
                <span className="quiz-option__text">{truncate(option, 200)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {answered ? (
        <div className={`quiz-feedback ${isCorrect ? "quiz-feedback--ok" : "quiz-feedback--bad"}`}>
          <p className="quiz-feedback__status">
            {isCorrect ? "Correct!" : "Not quite — see the correct answer highlighted."}
          </p>
          {term.example ? (
            <div className="quiz-feedback__example">
              <span className="flashcard__label">Example</span>
              <p>{term.example}</p>
            </div>
          ) : null}
          <button type="button" className="btn btn--primary" onClick={handleNext}>
            Next question
          </button>
        </div>
      ) : null}
    </div>
  );
}
