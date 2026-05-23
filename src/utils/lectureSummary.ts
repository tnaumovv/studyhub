export interface LectureSummaryResult {
  title: string;
  summary: string;
  topics: string[];
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "will", "would", "could", "should", "may", "might",
  "that", "this", "these", "those", "it", "its", "as", "by", "with", "from",
  "we", "they", "you", "he", "she", "i", "our", "their", "your", "not", "so",
  "if", "then", "than", "when", "what", "which", "who", "how", "also", "can",
  "into", "about", "over", "such", "more", "most", "very", "just", "only",
  "и", "в", "на", "с", "по", "к", "у", "о", "за", "из", "не", "что", "это",
  "как", "то", "же", "бы", "но", "а", "или", "для", "при", "от", "до", "мы",
  "вы", "они", "он", "она", "оно", "я", "ты", "его", "её", "их", "наш", "ваш",
]);

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40 && s.length < 500);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
}

function topKeywords(text: string, limit = 8): string[] {
  const freq = new Map<string, number>();
  for (const word of tokenize(text)) {
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

function scoreSentence(sentence: string, keywords: Set<string>, index: number, total: number): number {
  const words = tokenize(sentence);
  let score = 0;
  for (const w of words) {
    if (keywords.has(w)) score += 2;
  }
  if (index < total * 0.15) score += 3;
  if (index < total * 0.3) score += 1;
  if (sentence.length > 80 && sentence.length < 280) score += 1;
  return score;
}

function guessTitle(text: string, fallback: string): string {
  const firstLine = text.split("\n").find((l) => l.trim().length > 0)?.trim() ?? "";
  if (firstLine.length >= 8 && firstLine.length <= 120 && !firstLine.endsWith(".")) {
    return firstLine;
  }
  const firstSentence = splitSentences(text)[0];
  if (firstSentence && firstSentence.length <= 100) {
    return firstSentence.replace(/\.$/, "");
  }
  return fallback;
}

function isCyrillicHeavy(text: string): boolean {
  const cyr = (text.match(/[а-яё]/gi) ?? []).length;
  const lat = (text.match(/[a-z]/gi) ?? []).length;
  return cyr > lat;
}

export function summarizeLectureLocal(
  rawTranscript: string,
  fileName?: string,
): LectureSummaryResult {
  const text = normalizeText(rawTranscript);
  const ru = isCyrillicHeavy(text);
  const sentences = splitSentences(text);
  const keywords = new Set(tokenize(text).slice(0, 30));
  const topics = topKeywords(text, 8);

  const ranked = sentences
    .map((s, i) => ({ s, score: scoreSentence(s, keywords, i, sentences.length) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((x) => x.s);

  const intro = sentences.slice(0, 2).join(" ");
  const uniquePoints = [...new Set([...ranked, intro])].slice(0, 4);

  const title = guessTitle(
    rawTranscript,
    fileName?.replace(/\.[^.]+$/, "") ?? (ru ? "Лекция" : "Lecture"),
  );

  const summaryParts = ru
    ? [
        `Эта лекция в основном о: ${topics.join(", ")}.`,
        ...uniquePoints.map((p) => `• ${p}`),
      ]
    : [
        `This lecture mainly covers: ${topics.join(", ")}.`,
        ...uniquePoints.map((p) => `• ${p}`),
      ];

  return {
    title,
    summary: summaryParts.join("\n\n"),
    topics,
  };
}

export function summarizeLectureEnglishLocal(
  rawTranscript: string,
  fileName?: string,
): LectureSummaryResult {
  const text = normalizeText(rawTranscript);
  const sentences = splitSentences(text);
  const keywords = new Set(tokenize(text).slice(0, 30));
  const topics = topKeywords(text, 8);

  const ranked = sentences
    .map((s, i) => ({ s, score: scoreSentence(s, keywords, i, sentences.length) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((x) => x.s);

  const intro = sentences.slice(0, 2).join(" ");
  const uniquePoints = [...new Set([...ranked, intro])].slice(0, 4);

  const title = guessTitle(
    rawTranscript,
    fileName?.replace(/\.[^.]+$/, "") ?? "YouTube lecture",
  );

  const overview = `This lecture mainly covers: ${topics.join(", ")}.`;
  const keyPoints = uniquePoints
    .map((p) => `• ${p}`)
    .join("\n");
  const takeaways = topics
    .slice(0, 6)
    .map((t) => `• Remember how "${t}" connects to the overall argument.`)
    .join("\n");

  return {
    title,
    summary: [
      overview,
      "Key ideas discussed:\n" + keyPoints,
      "What to take away:\n" + takeaways,
    ].join("\n\n"),
    topics,
  };
}

export async function summarizeLecture(
  transcript: string,
  options: {
    fileName?: string;
    apiKey?: string;
    useAi?: boolean;
    forceEnglish?: boolean;
  },
): Promise<LectureSummaryResult> {
  const local = options.forceEnglish
    ? summarizeLectureEnglishLocal(transcript, options.fileName)
    : summarizeLectureLocal(transcript, options.fileName);

  if (!options.useAi || !options.apiKey?.trim()) {
    return local;
  }

  try {
    const ru = options.forceEnglish ? false : isCyrillicHeavy(transcript);
    const snippet = transcript.slice(0, 12000);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              options.forceEnglish || !ru
                ? "You help university students. Read the lecture transcript and write a DETAILED explanation in English: 4-6 short paragraphs covering the main theme, key concepts, how ideas connect, and what to remember for an exam. Then add a bullet list (5-8 items) of key takeaways inside summary using newlines. JSON only: {\"title\":\"\",\"summary\":\"\",\"topics\":[\"topic1\",...]}"
                : "Ты помощник студента. Подробно объясни по транскрипту (4-6 абзацев + список из 5-8 выводов в summary). JSON: {\"title\":\"\",\"summary\":\"\",\"topics\":[]}",
          },
          {
            role: "user",
            content: snippet,
          },
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
      title?: string;
      summary?: string;
      topics?: string[];
    };

    return {
      title: parsed.title?.trim() || local.title,
      summary: parsed.summary?.trim() || local.summary,
      topics: Array.isArray(parsed.topics) && parsed.topics.length
        ? parsed.topics.map(String)
        : local.topics,
    };
  } catch {
    return local;
  }
}
