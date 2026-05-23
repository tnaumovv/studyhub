interface SessionCompleteProps {
  total: number;
  modeLabel: string;
  onRestart: () => void;
}

export function SessionComplete({
  total,
  modeLabel,
  onRestart,
}: SessionCompleteProps) {
  return (
    <div className="complete-panel">
      <h2 className="complete-panel__title">Session complete</h2>
      <p className="complete-panel__text">
        You reviewed all {total} terms in <strong>{modeLabel}</strong> mode.
      </p>
      <button type="button" className="btn btn--primary" onClick={onRestart}>
        Study again
      </button>
    </div>
  );
}
