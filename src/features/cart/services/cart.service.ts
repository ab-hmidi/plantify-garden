import "server-only";
import * as cartRepository from "../repositories/cart.repository";
import {
  getCartSessionId,
  rotateCartSessionId,
} from "./cart-session.service";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/authorization";

export async function getOrCreateCart() {
  let sessionId = await getCartSessionId();
  const user = await getCurrentUser();
  let sessionCart = await prisma.cart.findUnique({
    where: { sessionId },
    select: { userId: true },
  });

  if (
    sessionCart?.userId &&
    sessionCart.userId !== (user?.id ?? null)
  ) {
    sessionId = await rotateCartSessionId();
    sessionCart = null;
  }

  if (!user) {
    return cartRepository.findOrCreateBySessionId(sessionId);
  }

  return cartRepository.findOrCreateForUser(sessionId, user.id);
}

export async function addProductToCart(
  productId: number,
  quantity: number = 1,
) {
  const cart = await getOrCreateCart();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || !product.active) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  const currentQuantity = existingItem?.quantity ?? 0;
  const newQuantity = currentQuantity + quantity;

  if (newQuantity > product.stock) {
    throw new Error("INSUFFICIENT_STOCK");
  }

  return cartRepository.addItem(cart.id, productId, quantity);
}

export async function updateCartItemQuantity(
  productId: number,
  quantity: number,
) {
  const cart = await getOrCreateCart();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || !product.active) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (!existingItem) {
    throw new Error("CART_ITEM_NOT_FOUND");
  }

  if (quantity > product.stock) {
    throw new Error("INSUFFICIENT_STOCK");
  }

  return cartRepository.updateItemQuantity(cart.id, productId, quantity);
}

export async function removeProductFromCart(productId: number) {
  const cart = await getOrCreateCart();

  return cartRepository.removeItem(cart.id, productId);
}
