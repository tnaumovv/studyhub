import { useRef, useState } from "react";
import type { Lecture, Subject } from "../types";
import {
  fetchYouTubeTranscript,
  shouldForceEnglishSummary,
} from "../utils/youtube";

interface LecturesPanelProps {
  subject: Subject;
  lectures: Lecture[];
  onAdd: (
    title: string,
    transcript: string,
    meta?: {
      youtubeUrl?: string;
      youtubeVideoId?: string;
      forceEnglish?: boolean;
    },
  ) => Promise<void>;
  onRemove: (id: string) => void;
  useAiSummaries: boolean;
  hasApiKey: boolean;
}

export function LecturesPanel({
  subject,
  lectures,
  onAdd,
  onRemove,
  useAiSummaries,
  hasApiKey,
}: LecturesPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [paste, setPaste] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const subjectLectures = lectures.filter((l) => l.subjectId === subject.id);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setLoading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const text = await file.text();
        if (text.trim().length < 80) continue;
        await onAdd(file.name.replace(/\.[^.]+$/, ""), text);
      }
    } catch {
      setError("Could not process file.");
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handlePaste = async () => {
    const text = paste.trim();
    if (text.length < 80) {
      setError("Transcript must be at least 80 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onAdd(title.trim() || "Lecture", text);
      setPaste("");
      setTitle("");
    } catch {
      setError("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleYouTubeTranscript = async () => {
    setLoading(true);
    setError("");
    try {
      const { text, videoId } = await fetchYouTubeTranscript(youtubeUrl);
      setPaste(text);
      if (!title.trim()) setTitle(`YouTube ${videoId}`);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "YouTube error.");
    } finally {
      setLoading(false);
    }
  };

  const handleYouTubeAnalyze = async () => {
    setLoading(true);
    setError("");
    try {
      let text = paste.trim();
      let videoId: string | undefined;
      let forceEnglish = false;

      if (youtubeUrl.trim()) {
        const fetched = await fetchYouTubeTranscript(youtubeUrl);
        text = fetched.text;
        videoId = fetched.videoId;
        forceEnglish = shouldForceEnglishSummary(fetched.lang);
        setPaste(text);
      }

      if (text.length < 80) {
        setError("Get a transcript first (80+ characters).");
        return;
      }

      await onAdd(title.trim() || `YouTube ${videoId ?? "lecture"}`, text, {
        youtubeUrl: youtubeUrl.trim() || undefined,
        youtubeVideoId: videoId,
        forceEnglish,
      });
      setYoutubeUrl("");
      setPaste("");
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "YouTube error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (lec: Lecture) => {
    if (window.confirm(`Delete lecture "${lec.title}"?`)) {
      onRemove(lec.id);
    }
  };

  return (
    <div className="lectures-panel">
      <div className="glass-card panel-card">
        <h2 className="panel-card__title">Add lecture</h2>
        <p className="panel-card__hint subject-badge">
          Saving to: <strong>{subject.name}</strong> — lectures appear only in
          this subject (Study and Lectures).
          {useAiSummaries && hasApiKey ? " AI enabled." : ""}
        </p>

        <label className="field">
          <span className="field__label">YouTube link</span>
          <input
            className="field__input"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
          />
        </label>

        <label className="field">
          <span className="field__label">Title (optional)</span>
          <input
            className="field__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="field__label">Transcript</span>
          <textarea
            className="field__textarea"
            rows={5}
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder="Paste transcript or fetch from YouTube…"
          />
        </label>

        <div className="btn-row">
          <button
            type="button"
            className="btn btn--ghost"
            disabled={loading || !youtubeUrl.trim()}
            onClick={handleYouTubeTranscript}
          >
            Get transcript
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={loading}
            onClick={handleYouTubeAnalyze}
          >
            {loading ? "…" : "YouTube analyze"}
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={loading}
            onClick={handlePaste}
          >
            {loading ? "…" : "Analyze text"}
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            disabled={loading}
            onClick={() => fileRef.current?.click()}
          >
            Upload .txt
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,text/plain"
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {error ? <p className="field__error">{error}</p> : null}
      </div>

      <div className="glass-card panel-card">
        <h2 className="panel-card__title">
          {subject.name} — lectures ({subjectLectures.length})
        </h2>
        {subjectLectures.length === 0 ? (
          <p className="panel-card__hint">No lectures for this subject yet.</p>
        ) : (
          <ul className="lecture-manage-list">
            {subjectLectures.map((lec) => (
              <li key={lec.id} className="lecture-manage-item">
                <div className="lecture-manage-item__body">
                  <strong>{lec.title}</strong>
                  <span>
                    {lec.wordCount.toLocaleString()} words ·{" "}
                    {lec.quizQuestions.length} quiz Q ·{" "}
                    {new Date(lec.createdAt).toLocaleDateString()}
                  </span>
                  <div className="btn-row btn-row--left btn-row--tight">
                    <button
                      type="button"
                      className="btn btn--ghost btn--small"
                      onClick={() =>
                        setExpandedId(expandedId === lec.id ? null : lec.id)
                      }
                    >
                      {expandedId === lec.id
                        ? "Hide transcript"
                        : "View transcript"}
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
                    <button
                      type="button"
                      className="btn btn--danger btn--small"
                      onClick={() => handleDelete(lec)}
                    >
                      Delete
                    </button>
                  </div>
                  {expandedId === lec.id ? (
                    <pre className="lecture-item__transcript">
                      {lec.transcript}
                    </pre>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
