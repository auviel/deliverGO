import Link from "next/link";
import { Package, Plus } from "lucide-react";

const navItems = [
  { href: "/dashboard/deliveries", label: "Deliveries", icon: Package },
  { href: "/dashboard/deliveries/new", label: "New delivery", icon: Plus },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
      <div className="border-b border-border px-5 py-6">
        <span className="text-lg font-semibold tracking-tight">deliverGO</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-elevated hover:text-foreground"
          >
            <Icon className="h-5 w-5" aria-hidden />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-xs font-medium text-foreground">Demo Store</p>
        <p className="text-xs text-text-tertiary">Store manager</p>
      </div>
    </aside>
  );
}
