"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ManageProductButtons } from "@/components/manage-product-buttons";
import { formatPrice, formatDate, STATUS_LABELS } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

export default function MyProductsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from("products")
          .select("*, category:categories(*)")
          .eq("seller_id", data.user.id)
          .order("created_at", { ascending: false })
          .then(({ data }) => {
            setProducts(data || []);
            setLoading(false);
          });
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <Skeleton className="h-8 w-28 rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-border/60 bg-surface p-4">
              <Skeleton className="h-20 w-20 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3 rounded-lg" />
                <Skeleton className="h-4 w-1/4 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="space-y-5 animate-fade-in">
        <h1
          className="text-xl font-bold text-espresso"
          style={{ fontFamily: "var(--font-display), serif" }}
        >
          我的商品
        </h1>
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border/60 bg-surface/50">
          <div className="mb-5 rounded-full bg-muted p-5">
            <svg className="h-9 w-9 text-muted-fg/35" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-muted-fg mb-1">你还没有发布任何商品</p>
          <p className="text-xs text-muted-fg/60 mb-5">快把闲置好物分享出来吧</p>
          <Button asChild className="rounded-xl bg-primary hover:bg-primary/90 shadow-warm">
            <Link href="/publish">发布第一件商品</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1
          className="text-xl font-bold text-espresso"
          style={{ fontFamily: "var(--font-display), serif" }}
        >
          我的商品
        </h1>
        <Button
          size="sm"
          asChild
          className="rounded-xl bg-primary hover:bg-primary/90 text-primary-fg shadow-warm"
        >
          <Link href="/publish">
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            发布商品
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((product, i) => (
          <div
            key={product.id}
            className="flex gap-4 rounded-2xl border border-border/60 bg-surface p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <Link href={`/product/${product.id}`} className="shrink-0">
              {product.images?.[0] ? (
                <div className="h-20 w-20 rounded-xl overflow-hidden relative">
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-xl bg-muted flex items-center justify-center">
                  <svg className="h-8 w-8 text-muted-fg/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </Link>

            <div className="flex-1 min-w-0 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/product/${product.id}`}
                  className="font-semibold text-espresso hover:text-primary line-clamp-1 transition-colors"
                >
                  {product.title}
                </Link>
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <span
                    className="text-lg font-bold text-primary"
                    style={{ fontFamily: "var(--font-display), serif" }}
                  >
                    {formatPrice(product.price)}
                  </span>
                  <Badge
                    variant={product.status === "active" ? "default" : "secondary"}
                    className="rounded-full text-xs"
                  >
                    {STATUS_LABELS[product.status]}
                  </Badge>
                  {product.category && (
                    <Badge variant="outline" className="rounded-full text-xs">
                      {product.category.name}
                    </Badge>
                  )}
                </div>
                <p className="mt-1.5 text-xs text-muted-fg/70">
                  {formatDate(product.created_at)} 发布
                </p>
              </div>
              <ManageProductButtons productId={product.id} status={product.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
