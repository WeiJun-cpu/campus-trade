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
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleFavorite = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
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
        toast.success("已收藏");
      }
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <Button
      variant={favorited ? "default" : "outline"}
      className="w-full"
      onClick={toggleFavorite}
      disabled={loading}
    >
      {favorited ? "❤ 已收藏" : "♡ 收藏"}
    </Button>
  );
}
