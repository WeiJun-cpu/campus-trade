"use client";

import Link from "next/link";

interface Props {
  page: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ page, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 4) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 3) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8">
      {page > 1 ? (
        <PageLink basePath={basePath} p={page - 1}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </PageLink>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-fg/30 cursor-not-allowed">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="flex h-9 w-9 items-center justify-center text-muted-fg/50 text-sm">
            ...
          </span>
        ) : (
          <PageLink key={p} basePath={basePath} p={p} active={p === page}>
            {p}
          </PageLink>
        )
      )}

      {page < totalPages ? (
        <PageLink basePath={basePath} p={page + 1}>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </PageLink>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-fg/30 cursor-not-allowed">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  );
}

function PageLink({
  basePath,
  p,
  active,
  children,
}: {
  basePath: string;
  p: number;
  active?: boolean;
  children: React.ReactNode;
}) {
  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  searchParams.set("page", String(p));

  return (
    <Link
      href={`${basePath}?${searchParams.toString()}`}
      className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-primary text-primary-fg shadow-warm"
          : "text-muted-fg hover:text-espresso hover:bg-secondary"
      }`}
    >
      {children}
    </Link>
  );
}
