"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProductGrid } from "@/components/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@supabase/supabase-js";

export default function MyFavoritesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from("favorites")
          .select(
            "product_id, product:products!favorites_product_id_fkey(id, title, price, images, condition, status, created_at)"
          )
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
          .then(({ data: favs }) => {
            const items = (favs || [])
              .filter((f: any) => f.product)
              .map((f: any) => f.product);
            setProducts(items);
            setLoading(false);
          });
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-7 w-24" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">我的收藏</h1>
      <ProductGrid products={products} emptyMessage="还没有收藏任何商品" />
    </div>
  );
}
