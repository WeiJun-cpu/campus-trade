"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProductGrid } from "@/components/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/stores/user-store";

export default function MyFavoritesPage() {
  const user = useUserStore((s) => s.user);
  const init = useUserStore((s) => s.init);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      let currentUser = user;
      if (!currentUser) {
        currentUser = (await init()) ?? null;
      }
      if (!currentUser || cancelled) return;

      const supabase = createClient();
      const { data: favs } = await supabase
        .from("favorites")
        .select(
          "product_id, product:products!favorites_product_id_fkey(id, title, price, images, condition, status, created_at)"
        )
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        const items = (favs || [])
          .filter((f: any) => f.product)
          .map((f: any) => f.product);
        setProducts(items);
        setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-5 animate-fade-in">
        <Skeleton className="h-8 w-28 rounded-xl" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in-up">
      <h1
        className="text-xl font-bold text-espresso"
        style={{ fontFamily: "var(--font-display), serif" }}
      >
        我的收藏
      </h1>
      <ProductGrid products={products} emptyMessage="还没有收藏任何商品" />
    </div>
  );
}
