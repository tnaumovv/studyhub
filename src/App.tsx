import { useCallback, useEffect, useState } from "react";
import { LecturesPanel } from "./components/LecturesPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { Sidebar } from "./components/Sidebar";
import { SlivModal } from "./components/SlivModal";
import { StudyControls } from "./components/StudyControls";
import { StudyPanel } from "./components/StudyPanel";
import { SubjectsPanel } from "./components/SubjectsPanel";
import { useAppData } from "./hooks/useAppData";
import { useStudyState } from "./hooks/useStudyState";
import { useTheme } from "./hooks/useTheme";
import { CULTURAL_STUDIES_SUBJECT_ID, type AppView } from "./types";
import "./App.css";

const SIDEBAR_KEY = "study-hub-sidebar-open";

function readSidebarOpen(): boolean {
  const v = localStorage.getItem(SIDEBAR_KEY);
  if (v === "false") return false;
  if (v === "true") return true;
  return window.innerWidth > 860;
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<AppView>("study");
  const [sidebarOpen, setSidebarOpen] = useState(readSidebarOpen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [slivOpen, setSlivOpen] = useState(false);

  const {
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
  } = useAppData();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, String(sidebarOpen));
  }, [sidebarOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 860) {
      setMobileOpen((o) => !o);
    } else {
      setSidebarOpen((o) => !o);
    }
  };

  const studyState = useStudyState(
    activeSubject!,
    subjectLectures,
    subjectSlivDecks,
  );

  const isGuideSubject = activeSubject?.id === CULTURAL_STUDIES_SUBJECT_ID;
  const isGuideStudy = view === "study" && isGuideSubject;

  const shellClass = [
    "shell",
    sidebarOpen ? "shell--sidebar-open" : "shell--sidebar-closed",
    mobileOpen ? "shell--mobile-open" : "",
    isGuideStudy ? "shell--guide" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (!activeSubject) return null;

  const subtitles: Record<AppView, string> = {
    study: isGuideSubject
      ? "Exam study guide — 10 lectures"
      : "Lecture notes and quizzes",
    lectures: "Upload and manage lectures",
    subjects: "Add and delete subjects",
    settings: "AI preferences",
  };

  return (
    <div className={shellClass}>
      {mobileOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      ) : null}

      <Sidebar
        subjects={data.subjects}
        activeSubjectId={data.activeSubjectId}
        view={view}
        open={sidebarOpen || mobileOpen}
        onToggle={handleToggleSidebar}
        onSelectSubject={setActiveSubjectId}
        onChangeView={setView}
        onToggleTheme={toggleTheme}
        themeLabel={theme === "light" ? "Dark" : "Light"}
        onNavClick={closeMobile}
        studyControls={
          view === "study" ? (
            <StudyControls {...studyState} subjectId={activeSubject.id} />
          ) : undefined
        }
      />

      <div
        className={[
          "shell__main",
          view === "study" ? "shell__main--study" : "",
          isGuideStudy ? "shell__main--guide" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <header className="main-header">
          <button
            type="button"
            className="burger btn btn--ghost btn--icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="burger__bar" />
            <span className="burger__bar" />
            <span className="burger__bar" />
          </button>

          {!sidebarOpen ? (
            <button
              type="button"
              className="btn btn--ghost btn--small main-header__open-sidebar"
              onClick={() => setSidebarOpen(true)}
            >
              Menu
            </button>
          ) : null}

          <div className="main-header__text">
            <h2 className="main-header__title">{activeSubject.name}</h2>
            <p className="main-header__subtitle">{subtitles[view]}</p>
          </div>
        </header>

        {view === "study" && (
          <StudyPanel subject={activeSubject} study={studyState} />
        )}

        {view === "lectures" && (
          <LecturesPanel
            subject={activeSubject}
            lectures={subjectLectures}
            useAiSummaries={data.settings.useAiSummaries}
            hasApiKey={Boolean(data.settings.openAiApiKey.trim())}
            onAdd={async (title, transcript, meta) => {
              await addLectureFromTranscript(
                activeSubject.id,
                title,
                transcript,
                meta,
              );
            }}
            onRemove={removeLecture}
          />
        )}

        {view === "subjects" && (
          <SubjectsPanel
            subjects={data.subjects}
            activeSubjectId={data.activeSubjectId}
            onAddSubject={addSubject}
            onRemoveSubject={removeSubject}
            onSelectSubject={setActiveSubjectId}
            slivDecks={subjectSlivDecks}
            onRemoveSliv={removeSlivDeck}
          />
        )}

        {view === "settings" && (
          <SettingsPanel
            settings={data.settings}
            onUpdateSettings={updateSettings}
          />
        )}

        <button
          type="button"
          className="fab"
          aria-label="Import sliv quiz"
          title="Import sliv questions"
          onClick={() => setSlivOpen(true)}
        >
          +
        </button>
      </div>

      <SlivModal
        open={slivOpen}
        onClose={() => setSlivOpen(false)}
        onSubmit={async (title, text) => {
          await addSlivDeck(activeSubject.id, title, text);
        }}
      />
    </div>
  );
}
