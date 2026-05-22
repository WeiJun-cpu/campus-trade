import { ProductCard } from "./product-card";
import type { Product } from "@/lib/types";

interface Props {
  products: (Pick<
    Product,
    "id" | "title" | "price" | "images" | "condition" | "status" | "created_at"
  >)[];
  emptyMessage?: string;
}

export function ProductGrid({ products, emptyMessage = "暂无商品" }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 animate-fade-in">
        <div className="mb-6 rounded-full bg-muted p-6">
          <svg
            className="h-10 w-10 text-muted-fg/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="text-muted-fg text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
