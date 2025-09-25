import { z } from "zod";
import type { WordPair } from "./assign";

const WordPairSchema = z.object({
  id: z.number(),
  category: z.string(),
  a: z.string(),
  b: z.string(),
  difficulty: z.number().int().min(1).max(3).optional(),
  enabled: z.boolean().optional(),
});

const WordPackSchema = z.object({
  lang: z.literal("th"),
  version: z.number(),
  pairs: z.array(WordPairSchema),
});

export async function loadWordPack(): Promise<{ pairs: WordPair[] }> {
  try {
    const res = await fetch("/wordpairs.th.json", { cache: "force-cache" });
    const data = await res.json();
    const parsed = WordPackSchema.parse(data);
    const pairs = parsed.pairs
      .filter((p) => p.enabled !== false)
      .map((p) => ({
        ...p,
        difficulty: p.difficulty as 1 | 2 | 3 | undefined,
      }));
    if (pairs.length === 0) throw new Error("No enabled pairs");
    return { pairs };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Fallback minimal
    return {
      pairs: [
        { id: 1, category: "สำรอง", a: "ข้าวมันไก่", b: "ข้าวขาหมู" },
        { id: 2, category: "สำรอง", a: "วัด", b: "โบสถ์" },
        { id: 3, category: "สำรอง", a: "กาแฟดำ", b: "กาแฟใส่นม" },
      ],
    };
  }
}
