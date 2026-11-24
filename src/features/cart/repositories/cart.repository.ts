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

export async function findOrCreateForUser(sessionId: string, userId: string) {
  return prisma.$transaction(async (transaction) => {
    const sessionCart = await transaction.cart.upsert({
      where: { sessionId },
      update: {},
      create: { sessionId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    const userCart = await transaction.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!userCart) {
      return transaction.cart.update({
        where: { id: sessionCart.id },
        data: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    }

    if (userCart.id === sessionCart.id) {
      return userCart;
    }

    for (const item of sessionCart.items) {
      const quantity = Math.min(
        item.product.stock,
        item.quantity +
          (userCart.items.find(
            (userItem) => userItem.productId === item.productId,
          )?.quantity ?? 0),
      );

      if (quantity === 0) {
        continue;
      }

      await transaction.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: userCart.id,
            productId: item.productId,
          },
        },
        update: { quantity },
        create: {
          cartId: userCart.id,
          productId: item.productId,
          quantity,
        },
      });
    }

    await transaction.cart.delete({
      where: { id: sessionCart.id },
    });

    return transaction.cart.update({
      where: { id: userCart.id },
      data: { sessionId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
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
