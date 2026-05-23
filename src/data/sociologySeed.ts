import midtermData from "./midterm.json";
import endtermData from "./endterm.json";
import type { Subject, Term } from "../types";
import { DEFAULT_EXAM_COUNT, SOCIOLOGY_SUBJECT_ID } from "../types";

type RawTerm = {
  id: string;
  deck: string;
  number: number;
  term: string;
  definition: string;
  example: string;
};

function mapDeck(items: RawTerm[], deckId: string): Term[] {
  return items.map((t) => ({
    id: `${deckId}-${t.number}`,
    deckId,
    number: t.number,
    term: t.term,
    definition: t.definition,
    example: t.example,
  }));
}

export const sociologySubject: Subject = {
  id: SOCIOLOGY_SUBJECT_ID,
  name: "Sociology",
  builtin: true,
  examQuestionCount: DEFAULT_EXAM_COUNT,
  decks: [
    {
      id: "midterm",
      name: "Midterm",
      terms: mapDeck(midtermData as RawTerm[], "midterm"),
    },
    {
      id: "endterm",
      name: "Endterm",
      terms: mapDeck(endtermData as RawTerm[], "endterm"),
    },
  ],
};
