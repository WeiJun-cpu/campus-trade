"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product } from "@/lib/types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .order("id")
      .then(({ data }) => {
        setCategories(data || []);
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}

export function useProducts(params: {
  q?: string;
  category?: string;
  sort?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetch = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("products")
      .select("id, title, price, images, condition, status, created_at")
      .eq("status", "active");

    if (params.q) {
      query = query.ilike("title", `%${params.q}%`);
    }

    if (params.category) {
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", params.category)
        .single();
      if (catData) {
        query = query.eq("category_id", catData.id);
      }
    }

    switch (params.sort) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    const { data } = await query.limit(50);
    setProducts((data as Product[]) || []);
    setLoading(false);
  }, [params.q, params.category, params.sort]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { products, loading, refetch: fetch };
}
