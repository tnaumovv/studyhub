export interface Term {
  id: string;
  deckId: string;
  number: number;
  term: string;
  definition: string;
  example: string;
}

export interface Deck {
  id: string;
  name: string;
  terms: Term[];
}

export interface Subject {
  id: string;
  name: string;
  decks: Deck[];
  examQuestionCount: number;
  builtin?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Lecture {
  id: string;
  subjectId: string;
  title: string;
  transcript: string;
  summary: string;
  topics: string[];
  wordCount: number;
  createdAt: number;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  quizQuestions: QuizQuestion[];
}

export interface SlivDeck {
  id: string;
  subjectId: string;
  title: string;
  rawText: string;
  questions: QuizQuestion[];
  createdAt: number;
}

export interface AppSettings {
  openAiApiKey: string;
  useAiSummaries: boolean;
}

export interface AppData {
  version: 3;
  activeSubjectId: string;
  subjects: Subject[];
  lectures: Lecture[];
  slivDecks: SlivDeck[];
  settings: AppSettings;
}

export type StudyMode = string;
export type StudyFormat = "flashcard" | "quiz";
export type StudyDisplayFormat = "lecture" | "quiz";
export type QuizSource = "glossary" | "lectures" | "sliv";
export type Theme = "light" | "dark";
export type AppView = "study" | "lectures" | "subjects" | "settings";

export const QUIZ_OPTION_COUNT = 5;
export const QUIZ_LABELS = ["A", "B", "C", "D", "E"] as const;
export const EXAM_MODE_ID = "exam";
export const DEFAULT_EXAM_COUNT = 40;
export const LECTURE_QUIZ_COUNT = 5;
export const SOCIOLOGY_SUBJECT_ID = "sociology";

export const DEFAULT_SETTINGS: AppSettings = {
  openAiApiKey: "",
  useAiSummaries: true,
};
