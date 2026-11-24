import { NextResponse } from "next/server";
import {
  addProductToCart,
  getOrCreateCart,
  removeProductFromCart,
  updateCartItemQuantity,
} from "@/features/cart/services/cart.service";
import { hasSameOrigin, readJsonObject } from "@/lib/request-validation";

function serviceErrorResponse(error: unknown, fallback: string) {
  if (error instanceof Error) {
    if (error.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { message: "Produit introuvable" },
        { status: 404 },
      );
    }

    if (error.message === "CART_ITEM_NOT_FOUND") {
      return NextResponse.json(
        { message: "Produit absent du panier" },
        { status: 404 },
      );
    }

    if (error.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json(
        { message: "Stock insuffisant" },
        { status: 409 },
      );
    }
  }

  console.error(fallback, error);
  return NextResponse.json({ message: fallback }, { status: 500 });
}

function validId(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === "number" && value > 0;
}

export async function GET() {
  try {
    const cart = await getOrCreateCart();

    return NextResponse.json(
      {
        ...cart,
        items: cart.items.map((item) => ({
          id: item.id,
          cartId: item.cartId,
          productId: item.productId,
          quantity: item.quantity,
          product: {
            ...item.product,
            price: item.product.price.toNumber(),
          },
        })),
      },
      {
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  } catch (error) {
    return serviceErrorResponse(error, "Impossible de récupérer le panier");
  }
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json(
      { message: "Origine de requête invalide" },
      { status: 403 },
    );
  }

  const body = await readJsonObject(request);
  const productId = body?.productId;
  const quantity = body?.quantity ?? 1;

  if (
    !validId(productId) ||
    !Number.isInteger(quantity) ||
    typeof quantity !== "number" ||
    quantity <= 0 ||
    quantity > 99
  ) {
    return NextResponse.json({ message: "Données invalides" }, { status: 400 });
  }

  try {
    const item = await addProductToCart(productId, quantity);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return serviceErrorResponse(
      error,
      "Impossible d'ajouter le produit au panier",
    );
  }
}

export async function PATCH(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json(
      { message: "Origine de requête invalide" },
      { status: 403 },
    );
  }

  const body = await readJsonObject(request);
  const productId = body?.productId;
  const quantity = body?.quantity;

  if (
    !validId(productId) ||
    !Number.isInteger(quantity) ||
    typeof quantity !== "number" ||
    quantity <= 0 ||
    quantity > 99
  ) {
    return NextResponse.json({ message: "Données invalides" }, { status: 400 });
  }

  try {
    const item = await updateCartItemQuantity(productId, quantity);
    return NextResponse.json(item);
  } catch (error) {
    return serviceErrorResponse(error, "Impossible de modifier le panier");
  }
}

export async function DELETE(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json(
      { message: "Origine de requête invalide" },
      { status: 403 },
    );
  }

  const body = await readJsonObject(request);
  const productId = body?.productId;

  if (!validId(productId)) {
    return NextResponse.json(
      { message: "Identifiant invalide" },
      { status: 400 },
    );
  }

  try {
    await removeProductFromCart(productId);
    return NextResponse.json({ message: "Produit supprimé du panier" });
  } catch (error) {
    return serviceErrorResponse(error, "Impossible de supprimer le produit");
  }
}
