import "server-only";
import prisma from "@/lib/prisma";

export async function findOrCreateBySessionId(sessionId: string) {
  return prisma.cart.upsert({
    where: {
      sessionId,
    },
    update: {},
    create: {
      sessionId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function addItem(
  cartId: number,
  productId: number,
  quantity: number,
) {
  return prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId,
        productId,
      },
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
    create: {
      cartId,
      productId,
      quantity,
    },
  });
}

export async function removeItem(cartId: number, productId: number) {
  return prisma.cartItem.deleteMany({
    where: {
      cartId,
      productId,
    },
  });
}

export async function updateItemQuantity(
  cartId: number,
  productId: number,
  quantity: number,
) {
  return prisma.cartItem.update({
    where: {
      cartId_productId: {
        cartId,
        productId,
      },
    },
    data: {
      quantity,
    },
  });
}
