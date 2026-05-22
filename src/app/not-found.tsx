import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-fade-in">
      <div className="mb-6 rounded-full bg-muted p-6">
        <svg className="h-10 w-10 text-muted-fg/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
      </div>
      <h1
        className="text-xl font-bold text-espresso mb-2"
        style={{ fontFamily: "var(--font-display), serif" }}
      >
        页面不存在
      </h1>
      <p className="text-sm text-muted-fg mb-6">你要找的页面可能已下架或被删除</p>
      <Button asChild className="rounded-xl bg-primary hover:bg-primary/90 shadow-warm">
        <Link href="/">返回首页</Link>
      </Button>
    </div>
  );
}
