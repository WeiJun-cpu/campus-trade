"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <Input
      placeholder="搜索你想要的商品..."
      defaultValue={searchParams.get("q") || ""}
      onChange={(e) => {
        // 防抖：800ms 后搜索
        const timeout = (e.target as HTMLInputElement & { _timer?: ReturnType<typeof setTimeout> })._timer;
        if (timeout) clearTimeout(timeout);
        (e.target as HTMLInputElement & { _timer?: ReturnType<typeof setTimeout> })._timer = setTimeout(() => {
          handleSearch(e.target.value);
        }, 800);
      }}
      className="max-w-md"
    />
  );
}
