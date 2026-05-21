"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Props {
  productId: string;
  status: string;
}

export function ManageProductButtons({ productId, status }: Props) {
  const router = useRouter();

  const updateStatus = async (newStatus: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ status: newStatus })
      .eq("id", productId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("状态已更新");
      router.refresh();
    }
  };

  const deleteProduct = async () => {
    if (!confirm("确定要删除这个商品吗？此操作不可撤销。")) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("商品已删除");
      router.refresh();
    }
  };

  return (
    <div className="flex gap-2 shrink-0">
      {status === "active" && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateStatus("sold")}
          >
            标记已售
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateStatus("reserved")}
          >
            标记预订
          </Button>
        </>
      )}
      {status !== "active" && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateStatus("active")}
        >
          重新上架
        </Button>
      )}
      <Button
        size="sm"
        variant="outline"
        className="text-red-500 hover:text-red-600"
        onClick={deleteProduct}
      >
        删除
      </Button>
    </div>
  );
}
