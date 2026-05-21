import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FavoriteButton } from "@/components/favorite-button";
import { formatPrice, formatDate, CONDITION_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*), seller:profiles!products_seller_id_fkey(*)")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 检查是否已收藏
  let isFavorited = false;
  if (user) {
    const { data: fav } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", id)
      .maybeSingle();
    isFavorited = !!fav;
  }

  const images = (product as any).images || [];
  const seller = (product as any).seller;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {/* 图片区域 */}
      {images.length > 0 ? (
        <div className="mb-6 overflow-hidden rounded-lg bg-muted">
          <img
            src={images[0]}
            alt={product.title}
            className="mx-auto max-h-96 object-contain"
          />
        </div>
      ) : (
        <div className="mb-6 flex h-64 items-center justify-center rounded-lg bg-muted">
          <svg className="h-20 w-20 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 左侧商品信息 */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-3xl font-bold text-red-500">
                {formatPrice(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.category && (
              <Badge variant="secondary">{(product as any).category.name}</Badge>
            )}
            <Badge variant="outline">{CONDITION_LABELS[product.condition]}</Badge>
            {product.status !== "active" && (
              <Badge variant="destructive">
                {product.status === "sold" ? "已售出" : "已预订"}
              </Badge>
            )}
          </div>

          <Separator />

          <div>
            <h2 className="mb-2 font-semibold">商品描述</h2>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {product.description || "卖家没有留下任何描述。"}
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            发布时间：{formatDate(product.created_at)}
          </p>
        </div>

        {/* 右侧卖家信息 */}
        <div className="w-full lg:w-72">
          <div className="rounded-lg border p-4 space-y-4">
            <h2 className="font-semibold">卖家信息</h2>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {seller?.username?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link
                  href={`/profile/${seller?.id}`}
                  className="font-medium hover:text-primary"
                >
                  {seller?.username || "未知用户"}
                </Link>
              </div>
            </div>

            {seller?.qq && (
              <div className="text-sm">
                <span className="text-muted-foreground">QQ：</span>
                {seller.qq}
              </div>
            )}
            {seller?.wechat && (
              <div className="text-sm">
                <span className="text-muted-foreground">微信：</span>
                {seller.wechat}
              </div>
            )}

            {user ? (
              <FavoriteButton
                productId={id}
                initialFavorited={isFavorited}
              />
            ) : (
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/login">登录后收藏</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
