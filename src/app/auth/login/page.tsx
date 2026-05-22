"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("欢迎回来");
    const redirect = searchParams.get("redirect") || "/";
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 animate-fade-in">
      <div className="w-full max-w-sm">
        {/* Logo + Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-fg shadow-warm animate-float"
            style={{ fontFamily: "var(--font-display), serif" }}>
            <span className="text-2xl font-bold">校</span>
          </div>
          <h1 className="mt-5 text-2xl font-bold text-espresso"
            style={{ fontFamily: "var(--font-display), serif" }}>
            欢迎回来
          </h1>
          <p className="mt-1.5 text-sm text-muted-fg">
            登录你的校园二手账号，继续探索好物
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="bg-surface rounded-2xl border border-border/60 p-6 space-y-5 shadow-md"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-espresso">
              邮箱
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@qq.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border-border/60 h-11 bg-cream/50 focus:bg-surface transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-espresso">
              密码
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl border-border/60 h-11 bg-cream/50 focus:bg-surface transition-colors"
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 text-primary-fg shadow-warm hover:shadow-lg transition-all duration-200 font-semibold"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                登录中...
              </span>
            ) : (
              "登录"
            )}
          </Button>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-muted-fg">
          还没有账号？{" "}
          <Link
            href="/auth/register"
            className="text-primary font-semibold hover:underline underline-offset-2 transition-all"
          >
            立即注册
          </Link>
        </p>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-muted-fg/60 hover:text-muted-fg transition-colors"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
