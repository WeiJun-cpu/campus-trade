"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in">
      <div className="mb-6 rounded-full bg-coral/10 p-6">
        <svg className="h-10 w-10 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1
        className="text-xl font-bold text-espresso mb-2"
        style={{ fontFamily: "var(--font-display), serif" }}
      >
        出了点问题
      </h1>
      <p className="text-sm text-muted-fg mb-6 text-center max-w-xs">
        页面加载时出现了错误，请尝试刷新
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} className="rounded-xl bg-primary hover:bg-primary/90 shadow-warm">
          重新加载
        </Button>
        <Button variant="outline" asChild className="rounded-xl border-border/60">
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </div>
  );
}
