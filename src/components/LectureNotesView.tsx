import { useState } from "react";
import type { Lecture } from "../types";

interface LectureNotesViewProps {
  lectures: Lecture[];
  subjectName: string;
}

export function LectureNotesView({ lectures, subjectName }: LectureNotesViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!lectures.length) {
    return (
      <div className="glass-card empty-panel">
        <h2>No lecture notes for {subjectName}</h2>
        <p>
          Upload a lecture in <strong>Lectures</strong> while{" "}
          <strong>{subjectName}</strong> is selected. Notes stay only in this
          subject.
        </p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      <p className="notes-list__subject">
        Notes for <strong>{subjectName}</strong> ({lectures.length})
      </p>
      {lectures.map((lec) => (
        <article key={lec.id} className="glass-card note-card">
          <header className="note-card__head">
            <h3 className="note-card__title">{lec.title}</h3>
            <time className="note-card__date">
              {new Date(lec.createdAt).toLocaleDateString()}
            </time>
          </header>

          {lec.topics.length > 0 ? (
            <div className="topic-chips">
              {lec.topics.map((t) => (
                <span key={t} className="topic-chip">
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <div className="note-card__body">
            {lec.summary.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="note-card__actions btn-row btn-row--left">
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() =>
                setExpandedId(expandedId === lec.id ? null : lec.id)
              }
            >
              {expandedId === lec.id ? "Hide transcript" : "View transcript"}
            </button>
            {lec.youtubeVideoId ? (
              <a
                className="btn btn--ghost btn--small"
                href={`https://www.youtube.com/watch?v=${lec.youtubeVideoId}`}
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </a>
            ) : null}
          </div>

          {expandedId === lec.id ? (
            <pre className="lecture-item__transcript">{lec.transcript}</pre>
          ) : null}
        </article>
      ))}
    </div>
  );
}
