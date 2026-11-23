import "server-only";
import * as cartRepository from "../repositories/cart.repository";
import { getCartSessionId } from "./cart-session.service";
import prisma from "@/lib/prisma";

export async function getOrCreateCart() {
  const sessionId = await getCartSessionId();

  return cartRepository.findOrCreateBySessionId(sessionId);
}

export async function addProductToCart(
  productId: number,
  quantity: number = 1,
) {
  const cart = await getOrCreateCart();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
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

  if (!product) {
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
