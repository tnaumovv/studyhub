import type { QuizQuestion } from "../types";
import { LECTURE_QUIZ_COUNT, QUIZ_OPTION_COUNT } from "../types";
import { shuffle } from "./shuffle";

function createId(): string {
  return `q-${crypto.randomUUID().slice(0, 8)}`;
}

function buildLocalQuestions(
  transcript: string,
  topics: string[],
  summary: string,
): QuizQuestion[] {
  const sentences = summary
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40 && s.length < 280);

  const transcriptBits = transcript
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30 && s.length < 200);

  const pool = [...new Set([...sentences, ...transcriptBits])].slice(0, 20);
  const topicList = topics.length ? topics : ["the main theme"];

  const questions: QuizQuestion[] = [];

  for (let i = 0; i < LECTURE_QUIZ_COUNT; i += 1) {
    const topic = topicList[i % topicList.length];
    const correct =
      pool[i % pool.length] ??
      `The lecture explains ${topic} in depth.`;

    const wrong = shuffle(
      pool.filter((p) => p !== correct).concat(transcriptBits),
    )
      .slice(0, QUIZ_OPTION_COUNT - 1)
      .map((w) => w.slice(0, 180));

    while (wrong.length < QUIZ_OPTION_COUNT - 1) {
      wrong.push(`This lecture does not discuss ${topic}.`);
    }

    const options = shuffle([correct, ...wrong.slice(0, QUIZ_OPTION_COUNT - 1)]);
    questions.push({
      id: createId(),
      question: `According to this lecture, which statement is most accurate about "${topic}"?`,
      options,
      correctIndex: options.indexOf(correct),
    });
  }

  return questions;
}

export async function generateLectureQuiz(
  transcript: string,
  summary: string,
  topics: string[],
  options: {
    apiKey?: string;
    useAi?: boolean;
    forceEnglish?: boolean;
  },
): Promise<QuizQuestion[]> {
  const local = buildLocalQuestions(transcript, topics, summary);

  if (!options.useAi || !options.apiKey?.trim()) {
    return local;
  }

  try {
    const snippet = transcript.slice(0, 10000);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: `Create ${LECTURE_QUIZ_COUNT} multiple-choice quiz questions from the lecture transcript. Each question must have exactly ${QUIZ_OPTION_COUNT} options and one correct answer. Questions must test understanding of the lecture content. Reply in English only. JSON: {"questions":[{"question":"","options":["","","","",""],"correctIndex":0}]}`,
          },
          { role: "user", content: snippet },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) return local;

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return local;

    const parsed = JSON.parse(content) as {
      questions?: Array<{
        question?: string;
        options?: string[];
        correctIndex?: number;
      }>;
    };

    if (!Array.isArray(parsed.questions) || !parsed.questions.length) {
      return local;
    }

    return parsed.questions.slice(0, LECTURE_QUIZ_COUNT).map((q) => {
      const opts = (q.options ?? []).slice(0, QUIZ_OPTION_COUNT);
      while (opts.length < QUIZ_OPTION_COUNT) opts.push("—");
      const correctIndex = Math.min(
        Math.max(0, q.correctIndex ?? 0),
        QUIZ_OPTION_COUNT - 1,
      );
      return {
        id: createId(),
        question: q.question?.trim() || "Question",
        options: opts,
        correctIndex,
      };
    });
  } catch {
    return local;
  }
}
