"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setRegistered(true);
    setLoading(false);
  };

  if (registered) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4 animate-scale-in">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 w-18 h-18 rounded-2xl bg-primary/10 flex items-center justify-center">
            <svg className="w-9 h-9 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold text-espresso"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            验证邮件已发送
          </h1>
          <p className="mt-3 text-sm text-muted-fg leading-relaxed">
            一封验证邮件已发送至{" "}
            <strong className="text-espresso font-semibold">{email}</strong>
            <br />
            请点击邮件中的链接完成注册验证
          </p>
          <Button asChild variant="outline" className="mt-8 rounded-xl border-primary/30 text-primary hover:bg-primary/5">
            <Link href="/auth/login">返回登录</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 animate-fade-in">
      <div className="w-full max-w-sm">
        {/* Logo + Header */}
        <div className="mb-8 text-center">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-fg shadow-warm animate-float"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            <span className="text-2xl font-bold">校</span>
          </div>
          <h1
            className="mt-5 text-2xl font-bold text-espresso"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            加入校园二手
          </h1>
          <p className="mt-1.5 text-sm text-muted-fg">
            创建你的专属账号，开始买卖闲置好物
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleRegister}
          className="bg-surface rounded-2xl border border-border/60 p-6 space-y-5 shadow-md"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-espresso">
              QQ邮箱
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
              placeholder="至少6位密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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
                注册中...
              </span>
            ) : (
              "注册"
            )}
          </Button>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-muted-fg">
          已有账号？{" "}
          <Link
            href="/auth/login"
            className="text-primary font-semibold hover:underline underline-offset-2 transition-all"
          >
            立即登录
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
