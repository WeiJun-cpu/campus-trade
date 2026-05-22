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
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <p className="text-muted-foreground">用户不存在</p>
        <Button asChild className="mt-4">
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="text-2xl">
            {profile.username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-bold">{profile.username}</h1>
          <p className="text-sm text-muted-foreground">
            加入于 {new Date(profile.created_at).toLocaleDateString("zh-CN")}
          </p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-bold">TA 在售的商品</h2>
      <ProductGrid
        products={products.filter((p) => p.seller_id === id)}
        emptyMessage="该用户暂无在售商品"
      />
    </div>
  );
}
