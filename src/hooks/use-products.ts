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
  page?: number;
  pageSize?: number;
  sellerId?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const supabase = createClient();

  const page = params.page || 1;
  const pageSize = params.pageSize || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const fetch = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("products")
      .select("id, title, price, images, condition, status, created_at", { count: "exact" })
      .eq("status", "active");

    if (params.sellerId) {
      query = query.eq("seller_id", params.sellerId);
    }

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

    query = query.range(from, to);

    const { data, count } = await query;
    setProducts((data as Product[]) || []);
    setTotal(count || 0);
    setLoading(false);
  }, [params.q, params.category, params.sort, params.sellerId, from, to]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const totalPages = Math.ceil(total / pageSize);

  return { products, loading, refetch: fetch, total, page, totalPages };
}
