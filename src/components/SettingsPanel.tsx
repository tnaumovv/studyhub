import type { AppSettings } from "../types";

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
}

export function SettingsPanel({
  settings,
  onUpdateSettings,
}: SettingsPanelProps) {
  return (
    <div className="subjects-panel">
      <div className="panel-card settings-card">
        <h2 className="panel-card__title">AI settings</h2>
        <p className="panel-card__hint">
          With an OpenAI API key, lectures get a detailed explanation and
          smarter quiz questions (5 questions, A–E). Without a key, built-in
          analysis is used.
        </p>

        <label className="field field--checkbox">
          <input
            type="checkbox"
            checked={settings.useAiSummaries}
            onChange={(e) =>
              onUpdateSettings({ useAiSummaries: e.target.checked })
            }
          />
          <span>Use AI when API key is set</span>
        </label>

        <label className="field">
          <span className="field__label">OpenAI API key</span>
          <input
            className="field__input"
            type="password"
            value={settings.openAiApiKey}
            onChange={(e) =>
              onUpdateSettings({ openAiApiKey: e.target.value })
            }
            placeholder="sk-…"
            autoComplete="off"
          />
        </label>

        <p className="panel-card__hint settings-card__note">
          Stored only in your browser. YouTube transcripts load via the local
          server when you run <code>npm run dev</code>.
        </p>
      </div>
    </div>
  );
}
