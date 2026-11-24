"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/context/CartContext";
import type { Product } from "@/features/products/types/product";

type CartProduct = Product & { active: boolean };
type CartResponse = {
  items: Array<{
    productId: number;
    quantity: number;
    product: CartProduct;
  }>;
};

export default function CartPage() {
  const { items, removeItem, incrementItem, decrementItem } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartError, setCartError] = useState("");

  async function runCartAction(action: () => Promise<void>) {
    setCartError("");

    try {
      await action();
    } catch (error) {
      setCartError(
        error instanceof Error ? error.message : "Impossible de mettre à jour le panier.",
      );
    }
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/cart", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Impossible de récupérer le panier");
        }

        const cart = (await response.json()) as CartResponse;
        setProducts(cart.items.map((item) => item.product));
      } catch (error) {
        setCartError(
          error instanceof Error
            ? error.message
            : "Impossible de récupérer le panier.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const cartItems = useMemo(
    () =>
      items
        .map((item) => ({
          ...item,
          product: products.find((product) => product.id === item.productId),
        }))
        .filter(
          (item): item is typeof item & { product: CartProduct } =>
            item.product !== undefined,
        ),
    [items, products],
  );
  const canCheckout =
    cartItems.length > 0 &&
    cartItems.length === items.length &&
    cartItems.every(
      (item) => item.product.active && item.quantity <= item.product.stock,
    );

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0,
  );
  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        Chargement du panier...
      </main>
    );
  }
  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">Votre panier est vide</h1>

        <p className="mt-4 text-gray-600">
          Découvrez nos plantes et ajoutez vos produits préférés.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-block rounded-lg bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800"
        >
          Découvrir nos plantes
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold">Mon panier</h1>

      {cartError && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {cartError}
        </p>
      )}

      <div className="mt-8 space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between border-b pb-6"
          >
            <div>
              <h2 className="font-semibold">{item.product.name}</h2>
              {(!item.product.active || item.quantity > item.product.stock) && (
                <p className="mt-1 text-sm text-red-700">
                  Produit indisponible ou quantité supérieure au stock actuel.
                </p>
              )}
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    runCartAction(() => decrementItem(item.productId))
                  }
                  className="flex h-8 w-8 items-center justify-center rounded border"
                  aria-label="Diminuer la quantité"
                >
                  -
                </button>

                <span className="font-medium">{item.quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    runCartAction(() => incrementItem(item.productId))
                  }
                  disabled={
                    !item.product.active ||
                    item.quantity >= item.product.stock
                  }
                  className="flex h-8 w-8 items-center justify-center rounded border"
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>
            </div>

            <p className="font-semibold">
              {(item.product.price * item.quantity).toFixed(2)} €
            </p>
            <button
              type="button"
              onClick={() => runCartAction(() => removeItem(item.productId))}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <p className="text-xl font-bold">Total : {total.toFixed(2)} €</p>
        <button
          type="button"
          onClick={() => router.push("/checkout")}
          disabled={!canCheckout}
          className="mt-5 rounded-full bg-[#315e3d] px-6 py-3 font-semibold text-white hover:bg-[#244b30] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Commander
        </button>
      </div>
    </main>
  );
}
