import { useCallback, useEffect, useState } from "react";
import { sociologySubject } from "../data/sociologySeed";
import {
  createId,
  getSubjectLectures,
  getSubjectSlivDecks,
  loadAppData,
  saveAppData,
} from "../storage/appStorage";
import type { AppData, Lecture, SlivDeck } from "../types";
import { DEFAULT_EXAM_COUNT } from "../types";
import { generateLectureQuiz } from "../utils/lectureQuiz";
import { summarizeLecture } from "../utils/lectureSummary";
import { generateSlivQuiz } from "../utils/slivQuiz";

export function useAppData() {
  const [data, setData] = useState<AppData>(loadAppData);

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const activeSubject =
    data.subjects.find((s) => s.id === data.activeSubjectId) ?? data.subjects[0];

  const setActiveSubjectId = useCallback((id: string) => {
    setData((d) => ({ ...d, activeSubjectId: id }));
  }, []);

  const addSubject = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const subject = {
      id: createId("subject"),
      name: trimmed,
      decks: [{ id: "main", name: "Main glossary", terms: [] }],
      examQuestionCount: DEFAULT_EXAM_COUNT,
    };
    setData((d) => ({
      ...d,
      subjects: [...d.subjects, subject],
      activeSubjectId: subject.id,
    }));
    return subject.id;
  }, []);

  const removeSubject = useCallback((id: string) => {
    setData((d) => {
      let subjects = d.subjects.filter((s) => s.id !== id);
      const lectures = d.lectures.filter((l) => l.subjectId !== id);
      const slivDecks = d.slivDecks.filter((s) => s.subjectId !== id);

      if (subjects.length === 0) {
        subjects = [structuredClone(sociologySubject)];
      }

      const activeSubjectId =
        d.activeSubjectId === id ? subjects[0].id : d.activeSubjectId;

      return { ...d, subjects, lectures, slivDecks, activeSubjectId };
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<AppData["settings"]>) => {
    setData((d) => ({
      ...d,
      settings: { ...d.settings, ...patch },
    }));
  }, []);

  const addLectureFromTranscript = useCallback(
    async (
      subjectId: string,
      title: string,
      transcript: string,
      meta?: {
        youtubeUrl?: string;
        youtubeVideoId?: string;
        forceEnglish?: boolean;
      },
    ) => {
      const settings = data.settings;
      const result = await summarizeLecture(transcript, {
        fileName: title,
        apiKey: settings.openAiApiKey,
        useAi: settings.useAiSummaries,
        forceEnglish: meta?.forceEnglish,
      });

      const quizQuestions = await generateLectureQuiz(
        transcript,
        result.summary,
        result.topics,
        {
          apiKey: settings.openAiApiKey,
          useAi: settings.useAiSummaries,
          forceEnglish: meta?.forceEnglish,
        },
      );

      const lecture: Lecture = {
        id: createId("lecture"),
        subjectId,
        title: title.trim() || result.title,
        transcript,
        summary: result.summary,
        topics: result.topics,
        wordCount: transcript.split(/\s+/).filter(Boolean).length,
        createdAt: Date.now(),
        youtubeUrl: meta?.youtubeUrl,
        youtubeVideoId: meta?.youtubeVideoId,
        quizQuestions,
      };

      setData((d) => ({
        ...d,
        lectures: [{ ...lecture, subjectId }, ...d.lectures],
      }));

      return lecture;
    },
    [data.settings],
  );

  const removeLecture = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      lectures: d.lectures.filter((l) => l.id !== id),
    }));
  }, []);

  const addSlivDeck = useCallback(
    async (subjectId: string, title: string, rawText: string) => {
      const questions = await generateSlivQuiz(rawText, title, {
        apiKey: data.settings.openAiApiKey,
        useAi: data.settings.useAiSummaries,
      });

      const deck: SlivDeck = {
        id: createId("sliv"),
        subjectId,
        title: title.trim() || "Sliv quiz",
        rawText,
        questions,
        createdAt: Date.now(),
      };

      setData((d) => ({
        ...d,
        slivDecks: [deck, ...d.slivDecks],
      }));

      return deck;
    },
    [data.settings],
  );

  const removeSlivDeck = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      slivDecks: d.slivDecks.filter((s) => s.id !== id),
    }));
  }, []);

  const subjectLectures = activeSubject
    ? getSubjectLectures(data, activeSubject.id)
    : [];

  const subjectSlivDecks = activeSubject
    ? getSubjectSlivDecks(data, activeSubject.id)
    : [];

  return {
    data,
    activeSubject,
    setActiveSubjectId,
    addSubject,
    removeSubject,
    updateSettings,
    addLectureFromTranscript,
    removeLecture,
    addSlivDeck,
    removeSlivDeck,
    subjectLectures,
    subjectSlivDecks,
  };
}
