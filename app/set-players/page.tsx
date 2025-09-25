"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MIN = 3;
const MAX = 10;
const QUICK = [3, 4, 5, 6, 7, 8, 9, 10];

export default function SetPlayersPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const pref = Number(sp.get("pref") || 6);

  const [n, setN] = useState<number>(pref);
  const valid = n >= MIN && n <= MAX;

  useEffect(() => {
    if (Number.isNaN(n)) setN(6);
  }, [n]);

  function begin() {
    if (!valid) return;
    localStorage.setItem("preferredPlayerCount", String(n));
    router.push(`/categories?n=${n}`);
  }

  function pick(v: number) {
    setN(Math.max(MIN, Math.min(MAX, v)));
  }

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[#e9f0ff] to-[#f7f9ff]">
      <div className="mx-auto max-w-sm h-[100dvh] flex flex-col px-4 sm:px-6 pt-[max(16px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))]">
        <section className="flex-1 flex flex-col rounded-3xl shadow-lg bg-white px-5 py-6 sm:px-6 sm:py-7">
          {/* ส่วนเนื้อหา */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div aria-hidden className="text-4xl sm:text-5xl leading-none mb-3">
              👥
            </div>
            <h1 className="text-[22px] sm:text-[24px] font-extrabold text-slate-900">
              จำนวนผู้เล่น
            </h1>
            <p className="mt-1 text-slate-600">
              เลือกได้ระหว่าง {MIN} ถึง {MAX} คน
            </p>

            <div className="w-full mt-6 text-left">
              <div
                className="w-full text-center text-black rounded-2xl border border-slate-200 bg-slate-50 py-3 text-2xl font-bold tracking-wide select-none"
                aria-live="polite"
              >
                {Number.isNaN(n) ? "—" : n}
              </div>
            </div>

            <div className="w-full mt-12">
              <div className="text-slate-500 text-sm mb-2">เลือกแบบเร็ว:</div>
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
              >
                {QUICK.map((v) => {
                  const active = n === v;
                  return (
                    <button
                      key={v}
                      onClick={() => pick(v)}
                      className={[
                        "rounded-xl px-4 py-3 text-lg font-semibold border transition select-none",
                        active
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50",
                      ].join(" ")}
                      aria-pressed={active}
                      aria-label={`เลือก ${v} คน`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {!valid && (
              <div className="w-full mt-3 text-red-600 text-center">
                กรุณาเลือกจำนวนระหว่าง {MIN}–{MAX}
              </div>
            )}
          </div>

          {/* ปุ่มล่าง */}
          <button
            onClick={begin}
            disabled={!valid}
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl px-5 py-4 text-lg font-semibold text-white
                       shadow-md transition focus-visible:outline-none focus-visible:ring-4
                       bg-gradient-to-b from-[#28bc54] to-[#16a910] hover:brightness-[1.05]
                       disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="btn-begin-assign"
            aria-label="ถัดไป: เลือกหมวดหมู่"
          >
            ถัดไป
          </button>
        </section>
      </div>
    </main>
  );
}
