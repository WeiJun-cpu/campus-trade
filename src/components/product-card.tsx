"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatPrice, formatDate, CONDITION_LABELS } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface Props {
  product: Pick<
    Product,
    "id" | "title" | "price" | "images" | "condition" | "status" | "created_at"
  >;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Props) {
  const firstImage = product.images?.[0];
  const [loaded, setLoaded] = useState(false);

  return (
    <Link href={`/product/${product.id}`}>
      <article
        className={`group relative rounded-2xl bg-surface overflow-hidden border border-border/50 transition-all duration-300 hover:shadow-warm hover:-translate-y-1 hover:border-primary/20 animate-fade-in-up`}
        style={{ animationDelay: `${index * 0.06}s` }}
      >
        {/* Image */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          {firstImage ? (
            <>
              {!loaded && (
                <div className="absolute inset-0 bg-secondary animate-pulse z-10" />
              )}
              <Image
                src={firstImage}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setLoaded(true)}
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <svg
                className="h-14 w-14 text-muted-fg/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Condition badge */}
          <span className="absolute top-2 left-2 rounded-full bg-surface/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-espresso shadow-sm">
            {CONDITION_LABELS[product.condition]}
          </span>

          {/* Sold overlay */}
          {product.status === "sold" && (
            <div className="absolute inset-0 flex items-center justify-center bg-espresso/40 backdrop-blur-[2px]">
              <span className="rounded-full bg-surface px-4 py-1.5 text-sm font-bold text-muted-fg">
                已售出
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5 space-y-1.5">
          <h3 className="text-sm font-semibold text-espresso leading-snug line-clamp-2">
            {product.title}
          </h3>

          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-primary">
              ¥{formatPrice(product.price).replace("¥", "")}
            </span>
          </div>

          <p className="text-xs text-muted-fg">
            {formatDate(product.created_at)}
          </p>
        </div>
      </article>
    </Link>
  );
}
