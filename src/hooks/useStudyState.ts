import { useEffect, useMemo, useState } from "react";
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
import { useStudySession } from "./useStudySession";

export function useStudyState(
  subject: Subject,
  lectures: Lecture[],
  slivDecks: SlivDeck[],
) {
  const [displayFormat, setDisplayFormat] =
    useState<StudyDisplayFormat>("lecture");
  const [quizSource, setQuizSource] = useState<QuizSource>("glossary");
  const [selectedSlivId, setSelectedSlivId] = useState<string | null>(null);

  const modeOptions = useMemo(() => getModeOptions(subject), [subject]);
  const defaultMode = modeOptions[modeOptions.length - 1]?.id ?? EXAM_MODE_ID;
  const [glossaryMode, setGlossaryMode] = useState<StudyMode>(defaultMode);
  const [glossaryFormat, setGlossaryFormat] = useState<StudyFormat>("flashcard");

  useEffect(() => {
    setGlossaryMode(defaultMode);
  }, [subject.id, defaultMode]);

  useEffect(() => {
    if (slivDecks.length) {
      setSelectedSlivId((id) => id ?? slivDecks[0].id);
    } else {
      setSelectedSlivId(null);
    }
  }, [slivDecks]);

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
  const modeHint = modeDescription(subject, glossaryMode);

  const session = useStudySession(subject, glossaryMode, glossaryFormat);
  const progress =
    session.total > 0 ? Math.min(session.index + 1, session.total) : 0;

  return {
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
    subjectLectures,
    lectureQuestions,
    slivQuestions,
    slivDecks,
    hasTerms,
    modeLabel,
    modeHint,
    progress,
    ...session,
  };
}

export type StudyState = ReturnType<typeof useStudyState>;
