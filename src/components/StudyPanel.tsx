import { useEffect, useMemo, useState } from "react";
import { FlashcardView } from "./FlashcardView";
import { LectureNotesView } from "./LectureNotesView";
import { QuizSession } from "./QuizSession";
import { QuizView } from "./QuizView";
import { SessionComplete } from "./SessionComplete";
import { useStudySession } from "../hooks/useStudySession";
import type {
  Lecture,
  QuizQuestion,
  QuizSource,
  SlivDeck,
  StudyDisplayFormat,
  StudyFormat,
  StudyMode,
  Subject,
} from "../types";
import { EXAM_MODE_ID } from "../types";
import { flattenLectureQuestions } from "../utils/slivQuiz";
import { getModeOptions, modeDescription } from "../utils/study";
import { shuffle } from "../utils/shuffle";

interface StudyPanelProps {
  subject: Subject;
  lectures: Lecture[];
  slivDecks: SlivDeck[];
}

export function StudyPanel({ subject, lectures, slivDecks }: StudyPanelProps) {
  const [displayFormat, setDisplayFormat] =
    useState<StudyDisplayFormat>("lecture");
  const [quizSource, setQuizSource] = useState<QuizSource>("lectures");
  const [selectedSlivId, setSelectedSlivId] = useState<string | null>(null);

  const modeOptions = useMemo(() => getModeOptions(subject), [subject]);
  const defaultMode = modeOptions[modeOptions.length - 1]?.id ?? EXAM_MODE_ID;
  const [glossaryMode, setGlossaryMode] = useState<StudyMode>(defaultMode);
  const [glossaryFormat, setGlossaryFormat] = useState<StudyFormat>("flashcard");

  useEffect(() => {
    setGlossaryMode(defaultMode);
  }, [subject.id, defaultMode]);

  useEffect(() => {
    if (slivDecks.length && !selectedSlivId) {
      setSelectedSlivId(slivDecks[0].id);
    }
  }, [slivDecks, selectedSlivId]);

  const { pool, current, index, total, finished, next, restart } =
    useStudySession(subject, glossaryMode, glossaryFormat);

  const subjectLectures = useMemo(
    () => lectures.filter((l) => l.subjectId === subject.id),
    [lectures, subject.id],
  );

  const lectureQuestions = useMemo(
    () => flattenLectureQuestions(subjectLectures, subject.id),
    [subjectLectures, subject.id],
  );

  const slivQuestions: QuizQuestion[] = useMemo(() => {
    const deck = slivDecks.find((d) => d.id === selectedSlivId);
    return deck ? shuffle([...deck.questions]) : [];
  }, [slivDecks, selectedSlivId]);

  const hasTerms = subject.decks.some((d) => d.terms.length > 0);
  const modeLabel =
    modeOptions.find((m) => m.id === glossaryMode)?.label ?? glossaryMode;
  const progress = total > 0 ? Math.min(index + 1, total) : 0;

  return (
    <div className="study-panel">
      <div className="format-bar glass-card">
        <span className="format-bar__label">Format</span>
        <div className="segmented">
          <button
            type="button"
            className={`segmented__btn ${displayFormat === "lecture" ? "segmented__btn--active" : ""}`}
            onClick={() => setDisplayFormat("lecture")}
          >
            Lecture
          </button>
          <button
            type="button"
            className={`segmented__btn ${displayFormat === "quiz" ? "segmented__btn--active" : ""}`}
            onClick={() => setDisplayFormat("quiz")}
          >
            Quiz
          </button>
        </div>
      </div>

      {displayFormat === "lecture" ? (
        <LectureNotesView lectures={subjectLectures} subjectName={subject.name} />
      ) : (
        <>
          <div className="format-bar glass-card">
            <span className="format-bar__label">Quiz source</span>
            <div className="segmented segmented--wrap">
              <button
                type="button"
                className={`segmented__btn ${quizSource === "lectures" ? "segmented__btn--active" : ""}`}
                onClick={() => setQuizSource("lectures")}
              >
                All lectures
                <span className="segmented__meta">{lectureQuestions.length}</span>
              </button>
              <button
                type="button"
                className={`segmented__btn ${quizSource === "glossary" ? "segmented__btn--active" : ""}`}
                onClick={() => setQuizSource("glossary")}
                disabled={!hasTerms}
              >
                Glossary
              </button>
              <button
                type="button"
                className={`segmented__btn ${quizSource === "sliv" ? "segmented__btn--active" : ""}`}
                onClick={() => setQuizSource("sliv")}
                disabled={!slivDecks.length}
              >
                Sliv
              </button>
            </div>
          </div>

          {quizSource === "lectures" ? (
            <QuizSession
              key={`lec-${subject.id}-${lectureQuestions.length}`}
              questions={lectureQuestions}
              title="Quiz from all lectures"
            />
          ) : null}

          {quizSource === "sliv" ? (
            <>
              {slivDecks.length > 1 ? (
                <div className="sliv-picker">
                  {slivDecks.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className={`segmented__btn ${selectedSlivId === d.id ? "segmented__btn--active" : ""}`}
                      onClick={() => setSelectedSlivId(d.id)}
                    >
                      {d.title}
                    </button>
                  ))}
                </div>
              ) : null}
              <QuizSession
                key={selectedSlivId ?? "sliv"}
                questions={slivQuestions}
                title={slivDecks.find((d) => d.id === selectedSlivId)?.title}
              />
            </>
          ) : null}

          {quizSource === "glossary" && hasTerms ? (
            <>
              <div className="format-bar glass-card">
                <div className="control-group">
                  <span className="control-group__label">Deck</span>
                  <div className="segmented segmented--wrap">
                    {modeOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`segmented__btn ${glossaryMode === option.id ? "segmented__btn--active" : ""}`}
                        onClick={() => setGlossaryMode(option.id)}
                      >
                        {option.label}
                        <span className="segmented__meta">{option.count}</span>
                      </button>
                    ))}
                  </div>
                  <p className="control-group__hint">
                    {modeDescription(subject, glossaryMode)}
                  </p>
                </div>
                <div className="control-group">
                  <span className="control-group__label">Type</span>
                  <div className="segmented">
                    <button
                      type="button"
                      className={`segmented__btn ${glossaryFormat === "flashcard" ? "segmented__btn--active" : ""}`}
                      onClick={() => setGlossaryFormat("flashcard")}
                    >
                      Cards
                    </button>
                    <button
                      type="button"
                      className={`segmented__btn ${glossaryFormat === "quiz" ? "segmented__btn--active" : ""}`}
                      onClick={() => setGlossaryFormat("quiz")}
                    >
                      Quiz
                    </button>
                  </div>
                </div>
              </div>

              <main className="main">
                {!finished && current ? (
                  <>
                    <div className="progress">
                      <span>
                        {progress} / {total}
                      </span>
                      <div className="progress__bar">
                        <div
                          className="progress__fill"
                          style={{ width: `${(progress / total) * 100}%` }}
                        />
                      </div>
                    </div>
                    {glossaryFormat === "flashcard" ? (
                      <FlashcardView term={current} onNext={next} />
                    ) : (
                      <QuizView term={current} pool={pool} onNext={next} />
                    )}
                  </>
                ) : (
                  <SessionComplete
                    total={total}
                    modeLabel={modeLabel}
                    onRestart={restart}
                  />
                )}
              </main>
            </>
          ) : null}

          {quizSource === "glossary" && !hasTerms ? (
            <div className="glass-card empty-panel empty-panel--compact">
              <p>No glossary terms for this subject.</p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
