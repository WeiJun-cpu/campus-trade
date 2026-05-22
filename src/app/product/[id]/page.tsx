"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FavoriteButton } from "@/components/favorite-button";
import { useProduct } from "@/hooks/use-product";
import { formatPrice, formatDate, CONDITION_LABELS } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { product, loading } = useProduct(id);
  const [user, setUser] = useState<User | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from("favorites")
          .select("id")
          .eq("user_id", data.user.id)
          .eq("product_id", id)
          .maybeSingle()
          .then(({ data: fav }) => setIsFavorited(!!fav));
      }
    });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 animate-fade-in">
        <Skeleton className="mb-8 h-80 w-full rounded-2xl" />
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-9 w-2/3 rounded-xl" />
            <Skeleton className="h-11 w-40 rounded-xl" />
            <Skeleton className="h-5 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4 rounded-lg" />
          </div>
          <Skeleton className="h-56 w-full lg:w-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-fade-in">
        <div className="mb-6 rounded-full bg-muted p-6">
          <svg className="h-10 w-10 text-muted-fg/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-muted-fg text-lg">商品不存在或已下架</p>
        <Button asChild className="mt-6 rounded-xl bg-primary hover:bg-primary/90 shadow-warm">
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    );
  }

  const images = (product as any).images || [];
  const seller = (product as any).seller;
  const category = (product as any).category;
  const hasDiscount = product.original_price && product.original_price > product.price;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Image section */}
        <div className="lg:w-[55%] animate-fade-in-up">
          {images.length > 0 ? (
            <div className="relative overflow-hidden rounded-2xl bg-muted shadow-md">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-secondary animate-pulse rounded-2xl" />
              )}
              <img
                src={images[0]}
                alt={product.title}
                className={`w-full max-h-96 object-contain transition-all duration-700 ${
                  imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              {/* Gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-espresso/10 to-transparent pointer-events-none" />

              {/* Condition badge */}
              <span className="absolute top-3 left-3 rounded-full bg-surface/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-espresso shadow-sm">
                {CONDITION_LABELS[product.condition]}
              </span>

              {/* Sold overlay */}
              {product.status !== "active" && (
                <div className="absolute inset-0 flex items-center justify-center bg-espresso/50 backdrop-blur-[2px]">
                  <span className="rounded-full bg-surface px-5 py-2 text-sm font-bold text-muted-fg shadow-lg">
                    {product.status === "sold" ? "已售出" : "已预订"}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center rounded-2xl bg-muted shadow-sm">
              <svg className="h-20 w-20 text-muted-fg/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img: string, i: number) => (
                <div
                  key={i}
                  className="shrink-0 h-16 w-16 rounded-xl border border-border/60 overflow-hidden bg-muted cursor-pointer hover:border-primary/40 transition-colors"
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="lg:w-[45%] space-y-5 animate-fade-in-up stagger-2">
          {/* Title & category */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {category && (
                <Badge className="rounded-full bg-secondary text-secondary-fg hover:bg-secondary/80">
                  {category.name}
                </Badge>
              )}
              {product.status !== "active" && (
                <Badge variant="destructive" className="rounded-full">
                  {product.status === "sold" ? "已售出" : "已预订"}
                </Badge>
              )}
            </div>
            <h1
              className="text-2xl lg:text-3xl font-bold text-espresso leading-snug"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              {product.title}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span
              className="text-3xl lg:text-4xl font-bold text-primary"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              ¥{formatPrice(product.price).replace("¥", "")}
            </span>
            {hasDiscount && (
              <span className="text-lg text-muted-fg line-through">
                ¥{formatPrice(product.original_price!).replace("¥", "")}
              </span>
            )}
            {hasDiscount && (
              <span className="rounded-full bg-coral/10 text-coral text-xs font-bold px-2 py-0.5">
                {Math.round((1 - product.price / product.original_price!) * 100)}% OFF
              </span>
            )}
          </div>

          <Separator className="bg-border/60" />

          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold text-espresso mb-2">商品描述</h2>
            <p className="text-sm text-muted-fg leading-relaxed whitespace-pre-wrap">
              {product.description || "卖家没有留下任何描述。"}
            </p>
          </div>

          <p className="text-xs text-muted-fg/70">
            发布于 {formatDate(product.created_at)}
          </p>

          {/* Seller card */}
          <div className="rounded-2xl bg-surface border border-border/60 p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${seller?.id}`}>
                <Avatar className="h-12 w-12 ring-2 ring-primary/15 hover:ring-primary/30 transition-all">
                  <AvatarFallback className="bg-primary text-primary-fg font-semibold">
                    {seller?.username?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link
                  href={`/profile/${seller?.id}`}
                  className="font-semibold text-espresso hover:text-primary transition-colors"
                >
                  {seller?.username || "未知用户"}
                </Link>
                <div className="flex items-center gap-3 mt-0.5">
                  {seller?.qq && (
                    <span className="text-xs text-muted-fg">QQ: {seller.qq}</span>
                  )}
                  {seller?.wechat && (
                    <span className="text-xs text-muted-fg">微信: {seller.wechat}</span>
                  )}
                </div>
              </div>
            </div>

            <Separator className="bg-border/60" />

            {user ? (
              <FavoriteButton
                productId={id}
                initialFavorited={isFavorited}
              />
            ) : (
              <Button
                variant="outline"
                className="w-full rounded-full border-primary/30 text-primary hover:bg-primary/5"
                asChild
              >
                <Link href="/auth/login">登录后可收藏</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
