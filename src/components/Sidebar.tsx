import type { ReactElement, ReactNode } from "react";
import type { AppView, Subject } from "../types";

interface SidebarProps {
  subjects: Subject[];
  activeSubjectId: string;
  view: AppView;
  open: boolean;
  onToggle: () => void;
  onSelectSubject: (id: string) => void;
  onChangeView: (view: AppView) => void;
  onToggleTheme: () => void;
  themeLabel: string;
  onNavClick?: () => void;
  studyControls?: ReactNode;
}

const NAV: { id: AppView; label: string }[] = [
  { id: "study", label: "Study" },
  { id: "lectures", label: "Lectures" },
  { id: "subjects", label: "Subjects" },
  { id: "settings", label: "Settings" },
];

function IconStudy() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 5h16v14H4V5zm2 2v10h12V7H6zm2 2h8v2H8V9zm0 4h5v2H8v-2z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconLectures() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
    </svg>
  );
}

function IconSubjects() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const ICONS: Record<AppView, () => ReactElement> = {
  study: IconStudy,
  lectures: IconLectures,
  subjects: IconSubjects,
  settings: IconSettings,
};

export function Sidebar({
  subjects,
  activeSubjectId,
  view,
  open,
  onToggle,
  onSelectSubject,
  onChangeView,
  onToggleTheme,
  themeLabel,
  onNavClick,
  studyControls,
}: SidebarProps) {
  const pick = (fn: () => void) => () => {
    fn();
    onNavClick?.();
  };

  return (
    <aside
      className={`sidebar ${open ? "sidebar--open" : "sidebar--closed"}`}
      aria-hidden={!open}
    >
      <div className="sidebar__window-dots" aria-hidden>
        <span className="dot dot--red" />
        <span className="dot dot--yellow" />
        <span className="dot dot--green" />
      </div>

      <div className="sidebar__top">
        {open ? (
          <h1 className="sidebar__title">Study Hub</h1>
        ) : (
          <span className="sidebar__title-short">S</span>
        )}
        <button
          type="button"
          className="sidebar__collapse btn btn--ghost btn--icon"
          onClick={onToggle}
          aria-label={open ? "Close sidebar" : "Open sidebar"}
        >
          {open ? "‹" : "›"}
        </button>
      </div>

      {open ? (
        <>
          <nav className="sidebar__nav" aria-label="Menu">
            <span className="sidebar__label">Menu</span>
            {NAV.map((item) => {
              const Icon = ICONS[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sidebar__nav-btn ${view === item.id ? "sidebar__nav-btn--active" : ""}`}
                  onClick={pick(() => onChangeView(item.id))}
                >
                  <Icon />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {view === "study" && studyControls ? (
            <div className="sidebar__study-wrap">{studyControls}</div>
          ) : null}

          <div className="sidebar__subjects-block">
            <span className="sidebar__label">Subjects</span>
            <ul className="sidebar__subjects">
              {subjects.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`sidebar__subject ${s.id === activeSubjectId ? "sidebar__subject--active" : ""}`}
                    onClick={pick(() => onSelectSubject(s.id))}
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar__footer">
            <button
              type="button"
              className="btn btn--ghost btn--block"
              onClick={onToggleTheme}
            >
              {themeLabel} theme
            </button>
          </div>
        </>
      ) : (
        <nav className="sidebar__nav sidebar__nav--icons">
          {NAV.map((item) => {
            const Icon = ICONS[item.id];
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar__nav-btn ${view === item.id ? "sidebar__nav-btn--active" : ""}`}
                onClick={pick(() => onChangeView(item.id))}
                title={item.label}
              >
                <Icon />
              </button>
            );
          })}
        </nav>
      )}
    </aside>
  );
}
