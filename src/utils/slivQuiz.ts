import type { QuizQuestion } from "../types";
import { QUIZ_OPTION_COUNT } from "../types";
import { shuffle } from "./shuffle";

function createId(): string {
  return `q-${crypto.randomUUID().slice(0, 8)}`;
}

function normalizeQuestionBlock(block: string): string[] {
  return block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function isQuestionStart(line: string): boolean {
  return (
    /^\d+[\.\):\-]\s+\S/.test(line) ||
    /^question\s*#?\s*\d+/i.test(line) ||
    /^q\s*#?\s*\d+[\.\):\-]?\s/i.test(line) ||
    /^#{1,3}\s*\d+[\.\)]\s/.test(line)
  );
}

function splitIntoQuestionBlocks(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  const lines = normalized.split("\n");
  const blocks: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (isQuestionStart(trimmed) && current.length > 0) {
      blocks.push(current.join("\n"));
      current = [trimmed];
    } else {
      current.push(trimmed);
    }
  }

  if (current.length > 0) blocks.push(current.join("\n"));
  if (blocks.length > 0) return blocks;

  return normalized
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b.length > 10);
}

function parseOptionLine(line: string): { letter: string; text: string } | null {
  const m = line.match(/^([A-Ea-e])[\.\):\-]\s+(.+)$/) ?? line.match(/^\(([A-Ea-e])\)\s+(.+)$/);
  if (!m) return null;
  return { letter: m[1].toUpperCase(), text: m[2].trim() };
}

function parseBlock(block: string): QuizQuestion | null {
  const lines = normalizeQuestionBlock(block);
  if (lines.length < 2) return null;

  let questionLine = lines[0].replace(/^\d+[\.\):\-]\s*/, "");
  questionLine = questionLine.replace(/^question\s*#?\s*\d+\s*:?\s*/i, "");
  questionLine = questionLine.replace(/^q\s*#?\s*\d+[\.\):\-]?\s*/i, "");

  const optionLines: { letter: string; text: string }[] = [];
  let correctIndex = 0;
  let foundAnswer = false;

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    const answerMatch = line.match(/^(?:answer|correct|key)\s*:\s*([A-Ea-e])/i);
    if (answerMatch) {
      const idx = "ABCDE".indexOf(answerMatch[1].toUpperCase());
      if (idx >= 0) {
        correctIndex = idx;
        foundAnswer = true;
      }
      continue;
    }

    const opt = parseOptionLine(line);
    if (opt) {
      if (/\*\s*$/.test(opt.text) || /^✓/.test(opt.text)) {
        correctIndex = optionLines.length;
        opt.text = opt.text.replace(/\*\s*$/, "").trim();
      }
      optionLines.push(opt);
    }
  }

  if (optionLines.length < 2) return null;

  const options = optionLines
    .slice(0, QUIZ_OPTION_COUNT)
    .map((o) => o.text);
  while (options.length < QUIZ_OPTION_COUNT) options.push("—");

  if (!foundAnswer) {
    const letter = optionLines[correctIndex]?.letter ?? "A";
    correctIndex = Math.min("ABCDE".indexOf(letter), options.length - 1);
  } else {
    const answerLetter = lines
      .find((l) => /^(?:answer|correct|key)\s*:/i.test(l))
      ?.match(/^(?:answer|correct|key)\s*:\s*([A-Ea-e])/i)?.[1]
      ?.toUpperCase();
    if (answerLetter) {
      const idx = optionLines.findIndex((o) => o.letter === answerLetter);
      if (idx >= 0) correctIndex = idx;
    }
  }

  return {
    id: createId(),
    question: questionLine.trim(),
    options,
    correctIndex: Math.min(Math.max(0, correctIndex), options.length - 1),
  };
}

export function parseLocalSliv(text: string): QuizQuestion[] {
  const blocks = splitIntoQuestionBlocks(text);
  const questions: QuizQuestion[] = [];

  for (const block of blocks) {
    const q = parseBlock(block);
    if (q) questions.push(q);
  }

  return questions;
}

function mergeQuestionLists(...lists: QuizQuestion[][]): QuizQuestion[] {
  const seen = new Set<string>();
  const merged: QuizQuestion[] = [];

  for (const list of lists) {
    for (const q of list) {
      const key = q.question.toLowerCase().replace(/\s+/g, " ").slice(0, 120);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push({ ...q, id: createId() });
    }
  }

  return merged;
}

async function fetchAiSlivQuestions(
  rawText: string,
  apiKey: string,
): Promise<QuizQuestion[]> {
  const chunks: string[] = [];
  const chunkSize = 12000;
  for (let i = 0; i < rawText.length; i += chunkSize) {
    chunks.push(rawText.slice(i, i + chunkSize));
  }

  const all: QuizQuestion[] = [];

  for (let i = 0; i < chunks.length; i += 1) {
    const partHint =
      chunks.length > 1
        ? ` This is part ${i + 1} of ${chunks.length}. Extract every question in this part only.`
        : "";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.1,
        max_tokens: 16000,
        messages: [
          {
            role: "system",
            content: `You parse leaked exam dumps. Extract EVERY question from the text — do not skip, merge, or summarize.${partHint} Each question needs exactly ${QUIZ_OPTION_COUNT} options (A–E) and correctIndex 0–4. Return JSON: {"questions":[{"question":"","options":["","","","",""],"correctIndex":0}]}`,
          },
          { role: "user", content: chunks[i] },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) continue;

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) continue;

    const parsed = JSON.parse(content) as {
      questions?: Array<{
        question?: string;
        options?: string[];
        correctIndex?: number;
      }>;
    };

    for (const q of parsed.questions ?? []) {
      const opts = (q.options ?? []).slice(0, QUIZ_OPTION_COUNT);
      while (opts.length < QUIZ_OPTION_COUNT) opts.push("—");
      all.push({
        id: createId(),
        question: q.question?.trim() || "Question",
        options: opts,
        correctIndex: Math.min(
          Math.max(0, q.correctIndex ?? 0),
          QUIZ_OPTION_COUNT - 1,
        ),
      });
    }
  }

  return all;
}

export async function generateSlivQuiz(
  rawText: string,
  _title: string,
  options: { apiKey?: string; useAi?: boolean },
): Promise<QuizQuestion[]> {
  const local = parseLocalSliv(rawText);

  if (options.useAi && options.apiKey?.trim()) {
    try {
      const ai = await fetchAiSlivQuestions(rawText, options.apiKey);
      const merged = mergeQuestionLists(local, ai);
      if (merged.length > 0) return merged;
    } catch {
      /* fall through to local */
    }
  }

  if (local.length > 0) return local;

  throw new Error(
    "Could not parse questions. Use numbered questions with A–E options and Answer: X, or add an OpenAI key in Settings.",
  );
}

export function flattenLectureQuestions(
  lectures: { quizQuestions: QuizQuestion[]; subjectId?: string }[],
  subjectId: string,
): QuizQuestion[] {
  return shuffle(
    lectures
      .filter((l) => l.subjectId === subjectId)
      .flatMap((l) => l.quizQuestions),
  );
}
