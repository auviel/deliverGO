import type { UserRole } from "@/lib/domain/auth/types";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      storeId: string;
      storeName: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    storeId: string;
    storeName: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    storeId?: string;
    storeName?: string;
    role?: UserRole;
  }
}

export {};
