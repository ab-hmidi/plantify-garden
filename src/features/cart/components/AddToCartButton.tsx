"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";

type AddToCartButtonProps = {
  productId: number;
  stock: number;
};

export default function AddToCartButton({
  productId,
  stock,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleAddToCart() {
    setMessage("");
    setPending(true);

    try {
      await addItem(productId);
      setMessage("Ajouté au panier.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Impossible d'ajouter au panier.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={stock <= 0 || pending}
        className="rounded-full bg-[#315e3d] px-6 py-3 font-medium text-white hover:bg-[#244b30] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "Ajout..." : stock > 0 ? "Ajouter au panier" : "Rupture de stock"}
      </button>
      {message && (
        <p role="status" className="mt-3 text-sm text-[#526455]">
          {message}
        </p>
      )}
    </div>
  );
}
