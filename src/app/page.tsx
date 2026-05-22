"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product-grid";
import { SearchBar } from "@/components/search-bar";
import { CategoryFilter } from "@/components/category-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, useCategories } from "@/hooks/use-products";

function HomeContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "latest";

  const { categories } = useCategories();
  const { products, loading } = useProducts({ q, category, sort });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero */}
      <div className="mb-10 text-center animate-fade-in">
        <h1
          className="text-4xl font-bold tracking-tight text-espresso mb-2"
          style={{ fontFamily: "var(--font-display), serif" }}
        >
          发现校园好物
        </h1>
        <p className="text-muted-fg text-sm max-w-md mx-auto">
          课本、数码、生活用品——让你的闲置在校园里流动起来
        </p>
        <div className="mt-6 flex justify-center">
          <SearchBar />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-8 flex justify-center">
          <CategoryFilter categories={categories} selected={category || null} />
        </div>
      )}

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-5 w-1/2 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-10 text-center">
            <Skeleton className="h-10 w-48 mx-auto rounded-lg" />
            <Skeleton className="h-4 w-64 mx-auto mt-2 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-5 w-1/2 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
