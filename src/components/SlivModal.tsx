import { useState } from "react";
import { parseLocalSliv } from "../utils/slivQuiz";

interface SlivModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, text: string) => Promise<void>;
}

export function SlivModal({ open, onClose, onSubmit }: SlivModalProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const previewCount = text.trim() ? parseLocalSliv(text).length : 0;

  if (!open) return null;

  const handleSubmit = async () => {
    if (text.trim().length < 30) {
      setError("Paste questions and answers (at least 30 characters).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit(title.trim() || "Sliv quiz", text);
      setTitle("");
      setText("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <button
        type="button"
        className="modal-overlay__backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="modal glass-card">
        <h2 className="modal__title">Import sliv questions</h2>
        <p className="modal__hint">
          Paste leaked exam questions with answers. AI will turn them into a
          quiz (A–E). Example format: numbered question, options A–E, line
          Answer: C
        </p>

        <label className="field">
          <span className="field__label">Quiz name</span>
          <input
            className="field__input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Midterm sliv 2024"
          />
        </label>

        <label className="field">
          <span className="field__label">Questions & answers</span>
          <textarea
            className="field__textarea"
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"1. What is socialization?\nA) ...\nB) ...\nAnswer: B"}
          />
        </label>

        {previewCount > 0 ? (
          <p className="modal__preview">
            Detected locally: <strong>{previewCount}</strong> question
            {previewCount === 1 ? "" : "s"} (AI will try to include all from
            text).
          </p>
        ) : null}

        {error ? <p className="field__error">{error}</p> : null}

        <div className="modal__actions btn-row btn-row--end">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Creating…" : "Create quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
