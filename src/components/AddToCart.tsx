"use client";

import { useState } from "react";

export default function AddToCart() {
  const [quantity, setQuantity] = useState(0);

  return (
    <div>
      <p>Articles dans le panier : {quantity}</p>

      <button onClick={() => setQuantity(quantity + 1)}>
        Ajouter au panier
      </button>
    </div>
  );
}
