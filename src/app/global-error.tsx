"use client";

import { useEffect } from "react";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html
      lang="zh-CN"
      className={`${dmSans.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center text-center px-4 animate-fade-in">
          <div className="mb-6 rounded-full bg-coral/10 p-6">
            <svg className="h-12 w-12 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold text-espresso mb-2"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            校园二手 · 出了点问题
          </h1>
          <p className="text-sm text-muted-fg mb-6 max-w-xs">
            应用遇到了严重错误，请尝试刷新页面
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-xl h-11 px-6 bg-primary text-primary-fg font-semibold shadow-warm hover:bg-primary/90 transition-all"
          >
            重新加载
          </button>
        </div>
      </body>
    </html>
  );
}
