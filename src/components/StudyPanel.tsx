import { CulturalStudiesGuideView } from "./CulturalStudiesGuideView";
import { FlashcardView } from "./FlashcardView";
import { LectureNotesView } from "./LectureNotesView";
import { QuizSession } from "./QuizSession";
import { QuizView } from "./QuizView";
import { SessionComplete } from "./SessionComplete";
import type { StudyState } from "../hooks/useStudyState";
import { CULTURAL_STUDIES_SUBJECT_ID, type Subject } from "../types";

interface StudyPanelProps {
  subject: Subject;
  study: StudyState;
}

export function StudyPanel({ subject, study }: StudyPanelProps) {
  const {
    displayFormat,
    quizSource,
    subjectLectures,
    lectureQuestions,
    slivQuestions,
    slivDecks,
    selectedSlivId,
    hasTerms,
    glossaryFormat,
    modeLabel,
    pool,
    current,
    total,
    finished,
    next,
    restart,
    progress,
  } = study;

  if (displayFormat === "lecture") {
    if (subject.id === CULTURAL_STUDIES_SUBJECT_ID) {
      return (
        <div className="study-stage study-stage--guide">
          <CulturalStudiesGuideView />
        </div>
      );
    }
    return (
      <div className="study-stage">
        <LectureNotesView lectures={subjectLectures} subjectName={subject.name} />
      </div>
    );
  }

  if (quizSource === "lectures") {
    return (
      <div className="study-stage">
        <QuizSession
          key={`lec-${subject.id}-${lectureQuestions.length}`}
          questions={lectureQuestions}
        />
      </div>
    );
  }

  if (quizSource === "sliv") {
    return (
      <div className="study-stage">
        <QuizSession
          key={selectedSlivId ?? "sliv"}
          questions={slivQuestions}
          title={slivDecks.find((d) => d.id === selectedSlivId)?.title}
        />
      </div>
    );
  }

  if (!hasTerms) {
    return (
      <div className="study-stage">
        <div className="glass-card empty-panel empty-panel--compact">
          <p>No glossary terms for this subject.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="study-stage study-stage--cards">
      {!finished && current ? (
        <>
          <div className="progress progress--wide">
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
    </div>
  );
}
