/** Session helpers — Phase 2. */
export type SessionUser = {
  id: string;
  email: string;
  name: string;
  storeId: string;
  role: "STORE_MANAGER";
};

export async function requireStoreManager(): Promise<SessionUser> {
  throw new Error("Auth is not implemented yet (Phase 2).");
}
