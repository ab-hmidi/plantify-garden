import { NextResponse } from "next/server";
import { getOrCreateCart } from "@/features/cart/services/cart.service";
import { addProductToCart } from "@/features/cart/services/cart.service";
import {
  updateCartItemQuantity,
  removeProductFromCart,
} from "@/features/cart/services/cart.service";

export async function GET() {
  try {
    const cart = await getOrCreateCart();

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Erreur lors de la récupération du panier :", error);

    return NextResponse.json(
      { message: "Impossible de récupérer le panier" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (
      !Number.isInteger(productId) ||
      !Number.isInteger(quantity) ||
      productId <= 0 ||
      quantity <= 0
    ) {
      return NextResponse.json(
        { message: "Données invalides" },
        { status: 400 },
      );
    }

    const item = await addProductToCart(productId, quantity);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PRODUCT_NOT_FOUND") {
        return NextResponse.json(
          { message: "Produit introuvable" },
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

    console.error("Erreur lors de l'ajout au panier :", error);

    return NextResponse.json(
      { message: "Impossible d'ajouter le produit au panier" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { productId, quantity } = await request.json();

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return NextResponse.json(
        { message: "Données invalides" },
        { status: 400 },
      );
    }

    const item = await updateCartItemQuantity(productId, quantity);

    return NextResponse.json(item);
  } catch (error) {
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

    console.error("Erreur lors de la modification du panier :", error);

    return NextResponse.json(
      { message: "Impossible de modifier le panier" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { productId } = await request.json();

    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json(
        { message: "Identifiant invalide" },
        { status: 400 },
      );
    }

    await removeProductFromCart(productId);

    return NextResponse.json({ message: "Produit supprimé du panier" });
  } catch (error) {
    console.error("Erreur lors de la suppression du panier :", error);

    return NextResponse.json(
      { message: "Impossible de supprimer le produit" },
      { status: 500 },
    );
  }
}
