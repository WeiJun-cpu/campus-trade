"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";

interface Props {
  categories: Category[];
  selected: string | null;
}

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
      <Button
        variant={selected === null ? "default" : "outline"}
        size="sm"
        onClick={() => handleSelect(null)}
      >
        全部
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={selected === cat.slug ? "default" : "outline"}
          size="sm"
          onClick={() => handleSelect(cat.slug)}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}
