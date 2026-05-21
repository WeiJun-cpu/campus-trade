"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Profile } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [qq, setQq] = useState("");
  const [wechat, setWechat] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setQq(data.qq || "");
        setWechat(data.wechat || "");
        setUsername(data.username || "");
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update({ qq: qq.trim(), wechat: wechat.trim(), username: username.trim() })
      .eq("id", user!.id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("资料已更新");
      router.refresh();
    }

    setLoading(false);
  };

  if (!profile) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">编辑资料</h1>
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">编辑资料</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-xl">
                {profile.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">{profile.id}</p>
              <p className="text-xs text-muted-foreground">
                注册时间：{new Date(profile.created_at).toLocaleDateString("zh-CN")}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">联系方式</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            填写联系方式后，买家可以在商品详情页看到，方便与你沟通。
          </p>
          <div className="space-y-2">
            <Label htmlFor="qq">QQ号</Label>
            <Input
              id="qq"
              placeholder="填写你的QQ号"
              value={qq}
              onChange={(e) => setQq(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wechat">微信号</Label>
            <Input
              id="wechat"
              placeholder="填写你的微信号"
              value={wechat}
              onChange={(e) => setWechat(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? "保存中..." : "保存修改"}
      </Button>
    </div>
  );
}
