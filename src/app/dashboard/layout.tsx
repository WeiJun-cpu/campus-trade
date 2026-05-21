import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
      {/* 侧边栏 */}
      <aside className="hidden w-40 shrink-0 sm:block">
        <nav className="sticky top-20 space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/products">我的商品</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/favorites">我的收藏</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/settings">编辑资料</Link>
          </Button>
        </nav>
      </aside>

      {/* 移动端底部 tab */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-white sm:hidden">
        <Link
          href="/dashboard/products"
          className="flex-1 py-3 text-center text-sm font-medium"
        >
          我的商品
        </Link>
        <Link
          href="/dashboard/favorites"
          className="flex-1 py-3 text-center text-sm font-medium"
        >
          我的收藏
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex-1 py-3 text-center text-sm font-medium"
        >
          编辑资料
        </Link>
      </div>

      {/* 主内容 */}
      <div className="flex-1 pb-16 sm:pb-0">{children}</div>
    </div>
  );
}
