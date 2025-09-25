"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadWordPack } from "@/lib/words";
import type { WordPair } from "@/lib/assign";

export default function CategoriesPage() {
  return (
    <Suspense fallback={<FullScreenFallback text="กำลังโหลดหมวดหมู่…" />}>
      <CategoriesInner />
    </Suspense>
  );
}

type CatInfo = { name: string; count: number };

function CategoriesInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const n = Math.max(3, Math.min(12, Number(sp.get("n") || 6)));

  const [pairs, setPairs] = useState<WordPair[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWordPack().then(({ pairs }) => {
      setPairs(pairs);
      setLoading(false);
    });
  }, []);

  const categories: CatInfo[] = useMemo(() => {
    if (!pairs) return [];
    const map = new Map<string, number>();
    for (const p of pairs) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, "th"));
  }, [pairs]);

  function chooseCategory(name: string) {
    localStorage.setItem("selectedCategory", name);
    router.push(`/play?n=${n}`);
  }

  if (loading) {
    return <FullScreenFallback text="กำลังโหลดหมวดหมู่…" />;
  }

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[#e9f0ff] to-[#f7f9ff]">
      <div className="mx-auto max-w-sm h-[100dvh] flex flex-col px-4 sm:px-6 pt-[max(16px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))]">
        <section className="flex-1 flex flex-col rounded-3xl shadow-lg bg-white px-5 py-6 sm:px-6 sm:py-7">
          <div className="text-center">
            <h1 className="text-[22px] sm:text-[24px] font-extrabold text-slate-900">
              เลือกหมวดหมู่
            </h1>
            <p className="mt-1 text-slate-600">
              แตะเลือก 1 หมวด เพื่อเริ่มสุ่มคำทันที
            </p>
          </div>

          {/* กริดการ์ด: แตะแล้วไปต่อทันที */}
          <div
            className="mt-6 grid gap-3"
            style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
          >
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => chooseCategory(c.name)}
                className="rounded-2xl border border-slate-200 bg-white hover:bg-gradient-to-b hover:from-[#28bc54] hover:to-[#16a910] px-4 py-4 shadow-sm hover:shadow-md transition
                           focus-visible:outline-none focus-visible:ring-4 text-center"
                aria-label={`เลือกหมวด ${c.name}`}
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900 hover:text-white">
                      {c.name}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-slate-500 text-sm mt-6">
            เคล็ดลับ: เลือกหมวดที่คุ้นเคย จะใบ้ง่ายและสนุกขึ้น
          </p>
        </section>
      </div>
    </main>
  );
}

function FullScreenFallback({ text }: { text: string }) {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-6">
      {text}
    </main>
  );
}
