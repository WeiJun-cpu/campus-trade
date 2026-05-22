"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const init = useUserStore((s) => s.init);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [qq, setQq] = useState("");
  const [wechat, setWechat] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      let currentUser = user;
      if (!currentUser) {
        currentUser = (await init()) ?? null;
      }
      if (!currentUser || cancelled) {
        setPageLoading(false);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (!cancelled) {
        if (data) {
          setProfile(data);
          setQq(data.qq || "");
          setWechat(data.wechat || "");
          setUsername(data.username || "");
        }
        setPageLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update({ qq: qq.trim(), wechat: wechat.trim(), username: username.trim() })
      .eq("id", currentUser!.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("资料已更新");
      router.refresh();
    }

    setLoading(false);
  };

  if (pageLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-28 rounded-xl" />
        <div className="h-40 rounded-2xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1
          className="text-xl font-bold text-espresso"
          style={{ fontFamily: "var(--font-display), serif" }}
        >
          编辑资料
        </h1>
        <p className="text-muted-fg text-sm">无法加载用户资料，请刷新后重试</p>
      </div>
    );
  }

  const initials = profile.username?.slice(0, 2).toUpperCase() || profile.id?.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1
        className="text-xl font-bold text-espresso"
        style={{ fontFamily: "var(--font-display), serif" }}
      >
        编辑资料
      </h1>

      {/* Avatar & basic info */}
      <div className="bg-surface rounded-2xl border border-border/60 p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback
              className="text-xl font-bold bg-primary text-primary-fg"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-fg font-mono">ID: {profile.id.slice(0, 8)}...</p>
            <p className="text-xs text-muted-fg">
              注册于 {new Date(profile.created_at).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        <Separator className="bg-border/60" />

        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-espresso">
            用户名
          </Label>
          <Input
            id="username"
            placeholder="设置一个昵称"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-xl border-border/60 h-11 bg-cream/50 focus:bg-surface transition-colors"
          />
        </div>
      </div>

      {/* Contact info */}
      <div className="bg-surface rounded-2xl border border-border/60 p-6 space-y-5 shadow-sm">
        <div>
          <h2 className="font-semibold text-espresso">联系方式</h2>
          <p className="text-sm text-muted-fg mt-1">
            填写后买家可以在商品详情页看到，方便快速联系
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qq" className="text-sm font-medium text-espresso">
              QQ号
            </Label>
            <Input
              id="qq"
              placeholder="填写你的QQ号"
              value={qq}
              onChange={(e) => setQq(e.target.value)}
              className="rounded-xl border-border/60 h-11 bg-cream/50 focus:bg-surface transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wechat" className="text-sm font-medium text-espresso">
              微信号
            </Label>
            <Input
              id="wechat"
              placeholder="填写你的微信号"
              value={wechat}
              onChange={(e) => setWechat(e.target.value)}
              className="rounded-xl border-border/60 h-11 bg-cream/50 focus:bg-surface transition-colors"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={loading}
        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-fg shadow-warm hover:shadow-lg transition-all duration-200 font-semibold px-8"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            保存中...
          </span>
        ) : (
          "保存修改"
        )}
      </Button>
    </div>
  );
}
