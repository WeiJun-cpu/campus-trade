import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/product-grid";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MyFavoritesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: favorites } = await supabase
    .from("favorites")
    .select("product_id, product:products!favorites_product_id_fkey(id, title, price, images, condition, status, created_at)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const products = (favorites || [])
    .filter((f: any) => f.product)
    .map((f: any) => f.product) as Product[];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">我的收藏</h1>
      <ProductGrid products={products} emptyMessage="还没有收藏任何商品" />
    </div>
  );
}
