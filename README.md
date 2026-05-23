# Study Hub — Glossary & Lectures

Multi-subject study app: flashcards, quizzes, and automatic lecture explanations from transcripts.

## Features

- **Multiple subjects** — Sociology built-in; add History, Psychology, etc.
- **Per subject**: glossary study (decks + exam mode) and lecture library
- **Lectures** — upload multiple `.txt` transcripts or paste text; auto-summary of what each lecture covers
- **AI summaries (optional)** — OpenAI API key in Subjects → Settings for richer explanations
- **Without API key** — local analysis (keywords + key sentences)
- Light / dark theme

## Run

```bash
npm install
npm run dev
```

## Sociology data

Midterm (70) and endterm (77) terms are in `src/data/`. Regenerate with:

```bash
python3 scripts/parse-glossaries.py
```

## Lecture transcripts

1. Open **Lectures** tab
2. Select subject (e.g. Sociology)
3. Paste transcript or upload `.txt` files (one lecture per file)
4. Read auto-generated summary and topic chips

For best summaries, add an OpenAI API key under **Subjects → Settings** (stored locally in your browser only).
