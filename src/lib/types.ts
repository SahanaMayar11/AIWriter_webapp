export type HistoryItem = {
  id: string;
  topic: string;
  type: "Outline" | "Draft" | "Grammar Check" | "Style Improvement";
  language: string;
  date: string;
};

export type DraftHistory = {
  id: string;
  userId: string;
  topic: string;
  content: string;
  language: string;
  type: "Outline" | "Draft" | "Grammar Check" | "Style Improvement";
  createdAt: string;
  updatedAt: string;
};
