import { useState } from "react";
import type { Subject } from "../types";

import { useMemo } from "react";
import type { SlivDeck } from "../types";

interface SubjectsPanelProps {
  subjects: Subject[];
  activeSubjectId: string;
  slivDecks: SlivDeck[];
  onAddSubject: (name: string) => void;
  onRemoveSubject: (id: string) => void;
  onSelectSubject: (id: string) => void;
  onRemoveSliv: (id: string) => void;
}

export function SubjectsPanel({
  subjects,
  activeSubjectId,
  slivDecks,
  onAddSubject,
  onRemoveSubject,
  onSelectSubject,
  onRemoveSliv,
}: SubjectsPanelProps) {
  const [name, setName] = useState("");

  const subjectSlivDecks = useMemo(
    () => slivDecks.filter((d) => d.subjectId === activeSubjectId),
    [slivDecks, activeSubjectId],
  );

  const handleAdd = () => {
    if (!name.trim()) return;
    onAddSubject(name);
    setName("");
  };

  const handleDelete = (subject: Subject) => {
    const ok = window.confirm(
      `Delete "${subject.name}" and all its lectures?`,
    );
    if (ok) onRemoveSubject(subject.id);
  };

  return (
    <div className="subjects-panel">
      <div className="panel-card">
        <h2 className="panel-card__title">Manage subjects</h2>
        <p className="panel-card__hint">
          Add or remove subjects here. Lectures and glossary are stored
          separately for each subject. If you delete everything, Sociology is
          restored automatically.
        </p>

        <div className="add-subject">
          <input
            className="field__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New subject name"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button type="button" className="btn btn--primary" onClick={handleAdd}>
            Add subject
          </button>
        </div>
      </div>

      {subjectSlivDecks.length > 0 ? (
        <div className="glass-card panel-card">
          <h2 className="panel-card__title">Sliv quizzes (current subject)</h2>
          <ul className="lecture-manage-list">
            {subjectSlivDecks.map((d) => (
              <li key={d.id} className="lecture-manage-item">
                <div>
                  <strong>{d.title}</strong>
                  <span>{d.questions.length} questions</span>
                </div>
                <button
                  type="button"
                  className="btn btn--danger btn--small"
                  onClick={() => {
                    if (window.confirm(`Delete "${d.title}"?`)) onRemoveSliv(d.id);
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ul className="subject-manage-list">
        {subjects.map((s) => (
          <li
            key={s.id}
            className={`subject-manage-item ${s.id === activeSubjectId ? "subject-manage-item--active" : ""}`}
          >
            <button
              type="button"
              className="subject-manage-item__select"
              onClick={() => onSelectSubject(s.id)}
            >
              <strong>{s.name}</strong>
              <span>
                {s.decks.reduce((n, d) => n + d.terms.length, 0)} terms
                {s.builtin ? " · built-in" : ""}
              </span>
            </button>
            <button
              type="button"
              className="btn btn--danger btn--small"
              onClick={() => handleDelete(s)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
