"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [preferred, setPreferred] = useState<number>(6);

  useEffect(() => {
    const v = localStorage.getItem("preferredPlayerCount");
    if (v) setPreferred(Number(v));
  }, []);

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[#e9f0ff] to-[#f7f9ff]">
      <div className="mx-auto max-w-sm h-[100dvh] flex flex-col px-4 sm:px-6 pt-[max(16px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))]">
        {/* Card หลักเต็มสูง */}
        <section className="flex-1 flex flex-col rounded-3xl shadow-lg bg-white px-5 py-6 sm:px-6 sm:py-7">
          {/* เนื้อหากลาง */}
          <div className="flex-1 flex flex-col items-center text-center justify-center">
            <h1 className="text-[24px] sm:text-[26px] font-extrabold text-slate-900">
              เกมสายลับ (Spy Game)
            </h1>
            <p className="mt-2 text-slate-600 text-base">
              เกมทายคำสุดสนุก สำหรับเพื่อนและครอบครัว
            </p>

            {/* วิธีเล่น */}
            <div className="w-full mt-6 rounded-2xl bg-[#f1f6ff] p-4 sm:p-5 border border-[#e3ecff] text-left">
              <h2 className="text-[18px] font-bold text-[#1f3b8a] mb-3">
                วิธีเล่น
              </h2>
              <ul className="space-y-3">
                <HowItem index={1} text="ส่งโทรศัพท์ให้ผู้เล่นทีละคน" />
                <HowItem index={2} text="แต่ละคนเปิดดู ‘คำลับ’ ของตนเอง" />
                <HowItem
                  index={3}
                  text="ใบ้คำโดยไม่พูดคำต้องห้าม แล้วจับสายลับ!"
                />
              </ul>
            </div>
          </div>

          {/* ปุ่มล่างชิดขอบ */}
          <Link
            href={`/set-players?pref=${preferred}`}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-lg font-semibold text-white
                       shadow-md transition focus-visible:outline-none focus-visible:ring-4
                       bg-gradient-to-b from-[#2d6bff] to-[#1750e6] hover:brightness-[1.05]"
            data-testid="btn-start"
            aria-label="เริ่มเกม"
          >
            เริ่มเกม
          </Link>
        </section>
      </div>
    </main>
  );
}

function HowItem({ index, text }: { index: number; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white
                   border border-[#d7e4ff] text-[#2b56c6] font-bold"
      >
        {index}
      </span>
      <p className="text-slate-700 leading-relaxed">{text}</p>
    </li>
  );
}
