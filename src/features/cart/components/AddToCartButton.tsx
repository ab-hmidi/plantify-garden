"use client";

import { useCart } from "../context/CartContext";

type AddToCartButtonProps = {
  productId: number;
  stock: number;
};

export default function AddToCartButton({
  productId,
  stock,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  async function handleAddToCart() {
    try {
      await addItem(productId);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={stock <= 0}
      className="rounded-lg bg-green-700 px-6 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {stock > 0 ? "Ajouter au panier" : "Rupture de stock"}
    </button>
  );
}
