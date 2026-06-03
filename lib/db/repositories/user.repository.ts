import type { UserRole } from "@/lib/domain/auth/types";
import { prisma } from "@/lib/db/client";

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { store: true },
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { store: true },
    });
  },
};

export function mapPrismaRole(role: "STORE_MANAGER"): UserRole {
  return role;
}
