import { useCallback, useEffect, useMemo, useState } from "react";
import type { StudyFormat, StudyMode, Subject, Term } from "../types";
import { buildQueue, getPoolForMode } from "../utils/study";

export function useStudySession(
  subject: Subject,
  mode: StudyMode,
  format: StudyFormat,
) {
  const [queue, setQueue] = useState<Term[]>(() => buildQueue(subject, mode));
  const [index, setIndex] = useState(0);

  const pool = useMemo(
    () => getPoolForMode(subject, mode),
    [subject, mode],
  );

  useEffect(() => {
    setQueue(buildQueue(subject, mode));
    setIndex(0);
  }, [subject, mode, format]);

  const current = queue[index] ?? null;
  const total = queue.length;
  const finished = index >= total || total === 0;

  const restart = useCallback(() => {
    setQueue(buildQueue(subject, mode));
    setIndex(0);
  }, [subject, mode]);

  const next = useCallback(() => {
    setIndex((i) => i + 1);
  }, []);

  return {
    pool,
    current,
    index,
    total,
    finished,
    next,
    restart,
  };
}
