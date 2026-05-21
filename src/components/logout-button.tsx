"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("已退出登录");
    router.refresh();
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
      退出登录
    </DropdownMenuItem>
  );
}
