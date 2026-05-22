"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Props {
  productId: string;
  initialFavorited: boolean;
}

export function FavoriteButton({ productId, initialFavorited }: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleFavorite = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      setLoading(false);
      return;
    }

    if (favorited) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      setFavorited(false);
      toast.success("已取消收藏");
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, product_id: productId });
      if (error) {
        toast.error(error.message);
      } else {
        setFavorited(true);
        setAnimating(true);
        setTimeout(() => setAnimating(false), 400);
        toast.success("已收藏 ❤");
      }
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <Button
      onClick={toggleFavorite}
      disabled={loading}
      className={`w-full rounded-full font-medium transition-all duration-200 ${
        favorited
          ? "bg-primary text-primary-fg shadow-warm"
          : "bg-surface border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40"
      }`}
    >
      <span className={animating ? "animate-heart-beat" : ""}>
        {favorited ? "❤ 已收藏" : "♡ 收藏"}
      </span>
    </Button>
  );
}
