"use client";

import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/stores/user-store";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    toast.success("已退出登录");
    router.refresh();
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-danger">
      退出登录
    </DropdownMenuItem>
  );
}
