import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/product-grid";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  const { q, category, sort } = params;

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  let query = supabase
    .from("products")
    .select("id, title, price, images, condition, status, created_at")
    .eq("status", "active");

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  if (category) {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", category)
      .single();
    if (catData) {
      query = query.eq("category_id", catData.id);
    }
  }

  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query.limit(50);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">发现好物</h1>
        <Suspense fallback={<Skeleton className="h-10 w-full max-w-md" />}>
          <SearchBar />
        </Suspense>
      </div>

      {categories && (
        <div className="mb-6">
          <Suspense fallback={<Skeleton className="h-9 w-64" />}>
            <CategoryFilter categories={categories} selected={category || null} />
          </Suspense>
        </div>
      )}

      <ProductGrid products={(products as Product[]) || []} />
    </div>
  );
}
