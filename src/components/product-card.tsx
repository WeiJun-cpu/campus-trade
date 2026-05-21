import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface Props {
  product: Pick<Product, "id" | "title" | "price" | "images" | "condition" | "status" | "created_at">;
}

export function ProductCard({ product }: Props) {
  const firstImage = product.images?.[0];

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group overflow-hidden border transition-shadow hover:shadow-md">
        <div className="relative aspect-square bg-muted">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {product.status === "sold" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Badge variant="secondary" className="text-lg font-bold">已售出</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <h3 className="truncate text-sm font-medium">{product.title}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-red-500">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDate(product.created_at)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
