"use client";

import { use } from "react";
import Link from "next/link";
import { useProfile } from "@/hooks/use-product";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/use-products";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { profile, loading } = useProfile(id);
  const { products } = useProducts({});

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 animate-fade-in">
        <div className="mb-10 flex flex-col items-center gap-5 text-center">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-xl" />
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-fade-in">
        <div className="mb-6 rounded-full bg-muted p-6">
          <svg className="h-10 w-10 text-muted-fg/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p className="text-muted-fg text-lg">用户不存在</p>
        <Button asChild className="mt-6 rounded-xl bg-primary hover:bg-primary/90 shadow-warm">
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    );
  }

  const userProducts = products.filter((p: any) => p.seller_id === id);
  const initials = profile.username?.slice(0, 2).toUpperCase() || "U";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 animate-fade-in-up">
      {/* Profile header */}
      <div className="mb-10 flex flex-col items-center gap-5 text-center">
        <Avatar className="h-24 w-24 ring-4 ring-primary/10 shadow-warm">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback
            className="text-3xl font-bold bg-primary text-primary-fg"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        <div>
          <h1
            className="text-2xl font-bold text-espresso"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            {profile.username || "未命名用户"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-fg">
            加入于 {new Date(profile.created_at).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Contact info badges */}
        {(profile.qq || profile.wechat) && (
          <div className="flex gap-2">
            {profile.qq && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-fg">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                QQ: {profile.qq}
              </span>
            )}
            {profile.wechat && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-fg">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                微信: {profile.wechat}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Products section */}
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="text-lg font-bold text-espresso"
          style={{ fontFamily: "var(--font-display), serif" }}
        >
          TA 在售的商品
        </h2>
        <span className="text-sm text-muted-fg">{userProducts.length} 件</span>
      </div>

      <ProductGrid
        products={userProducts}
        emptyMessage="该用户暂无在售商品"
      />
    </div>
  );
}
