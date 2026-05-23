import { useState } from "react";
import type { QuizQuestion } from "../types";
import { QUIZ_LABELS } from "../types";
import { truncate } from "../utils/study";

interface QuizSessionProps {
  questions: QuizQuestion[];
  title?: string;
  onRestart?: () => void;
}

export function QuizSession({
  questions,
  title,
  onRestart,
}: QuizSessionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions.length) {
    return (
      <div className="glass-card empty-panel empty-panel--compact">
        <p>No quiz questions available.</p>
      </div>
    );
  }

  const current = questions[activeIndex];
  const answered = selected !== null;
  const isLast = activeIndex >= questions.length - 1;

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    if (index === current.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setActiveIndex((i) => i + 1);
    setSelected(null);
  };

  const handleRestart = () => {
    setActiveIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    onRestart?.();
  };

  if (finished) {
    return (
      <div className="glass-card quiz-session">
        {title ? <h3 className="quiz-session__title">{title}</h3> : null}
        <p className="quiz-session__score">
          Score: {score} / {questions.length}
        </p>
        <button
          type="button"
          className="btn btn--primary"
          onClick={handleRestart}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card quiz-session">
      <div className="quiz-session__head">
        {title ? <h3 className="quiz-session__title">{title}</h3> : null}
        <span className="quiz-session__progress">
          {activeIndex + 1} / {questions.length}
        </span>
      </div>

      <p className="quiz-session__question">{current.question}</p>

      <ul className="quiz-options">
        {current.options.map((option, index) => {
          let stateClass = "";
          if (answered) {
            if (index === current.correctIndex) stateClass = "quiz-option--correct";
            else if (index === selected) stateClass = "quiz-option--wrong";
          }

          return (
            <li key={`${current.id}-${index}`}>
              <button
                type="button"
                className={`quiz-option ${stateClass}`}
                onClick={() => handleSelect(index)}
                disabled={answered}
                title={option}
              >
                <span className="quiz-option__badge">{QUIZ_LABELS[index]}</span>
                <span className="quiz-option__text">{truncate(option, 200)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {answered ? (
        <button type="button" className="btn btn--primary" onClick={handleNext}>
          {isLast ? "See results" : "Next"}
        </button>
      ) : null}
    </div>
  );
}
