import type { StudyState } from "../hooks/useStudyState";

type StudyControlsProps = Pick<
  StudyState,
  | "displayFormat"
  | "setDisplayFormat"
  | "quizSource"
  | "setQuizSource"
  | "glossaryMode"
  | "setGlossaryMode"
  | "glossaryFormat"
  | "setGlossaryFormat"
  | "selectedSlivId"
  | "setSelectedSlivId"
  | "modeOptions"
  | "lectureQuestions"
  | "slivDecks"
  | "hasTerms"
  | "modeHint"
>;

export function StudyControls({
  displayFormat,
  setDisplayFormat,
  quizSource,
  setQuizSource,
  glossaryMode,
  setGlossaryMode,
  glossaryFormat,
  setGlossaryFormat,
  selectedSlivId,
  setSelectedSlivId,
  modeOptions,
  lectureQuestions,
  slivDecks,
  hasTerms,
  modeHint,
}: StudyControlsProps) {
  return (
    <div className="sidebar-study-controls">
      <span className="sidebar__label">Format</span>
      <div className="sidebar-segmented">
        <button
          type="button"
          className={`sidebar-segmented__btn ${displayFormat === "lecture" ? "sidebar-segmented__btn--active" : ""}`}
          onClick={() => setDisplayFormat("lecture")}
        >
          Lecture
        </button>
        <button
          type="button"
          className={`sidebar-segmented__btn ${displayFormat === "quiz" ? "sidebar-segmented__btn--active" : ""}`}
          onClick={() => setDisplayFormat("quiz")}
        >
          Quiz
        </button>
      </div>

      {displayFormat === "quiz" ? (
        <>
          <span className="sidebar__label">Quiz source</span>
          <div className="sidebar-segmented">
            <button
              type="button"
              className={`sidebar-segmented__btn ${quizSource === "lectures" ? "sidebar-segmented__btn--active" : ""}`}
              onClick={() => setQuizSource("lectures")}
            >
              All lectures
              <span className="sidebar-segmented__meta">
                {lectureQuestions.length}
              </span>
            </button>
            <button
              type="button"
              className={`sidebar-segmented__btn ${quizSource === "glossary" ? "sidebar-segmented__btn--active" : ""}`}
              onClick={() => setQuizSource("glossary")}
              disabled={!hasTerms}
            >
              Glossary
            </button>
            <button
              type="button"
              className={`sidebar-segmented__btn ${quizSource === "sliv" ? "sidebar-segmented__btn--active" : ""}`}
              onClick={() => setQuizSource("sliv")}
              disabled={!slivDecks.length}
            >
              Sliv
            </button>
          </div>

          {quizSource === "glossary" && hasTerms ? (
            <>
              <span className="sidebar__label">Deck</span>
              <div className="sidebar-segmented">
                {modeOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`sidebar-segmented__btn ${glossaryMode === option.id ? "sidebar-segmented__btn--active" : ""}`}
                    onClick={() => setGlossaryMode(option.id)}
                  >
                    {option.label}
                    <span className="sidebar-segmented__meta">{option.count}</span>
                  </button>
                ))}
              </div>
              <p className="sidebar-study-controls__hint">{modeHint}</p>

              <span className="sidebar__label">Type</span>
              <div className="sidebar-segmented">
                <button
                  type="button"
                  className={`sidebar-segmented__btn ${glossaryFormat === "flashcard" ? "sidebar-segmented__btn--active" : ""}`}
                  onClick={() => setGlossaryFormat("flashcard")}
                >
                  Cards
                </button>
                <button
                  type="button"
                  className={`sidebar-segmented__btn ${glossaryFormat === "quiz" ? "sidebar-segmented__btn--active" : ""}`}
                  onClick={() => setGlossaryFormat("quiz")}
                >
                  Quiz
                </button>
              </div>
            </>
          ) : null}

          {quizSource === "sliv" && slivDecks.length > 1 ? (
            <>
              <span className="sidebar__label">Sliv deck</span>
              <div className="sidebar-segmented">
                {slivDecks.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`sidebar-segmented__btn ${selectedSlivId === d.id ? "sidebar-segmented__btn--active" : ""}`}
                    onClick={() => setSelectedSlivId(d.id)}
                  >
                    {d.title}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
