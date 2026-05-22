"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/types";

interface Props {
  categories: Category[];
  selected: string | null;
}

const CAT_ICONS: Record<string, string> = {
  digital: "💻",
  books: "📚",
  daily: "🏠",
  fashion: "👗",
  sports: "⚽",
  other: "📦",
};

export function CategoryFilter({ categories, selected }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleSelect(null)}
        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
          selected === null
            ? "bg-primary text-primary-fg shadow-md shadow-primary/20"
            : "bg-surface border border-border hover:border-primary/30 hover:bg-secondary text-muted-fg hover:text-espresso"
        }`}
      >
        🔥 全部
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelect(cat.slug)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            selected === cat.slug
              ? "bg-primary text-primary-fg shadow-md shadow-primary/20"
              : "bg-surface border border-border hover:border-primary/30 hover:bg-secondary text-muted-fg hover:text-espresso"
          }`}
        >
          {CAT_ICONS[cat.slug] || "📌"} {cat.name}
        </button>
      ))}
    </div>
  );
}
