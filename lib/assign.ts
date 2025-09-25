export type WordPair = {
  id: number;
  category: string;
  a: string;
  b: string;
  difficulty?: 1 | 2 | 3;
  enabled?: boolean;
};
export type Assignment = {
  seat: number;
  role: "CIV" | "SPY";
  word: string;
};
export type RoundContext = {
  playerCount: number;
  pair: WordPair;
  spySeat: number;
  flip: boolean;
  assignments: Assignment[];
  currentSeat: number;
};

export function pickRandom<T>(arr: T[]): T {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}

export function assignWords(n: number, pair: WordPair) {
  const spySeat = 1 + Math.floor(Math.random() * n);
  const flip = Math.random() < 0.5;
  const spyWord = flip ? pair.a : pair.b;
  const civWord = flip ? pair.b : pair.a;
  const assignments: Assignment[] = [];
  for (let seat = 1; seat <= n; seat++) {
    const role = seat === spySeat ? "SPY" : "CIV";
    assignments.push({ seat, role, word: role === "SPY" ? spyWord : civWord });
  }
  return { spySeat, flip, assignments };
}
