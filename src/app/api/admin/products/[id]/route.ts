import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/authorization";
import { readJsonObject } from "@/lib/request-validation";
import {
  parseProductInput,
  toDatabaseProduct,
} from "@/features/products/validation/product-input";
import { mapProduct } from "@/features/products/repositories/product.repository";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function isPrismaError(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  const authorization = await authorizeAdminRequest(request, true);

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  const body = await readJsonObject(request);
  const input = body && parseProductInput(body);
  const active = body?.active;

  if (
    id === null ||
    !input ||
    (active !== undefined && typeof active !== "boolean")
  ) {
    return NextResponse.json(
      { message: "Identifiant ou informations invalides" },
      { status: 400 },
    );
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...toDatabaseProduct(input),
        ...(typeof active === "boolean" ? { active } : {}),
      },
    });

    return NextResponse.json({
      ...mapProduct(product),
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      return NextResponse.json(
        { message: "Produit introuvable" },
        { status: 404 },
      );
    }

    if (isPrismaError(error, "P2002")) {
      return NextResponse.json(
        { message: "Ce slug est déjà utilisé" },
        { status: 409 },
      );
    }

    console.error("Erreur lors de la modification du produit :", error);
    return NextResponse.json(
      { message: "Impossible de modifier le produit" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const authorization = await authorizeAdminRequest(request, true);

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  const { id: rawId } = await context.params;
  const id = parseId(rawId);

  if (id === null) {
    return NextResponse.json(
      { message: "Identifiant invalide" },
      { status: 400 },
    );
  }

  try {
    await prisma.product.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ message: "Produit désactivé" });
  } catch (error) {
    if (isPrismaError(error, "P2025")) {
      return NextResponse.json(
        { message: "Produit introuvable" },
        { status: 404 },
      );
    }

    console.error("Erreur lors de la désactivation du produit :", error);
    return NextResponse.json(
      { message: "Impossible de désactiver le produit" },
      { status: 500 },
    );
  }
}
