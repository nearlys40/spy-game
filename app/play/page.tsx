"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  assignWords,
  pickRandom,
  type Assignment,
  type WordPair,
} from "@/lib/assign";
import { loadWordPack } from "@/lib/words";
import clsx from "clsx";

export default function PlayPage() {
  return (
    <Suspense fallback={<FullScreenFallback text="กำลังเตรียมคำ…" />}>
      <PlayInner />
    </Suspense>
  );
}

function PlayInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const n = Math.max(3, Math.min(12, Number(sp.get("n") || 6)));

  const [pairs, setPairs] = useState<WordPair[] | null>(null);
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [current, setCurrent] = useState<number>(1);
  const [censored, setCensored] = useState<boolean>(true);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedCategory");
    if (!saved) {
      router.replace(`/categories?n=${n}`);
      return;
    }
    setSelectedCat(saved);
  }, [n, router]);

  useEffect(() => {
    loadWordPack().then(({ pairs }) => setPairs(pairs));
  }, []);

  useEffect(() => {
    if (!pairs || !selectedCat) return;
    const filtered = pairs.filter((p) => p.category === selectedCat);
    if (filtered.length === 0) {
      router.replace(`/categories?n=${n}`);
      return;
    }
    const pair = pickRandom(filtered);
    const { assignments } = assignWords(n, pair);
    setAssignments(assignments);
    setCurrent(1);
    setCensored(true);
  }, [pairs, selectedCat, n, router]);

  const isLast = current === n;
  const currentAssign = useMemo(
    () => assignments?.find((a) => a.seat === current),
    [assignments, current]
  );

  function toggleEye() {
    setCensored((v) => !v);
  }
  function next() {
    if (isLast) {
      router.replace("/");
      return;
    }
    setCurrent((x) => Math.min(n, x + 1));
    setCensored(true);
  }

  if (!assignments) return <FullScreenFallback text="กำลังเตรียมคำ…" />;

  const progress = Math.max(0, Math.min(100, Math.round((current / n) * 100)));

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[#e9f0ff] to-[#f7f9ff]">
      <div className="mx-auto max-w-sm h-[100dvh] flex flex-col px-4 sm:px-6 pt-[max(16px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))]">
        <section className="flex-1 flex flex-col rounded-3xl shadow-lg bg-white px-5 py-6 sm:px-6 sm:py-7">
          {/* Header */}
          <div className="text-center">
            <div aria-hidden className="text-3xl sm:text-4xl leading-none mb-2">
              {emojiForCategory(selectedCat ?? "")}
            </div>
            <h1 className="text-[20px] sm:text-[22px] font-extrabold text-slate-900">
              ผู้เล่น {current} จาก {n}
            </h1>
            <div className="mt-3 mb-1">
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-2 bg-slate-900 rounded-full transition-[width]"
                  style={{ width: `${progress}%` }}
                  aria-hidden
                />
              </div>
            </div>
            <p className="text-slate-600">
              หมวด:{" "}
              <span className="text-blue-700 font-semibold">
                {selectedCat ?? "—"}
              </span>
            </p>
          </div>

          {/* Center: word box */}
          <div className="flex-1 flex items-center">
            <div className="w-full">
              <div className="rounded-2xl border border-yellow-200 bg-[#fff7cc] px-4 py-5 text-center">
                <div className="text-[30px] sm:text-[34px] font-extrabold tracking-wide">
                  {censored ? (
                    <span
                      aria-live="off"
                      className="text-slate-400 select-none"
                    >
                      ••••••
                    </span>
                  ) : (
                    <span aria-live="polite" className="text-black">
                      {currentAssign?.word ?? "—"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom buttons */}
          <div>
            <button
              onClick={toggleEye}
              className={clsx(
                "w-full rounded-2xl px-5 py-4 text-lg font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-4 transition",
                censored
                  ? "bg-slate-900 text-white hover:brightness-105"
                  : "bg-[#c62828] text-white hover:brightness-105"
              )}
              data-testid="btn-eye-toggle"
              aria-label={censored ? "เผยคำ" : "ซ่อนคำ"}
            >
              {censored ? "เผยคำ" : "ซ่อนคำ"}
            </button>

            <button
              onClick={next}
              className={clsx(
                "mt-3 w-full rounded-2xl px-5 py-4 text-lg font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-4 transition",
                isLast
                  ? "bg-gradient-to-b from-[#28bc54] to-[#16a910]"
                  : "bg-gradient-to-b from-[#2d6bff] to-[#1750e6]"
              )}
              data-testid={isLast ? "btn-finish" : "btn-next"}
              aria-label={isLast ? "จบเกม" : "ผู้เล่นถัดไป"}
            >
              {isLast ? "🎉 เสร็จสิ้น" : "ถัดไป →"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function emojiForCategory(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("อาหาร")) return "🍜";
  if (n.includes("เครื่องดื่ม")) return "🥤";
  if (n.includes("สัตว์")) return "🐶";
  if (n.includes("เดินทาง") || n.includes("ท่องเที่ยว")) return "✈️";
  if (n.includes("ในบ้าน") || n.includes("ครัวเรือน")) return "🏠";
  if (n.includes("บันเทิง") || n.includes("ภาพยนตร์") || n.includes("เพลง"))
    return "🎬";
  if (n.includes("สถานที่")) return "📍";
  if (n.includes("สุขภาพ")) return "❤️";
  if (n.includes("ชีวิตประจำวัน") || n.includes("วัฒนธรรม")) return "🎎";
  return "🧩";
}

function FullScreenFallback({ text }: { text: string }) {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-6">
      {text}
    </main>
  );
}
