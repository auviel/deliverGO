"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type SidebarNavLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  excludePaths?: string[];
};

export function SidebarNavLink({
  href,
  label,
  icon: Icon,
  exact = false,
  excludePaths = [],
}: SidebarNavLinkProps) {
  const pathname = usePathname();
  const excluded = excludePaths.some((path) => pathname.startsWith(path));
  const isActive =
    !excluded &&
    (exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-fast",
        isActive
          ? "bg-surface-elevated text-foreground shadow-[inset_3px_0_0_0_var(--foreground)]"
          : "text-text-secondary hover:bg-surface-elevated hover:text-foreground",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-5 w-5" aria-hidden />
      {label}
    </Link>
  );
}
