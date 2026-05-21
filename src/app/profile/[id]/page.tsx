import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProductGrid } from "@/components/product-grid";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("id, title, price, images, condition, status, created_at")
    .eq("seller_id", id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="text-2xl">
            {profile.username?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-bold">{profile.username}</h1>
          <p className="text-sm text-muted-foreground">
            加入于 {new Date(profile.created_at).toLocaleDateString("zh-CN")}
          </p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-bold">TA 在售的商品</h2>
      <ProductGrid products={(products as Product[]) || []} emptyMessage="该用户暂无在售商品" />
    </div>
  );
}
