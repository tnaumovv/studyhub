import type { StudyMode, Subject, Term } from "../types";
import { EXAM_MODE_ID, QUIZ_OPTION_COUNT } from "../types";
import { shuffle } from "./shuffle";

export function getAllTerms(subject: Subject): Term[] {
  return subject.decks.flatMap((d) => d.terms);
}

export function getPoolForMode(subject: Subject, mode: StudyMode): Term[] {
  if (mode === EXAM_MODE_ID) return getAllTerms(subject);
  const deck = subject.decks.find((d) => d.id === mode);
  return deck?.terms ?? [];
}

export function buildQueue(subject: Subject, mode: StudyMode): Term[] {
  const shuffled = shuffle(getPoolForMode(subject, mode));
  if (mode === EXAM_MODE_ID) {
    return shuffled.slice(0, subject.examQuestionCount);
  }
  return shuffled;
}

export function truncate(text: string, max = 140): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export interface QuizQuestion {
  term: Term;
  options: string[];
  correctIndex: number;
}

export function buildQuizQuestion(current: Term, pool: Term[]): QuizQuestion {
  const wrongPool = pool.filter((t) => t.id !== current.id);
  const wrong = shuffle(wrongPool)
    .slice(0, QUIZ_OPTION_COUNT - 1)
    .map((t) => t.definition);

  const options = shuffle([current.definition, ...wrong]);
  const correctIndex = options.indexOf(current.definition);

  return { term: current, options, correctIndex };
}

export function getModeOptions(subject: Subject) {
  const deckOptions = subject.decks.map((d) => ({
    id: d.id,
    label: d.name,
    count: d.terms.length,
  }));

  const totalTerms = getAllTerms(subject).length;
  return [
    ...deckOptions,
    {
      id: EXAM_MODE_ID,
      label: "Exam",
      count: Math.min(subject.examQuestionCount, totalTerms),
    },
  ];
}

export function modeDescription(subject: Subject, mode: StudyMode): string {
  if (mode === EXAM_MODE_ID) {
    return `Mixed decks — ${subject.examQuestionCount} random terms`;
  }
  const deck = subject.decks.find((d) => d.id === mode);
  return deck ? `${deck.name} glossary only` : "";
}
