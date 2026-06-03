import { auth } from "@/lib/auth/index";
import { storeRepository, mapStoreToProfile } from "@/lib/db/repositories/store.repository";
import { AppError } from "@/lib/utils/errors";
import type { StoreProfile } from "@/lib/domain/store/types";
import type { UserRole } from "@/lib/domain/auth/types";
import type { Session } from "next-auth";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  storeId: string;
  storeName: string;
  role: UserRole;
};

export type SessionContext = {
  user: SessionUser;
  store: StoreProfile;
};

function mapSessionUser(session: Session | null | undefined): SessionUser | null {
  if (!session?.user?.id || !session.user.email || !session.user.name) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    storeId: session.user.storeId,
    storeName: session.user.storeName,
    role: session.user.role,
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = (await auth()) as Session | null;
  return mapSessionUser(session);
}

export async function requireStoreManager(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new AppError("UNAUTHORIZED", "Authentication required", 401);
  }
  return user;
}

export async function requireSessionContext(): Promise<SessionContext> {
  const user = await requireStoreManager();
  const store = await storeRepository.getProfileById(user.storeId);

  if (!store) {
    throw new AppError("NOT_FOUND", "Store not found", 404);
  }

  return { user, store };
}

export async function getSessionContext(): Promise<SessionContext | null> {
  const user = await getSessionUser();
  if (!user) {
    return null;
  }

  const store = await storeRepository.getProfileById(user.storeId);
  if (!store) {
    return null;
  }

  return { user, store };
}

/** @deprecated Use mapStoreToProfile from store repository directly when needed. */
export { mapStoreToProfile };
