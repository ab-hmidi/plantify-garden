import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { hasSameOrigin } from "@/lib/request-validation";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}

export async function getCurrentAdmin() {
  const user = await getCurrentUser();

  return user?.role === "ADMIN" ? user : null;
}

export async function authorizeAdminRequest(
  request: Request,
  requireSameOrigin = false,
) {
  if (requireSameOrigin && !hasSameOrigin(request)) {
    return NextResponse.json(
      { message: "Origine de requête invalide" },
      { status: 403 },
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Authentification requise" },
      { status: 401 },
    );
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Accès réservé aux administrateurs" },
      { status: 403 },
    );
  }

  return user;
}
