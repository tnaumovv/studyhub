import { culturalStudiesSubject } from "../data/culturalStudiesSeed";
import { sociologySubject } from "../data/sociologySeed";
import type { AppData, Lecture, SlivDeck } from "../types";
import {
  CULTURAL_STUDIES_SUBJECT_ID,
  DEFAULT_SETTINGS,
  SOCIOLOGY_SUBJECT_ID,
} from "../types";

const STORAGE_KEY = "study-platform-v1";

function migrateLecture(lec: Lecture, fallbackSubjectId: string): Lecture | null {
  const subjectId = lec.subjectId || fallbackSubjectId;
  if (!subjectId) return null;

  return {
    ...lec,
    subjectId,
    quizQuestions: lec.quizQuestions ?? [],
  };
}

function mergeBuiltinSubjects(subjects: AppData["subjects"]): AppData["subjects"] {
  let next = [...subjects];
  const builtins = [
    { id: SOCIOLOGY_SUBJECT_ID, seed: sociologySubject },
    { id: CULTURAL_STUDIES_SUBJECT_ID, seed: culturalStudiesSubject },
  ] as const;

  for (const { id, seed } of builtins) {
    const idx = next.findIndex((s) => s.id === id);
    if (idx === -1) {
      next.push(structuredClone(seed));
    } else if (next[idx].builtin) {
      next[idx] = structuredClone(seed);
    }
  }

  return next;
}

function createInitialData(): AppData {
  return {
    version: 3,
    activeSubjectId: SOCIOLOGY_SUBJECT_ID,
    subjects: mergeBuiltinSubjects([structuredClone(sociologySubject)]),
    lectures: [],
    slivDecks: [],
    settings: { ...DEFAULT_SETTINGS },
  };
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialData();

    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.subjects?.length) return createInitialData();

    parsed.subjects = mergeBuiltinSubjects(parsed.subjects);

    parsed.version = 3;
    parsed.settings = { ...DEFAULT_SETTINGS, ...parsed.settings };
    parsed.lectures = (parsed.lectures ?? [])
      .map((lec) => migrateLecture(lec, parsed.activeSubjectId))
      .filter((lec): lec is Lecture => lec !== null);
    parsed.slivDecks = parsed.slivDecks ?? [];

    if (!parsed.subjects.some((s) => s.id === parsed.activeSubjectId)) {
      parsed.activeSubjectId = parsed.subjects[0].id;
    }

    return parsed;
  } catch {
    return createInitialData();
  }
}

export function saveAppData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function getSubjectLectures(data: AppData, subjectId: string): Lecture[] {
  return data.lectures
    .filter((l) => l.subjectId === subjectId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function filterLecturesBySubject(
  lectures: Lecture[],
  subjectId: string,
): Lecture[] {
  return lectures.filter((l) => l.subjectId === subjectId);
}

export function getSubjectSlivDecks(
  data: AppData,
  subjectId: string,
): SlivDeck[] {
  return data.slivDecks
    .filter((d) => d.subjectId === subjectId)
    .sort((a, b) => b.createdAt - a.createdAt);
}
