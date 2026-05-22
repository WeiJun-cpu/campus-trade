export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface/60 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col items-center gap-4 text-center">
        {/* Logo */}
        <div
          className="text-xl font-bold tracking-tight text-espresso flex items-center gap-2"
          style={{ fontFamily: "var(--font-display), serif" }}
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-fg text-xs">
            校
          </span>
          校园二手
        </div>

        <p className="text-sm text-muted-fg max-w-sm leading-relaxed">
          让闲置物品找到新主人 · 校园里的温暖集市
        </p>

        {/* Divider line */}
        <div className="w-12 h-px bg-border/60" />

        <p className="text-xs text-muted-fg/50">
          &copy; {new Date().getFullYear()} 校园二手交易平台 — 大学生专属二手市场
        </p>
      </div>
    </footer>
  );
}
