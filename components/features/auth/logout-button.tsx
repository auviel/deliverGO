import { signOut } from "@/lib/auth/index";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <Button type="submit" variant="ghost" className="h-auto px-0 py-0 text-xs text-text-tertiary hover:text-foreground">
        Sign out
      </Button>
    </form>
  );
}
