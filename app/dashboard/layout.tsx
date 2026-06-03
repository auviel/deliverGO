import { SandboxBanner } from "@/components/layout/sandbox-banner";
import { Sidebar } from "@/components/layout/sidebar";
import { SkipLink } from "@/components/layout/skip-link";
import { TopBar } from "@/components/layout/top-bar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { DashboardProviders } from "@/components/providers/dashboard-providers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProviders>
      <SkipLink />
      <div className="flex min-h-full flex-col bg-background">
        <SandboxBanner />
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar />
            <main
              id="main-content"
              tabIndex={-1}
              className="flex-1 overflow-auto pb-20 focus:outline-none md:pb-0"
            >
              <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">{children}</div>
            </main>
          </div>
        </div>
        <MobileNav />
      </div>
    </DashboardProviders>
  );
}

export { PageHeader, PrimaryLink } from "@/components/layout/page-header";
