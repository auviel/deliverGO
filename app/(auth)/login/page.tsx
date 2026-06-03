import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            deliverGO
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to manage deliveries
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface-elevated p-6">
          <p className="text-sm text-text-secondary">
            Login form — Phase 2
          </p>
          <Link
            href="/dashboard/deliveries"
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-md bg-accent text-sm font-medium text-text-inverse transition-colors hover:bg-accent-hover"
          >
            Continue to dashboard (dev)
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-text-tertiary">
          Powered by Uber Direct
        </p>
      </div>
    </div>
  );
}
