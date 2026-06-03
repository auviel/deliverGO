import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { auth } from "@/lib/auth/index";
import { LogoutButton } from "@/components/features/auth/logout-button";
import { SidebarNavLink } from "@/components/layout/sidebar-nav-link";

export async function Sidebar() {
  const session = await auth();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-surface md:flex md:flex-col">
      <div className="border-b border-border px-5 py-6">
        <span className="text-lg font-semibold tracking-tight">deliverGO</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        <SidebarNavLink
          href="/dashboard/deliveries"
          label="Deliveries"
          icon={Package}
          excludePaths={["/dashboard/deliveries/new"]}
        />
        <SidebarNavLink
          href="/dashboard/deliveries/new"
          label="New delivery"
          icon={Plus}
        />
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-xs font-medium text-foreground">
          {session?.user?.storeName ?? "Store"}
        </p>
        <p className="text-xs text-text-tertiary">
          {session?.user?.name ?? "Store manager"}
        </p>
        <div className="mt-2">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
