export type GuideBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; variant?: "tip" | "key" | "quote"; title?: string; text: string }
  | { type: "terms"; items: { term: string; definition: string }[] }
  | { type: "heading"; level: 3 | 4; text: string };

export interface GuideSection {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  blocks: GuideBlock[];
}

export interface CulturalStudiesGuide {
  title: string;
  subtitle: string;
  description: string;
  sections: GuideSection[];
  quickReference: { scholar: string; field: string; contribution: string }[];
}
