import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ManageProductButtons } from "@/components/manage-product-buttons";
import { formatPrice, formatDate, STATUS_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MyProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("seller_id", user!.id)
    .order("created_at", { ascending: false });

  if (!products || products.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">我的商品</h1>
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="mb-4">你还没有发布任何商品</p>
          <Button asChild>
            <Link href="/publish">发布第一件商品</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">我的商品</h1>
        <Button size="sm" asChild>
          <Link href="/publish">发布商品</Link>
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex gap-3 rounded-lg border p-3"
          >
            <Link href={`/product/${product.id}`} className="shrink-0">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-20 w-20 rounded-md object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center">
                  <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/product/${product.id}`}
                    className="font-medium hover:text-primary line-clamp-1"
                  >
                    {product.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-bold text-red-500">
                      {formatPrice(product.price)}
                    </span>
                    <Badge variant={product.status === "active" ? "default" : "secondary"}>
                      {STATUS_LABELS[product.status]}
                    </Badge>
                    {product.category && (
                      <Badge variant="outline">{(product as any).category.name}</Badge>
                    )}
                  </div>
                </div>
                <ManageProductButtons productId={product.id} status={product.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(product.created_at)} 发布
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
