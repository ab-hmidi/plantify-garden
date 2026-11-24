"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/features/cart/context/CartContext";

type CheckoutFormProps = {
  defaultName: string;
};

type OrderConfirmation = {
  orderNumber: string;
  total: number;
};

export default function CheckoutForm({ defaultName }: CheckoutFormProps) {
  const { items, refreshCart } = useCart();
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("France");
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(
    null,
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          city,
          postalCode,
          country,
        }),
      });

      const result = (await response.json()) as
        | OrderConfirmation
        | { message?: string };

      if (!response.ok || !("orderNumber" in result)) {
        throw new Error(
          "message" in result && result.message
            ? result.message
            : "Impossible de créer la commande.",
        );
      }

      setConfirmation(result);
      void refreshCart().catch((refreshError: unknown) => {
        console.error("Erreur lors de l'actualisation du panier :", refreshError);
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Impossible de créer la commande.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <section
        role="status"
        className="mt-8 rounded-2xl border border-[#d9e6d3] bg-white p-8 shadow-sm"
      >
        <h2 className="text-2xl font-semibold text-[#2d4634]">
          Commande enregistrée
        </h2>
        <p className="mt-3 text-[#526455]">
          Référence : <strong>{confirmation.orderNumber}</strong>
        </p>
        <p className="mt-2 text-[#526455]">
          Total : {confirmation.total.toFixed(2)} €
        </p>
        <p className="mt-4 text-sm text-[#667568]">
          Aucun paiement n’a été effectué en ligne. L’équipe vous contactera
          pour la suite.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-flex rounded-full bg-[#315e3d] px-5 py-3 font-semibold text-white hover:bg-[#244b30]"
        >
          Voir mon compte
        </Link>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mt-8 rounded-2xl border border-[#e5eade] bg-white p-8">
        <p className="text-[#526455]">Votre panier est vide.</p>
        <Link href="/shop" className="mt-4 inline-block text-[#315e3d] underline">
          Retour à la boutique
        </Link>
      </section>
    );
  }

  return (
    <form
      onSubmit={submitOrder}
      className="mt-8 grid gap-5 rounded-2xl border border-[#e5eade] bg-white p-6 shadow-sm sm:grid-cols-2"
    >
      <label className="space-y-2 text-sm font-medium">
        Nom complet
        <input
          required
          maxLength={120}
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-[#d9e0d5] px-3 py-2"
        />
      </label>
      <label className="space-y-2 text-sm font-medium">
        Téléphone
        <input
          required
          type="tel"
          maxLength={40}
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full rounded-lg border border-[#d9e0d5] px-3 py-2"
        />
      </label>
      <label className="space-y-2 text-sm font-medium sm:col-span-2">
        Adresse
        <input
          required
          maxLength={250}
          autoComplete="street-address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="w-full rounded-lg border border-[#d9e0d5] px-3 py-2"
        />
      </label>
      <label className="space-y-2 text-sm font-medium">
        Ville
        <input
          required
          maxLength={120}
          autoComplete="address-level2"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="w-full rounded-lg border border-[#d9e0d5] px-3 py-2"
        />
      </label>
      <label className="space-y-2 text-sm font-medium">
        Code postal
        <input
          required
          maxLength={24}
          autoComplete="postal-code"
          value={postalCode}
          onChange={(event) => setPostalCode(event.target.value)}
          className="w-full rounded-lg border border-[#d9e0d5] px-3 py-2"
        />
      </label>
      <label className="space-y-2 text-sm font-medium">
        Pays
        <input
          required
          maxLength={80}
          autoComplete="country-name"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          className="w-full rounded-lg border border-[#d9e0d5] px-3 py-2"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-700 sm:col-span-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-[#315e3d] px-6 py-3 font-semibold text-white hover:bg-[#244b30] disabled:opacity-50 sm:col-span-2"
      >
        {submitting ? "Enregistrement..." : "Confirmer la commande"}
      </button>
    </form>
  );
}
