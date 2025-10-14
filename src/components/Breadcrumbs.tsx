"use client";

import Link from "next/link";

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full py-3 text-sm font-montserrat"
    >
      <ol className="flex flex-wrap items-center gap-2 text-white/70">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-orange transition-colors duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white">{item.label}</span>
            )}
            {i < items.length - 1 && <span className="text-white/40">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
