import "server-only";
import prisma from "@/lib/prisma";
import { getOrCreateCart } from "@/features/cart/services/cart.service";

export type ShippingDetails = {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export async function createOrder(
  userId: string,
  email: string,
  shipping: ShippingDetails,
) {
  const cart = await getOrCreateCart();

  return prisma.$transaction(async (transaction) => {
    const currentCart = await transaction.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!currentCart || currentCart.items.length === 0) {
      throw new Error("CART_EMPTY");
    }

    let totalCents = 0;

    for (const item of currentCart.items) {
      if (!item.product.active) {
        throw new Error("PRODUCT_UNAVAILABLE");
      }

      const updated = await transaction.product.updateMany({
        where: {
          id: item.productId,
          active: true,
          stock: { gte: item.quantity },
        },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      if (updated.count !== 1) {
        throw new Error("INSUFFICIENT_STOCK");
      }

      totalCents += Math.round(item.product.price.toNumber() * 100) * item.quantity;
    }

    if (!Number.isSafeInteger(totalCents)) {
      throw new Error("ORDER_TOTAL_INVALID");
    }

    const order = await transaction.order.create({
      data: {
        userId,
        total: (totalCents / 100).toFixed(2),
        shippingName: shipping.name,
        shippingEmail: email,
        shippingPhone: shipping.phone,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingPostalCode: shipping.postalCode,
        shippingCountry: shipping.country,
        items: {
          create: currentCart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productSlug: item.product.slug,
            image: item.product.image,
            unitPrice: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        createdAt: true,
      },
    });

    await transaction.cartItem.deleteMany({
      where: { cartId: currentCart.id },
    });

    return {
      ...order,
      total: order.total.toNumber(),
    };
  });
}
