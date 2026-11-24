import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authorizeAdminRequest } from "@/lib/authorization";
import { readJsonObject } from "@/lib/request-validation";
import {
  parseProductInput,
  toDatabaseProduct,
} from "@/features/products/validation/product-input";
import { mapProduct } from "@/features/products/repositories/product.repository";

function isPrismaError(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

export async function GET(request: Request) {
  const authorization = await authorizeAdminRequest(request);

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(
      products.map((product) => ({
        ...mapProduct(product),
        active: product.active,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })),
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("Erreur lors du chargement des produits admin :", error);
    return NextResponse.json(
      { message: "Impossible de charger les produits" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authorization = await authorizeAdminRequest(request, true);

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  const body = await readJsonObject(request);
  const input = body && parseProductInput(body);

  if (!input) {
    return NextResponse.json(
      { message: "Les informations du produit sont invalides" },
      { status: 400 },
    );
  }

  try {
    const product = await prisma.product.create({
      data: toDatabaseProduct(input),
    });

    return NextResponse.json(
      {
        ...mapProduct(product),
        active: product.active,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
      { status: 201 },
    );
  } catch (error) {
    if (isPrismaError(error, "P2002")) {
      return NextResponse.json(
        { message: "Ce slug est déjà utilisé" },
        { status: 409 },
      );
    }

    console.error("Erreur lors de la création du produit :", error);
    return NextResponse.json(
      { message: "Impossible de créer le produit" },
      { status: 500 },
    );
  }
}
