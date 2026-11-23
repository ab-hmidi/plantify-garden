"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/features/cart/context/CartContext";
import type { Product } from "@/features/products/types/product";

export default function CartPage() {
  const { items, removeItem, incrementItem, decrementItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Impossible de récupérer les produits");
        }

        const products = (await response.json()) as Product[];
        setProducts(products);
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const cartItems = items
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.productId),
    }))
    .filter((item) => item.product !== undefined);

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

      <div className="mt-8 space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between border-b pb-6"
          >
            <div>
              <h2 className="font-semibold">{item.product?.name}</h2>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => decrementItem(item.productId)}
                  className="flex h-8 w-8 items-center justify-center rounded border"
                  aria-label="Diminuer la quantité"
                >
                  -
                </button>

                <span className="font-medium">{item.quantity}</span>

                <button
                  type="button"
                  onClick={() => incrementItem(item.productId)}
                  disabled={item.quantity >= item.product.stock}
                  className="flex h-8 w-8 items-center justify-center rounded border"
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>
            </div>

            <p className="font-semibold">
              {((item.product?.price ?? 0) * item.quantity).toFixed(2)} €
            </p>
            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <p className="text-xl font-bold">Total : {total.toFixed(2)} €</p>
      </div>
    </main>
  );
}
