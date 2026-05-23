import { sociologySubject } from "../data/sociologySeed";
import type { AppData, Lecture, SlivDeck } from "../types";
import {
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

function createInitialData(): AppData {
  return {
    version: 3,
    activeSubjectId: SOCIOLOGY_SUBJECT_ID,
    subjects: [structuredClone(sociologySubject)],
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

    const hasSociology = parsed.subjects.some(
      (s) => s.id === SOCIOLOGY_SUBJECT_ID,
    );
    if (!hasSociology) {
      parsed.subjects.unshift(structuredClone(sociologySubject));
    } else {
      const idx = parsed.subjects.findIndex(
        (s) => s.id === SOCIOLOGY_SUBJECT_ID,
      );
      if (parsed.subjects[idx].builtin) {
        parsed.subjects[idx] = structuredClone(sociologySubject);
      }
    }

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
