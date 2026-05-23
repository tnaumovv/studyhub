import { useState } from "react";
import type { Term } from "../types";

interface FlashcardViewProps {
  term: Term;
  onNext: () => void;
}

export function FlashcardView({ term, onNext }: FlashcardViewProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped((f) => !f);

  const handleNext = () => {
    setFlipped(false);
    onNext();
  };

  return (
    <div className="study-panel">
      <button
        type="button"
        className={`flashcard ${flipped ? "flashcard--flipped" : ""}`}
        onClick={handleFlip}
        aria-label={flipped ? "Show term" : "Show definition"}
      >
        <div className="flashcard__inner">
          <div className="flashcard__face flashcard__face--front">
            <span className="flashcard__label">Term</span>
            <h2 className="flashcard__title">{term.term}</h2>
            <p className="flashcard__hint">Tap to reveal answer</p>
          </div>
          <div className="flashcard__face flashcard__face--back">
            <span className="flashcard__label">Definition</span>
            <p className="flashcard__text">{term.definition}</p>
            {term.example ? (
              <div className="flashcard__example">
                <span className="flashcard__label">Example</span>
                <p className="flashcard__text">{term.example}</p>
              </div>
            ) : null}
          </div>
        </div>
      </button>

      <div className="study-actions">
        <button type="button" className="btn btn--primary" onClick={handleNext}>
          Next card
        </button>
      </div>
    </div>
  );
}
