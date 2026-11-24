"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Product, ProductCategory } from "@/features/products/types/product";

type AdminProduct = Product & {
  active: boolean;
};

type ProductDraft = {
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  stock: string;
  category: ProductCategory;
};

const emptyDraft: ProductDraft = {
  name: "",
  slug: "",
  description: "",
  price: "",
  image: "/images/monstera.jpg",
  stock: "0",
  category: "interieur",
};

const categoryLabels: Record<ProductCategory, string> = {
  interieur: "Intérieur",
  exterieur: "Extérieur",
  "plante-fleurie": "Plante fleurie",
};

function isProductCategory(value: string): value is ProductCategory {
  return (
    value === "interieur" ||
    value === "exterieur" ||
    value === "plante-fleurie"
  );
}

export default function AdminProductManager() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchProducts = useCallback(async () => {
    const response = await fetch("/api/admin/products", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Impossible de charger le catalogue.");
    }

    const data = (await response.json()) as AdminProduct[];
    return data;
  }, []);

  useEffect(() => {
    let active = true;

    fetchProducts()
      .then((data) => {
        if (active) {
          setProducts(data);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Impossible de charger le catalogue.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [fetchProducts]);

  function startEditing(product: AdminProduct) {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      stock: product.stock.toString(),
      category: product.category,
    });
    setError("");
    setNotice("");
  }

  function resetForm() {
    setEditingId(null);
    setDraft(emptyDraft);
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...draft,
            price: Number(draft.price),
            stock: Number(draft.stock),
          }),
        },
      );

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Impossible d'enregistrer le produit.");
      }

      setProducts(await fetchProducts());
      setNotice(editingId ? "Produit mis à jour." : "Produit créé.");
      resetForm();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Impossible d'enregistrer le produit.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function setProductActive(product: AdminProduct, active: boolean) {
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: active ? "PATCH" : "DELETE",
        headers: { "Content-Type": "application/json" },
        ...(active
          ? {
              body: JSON.stringify({
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: product.price,
                image: product.image,
                stock: product.stock,
                category: product.category,
                active: true,
              }),
            }
          : {}),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Impossible de modifier le produit.");
      }

      setProducts(await fetchProducts());
      setNotice(active ? "Produit réactivé." : "Produit désactivé.");
    } catch (actionError) {
      setError(
        actionError instanceof Error
          ? actionError.message
          : "Impossible de modifier le produit.",
      );
    }
  }

  return (
    <section className="mt-10 space-y-8">
      <form
        onSubmit={submitProduct}
        className="grid gap-5 rounded-2xl border border-[#e5eade] bg-white p-6 shadow-sm md:grid-cols-2"
      >
        <h2 className="text-xl font-semibold text-[#2d4634] md:col-span-2">
          {editingId ? "Modifier un produit" : "Ajouter un produit"}
        </h2>
        <label className="space-y-2 text-sm font-medium">
          Nom
          <input
            required
            maxLength={120}
            value={draft.name}
            onChange={(event) =>
              setDraft({ ...draft, name: event.target.value })
            }
            className="w-full rounded-lg border border-[#d9e0d5] px-3 py-2"
          />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Slug (URL)
          <input
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            maxLength={120}
            value={draft.slug}
            onChange={(event) =>
              setDraft({ ...draft, slug: event.target.value })
            }
            className="w-full rounded-lg border border-[#d9e0d5] px-3 py-2"
          />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Prix (€)
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            value={draft.price}
            onChange={(event) =>
              setDraft({ ...draft, price: event.target.value })
            }
            className="w-full rounded-lg border border-[#d9e0d5] px-3 py-2"
          />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Stock
          <input
            required
            type="number"
            min="0"
            max="1000000"
            step="1"
            value={draft.stock}
            onChange={(event) =>
              setDraft({ ...draft, stock: event.target.value })
            }
            className="w-full rounded-lg border border-[#d9e0d5] px-3 py-2"
          />
        </label>
        <label className="space-y-2 text-sm font-medium">
          Catégorie
          <select
            value={draft.category}
            onChange={(event) => {
              const category = event.target.value;

              if (isProductCategory(category)) {
                setDraft({ ...draft, category });
              }
            }}
            className="w-full rounded-lg border border-[#d9e0d5] bg-white px-3 py-2"
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium">
          Image (chemin /images/)
          <input
            required
            pattern="/images/[A-Za-z0-9._/-]+"
            value={draft.image}
            onChange={(event) =>
              setDraft({ ...draft, image: event.target.value })
            }
            className="w-full rounded-lg border border-[#d9e0d5] px-3 py-2"
          />
        </label>
        <label className="space-y-2 text-sm font-medium md:col-span-2">
          Description
          <textarea
            required
            maxLength={5000}
            rows={4}
            value={draft.description}
            onChange={(event) =>
              setDraft({ ...draft, description: event.target.value })
            }
            className="w-full rounded-lg border border-[#d9e0d5] px-3 py-2"
          />
        </label>
        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#315e3d] px-5 py-3 font-semibold text-white hover:bg-[#244b30] disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : editingId ? "Enregistrer" : "Créer le produit"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-[#cad5c6] px-5 py-3 font-semibold text-[#34523d]"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="text-sm text-[#315e3d]">
          {notice}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-[#e5eade] bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#f1f4ec] text-[#526455]">
            <tr>
              <th className="px-5 py-4">Produit</th>
              <th className="px-5 py-4">Catégorie</th>
              <th className="px-5 py-4">Prix</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">État</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center">
                  Chargement du catalogue...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-[#667568]">
                  Aucun produit enregistré.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-[#edf0e9]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#2d4634]">{product.name}</p>
                    <p className="text-xs text-[#7b867b]">/{product.slug}</p>
                  </td>
                  <td className="px-5 py-4">{categoryLabels[product.category]}</td>
                  <td className="px-5 py-4">{product.price.toFixed(2)} €</td>
                  <td className="px-5 py-4">{product.stock}</td>
                  <td className="px-5 py-4">
                    {product.active ? "Actif" : "Désactivé"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => startEditing(product)}
                        className="font-medium text-[#315e3d] underline"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setProductActive(product, !product.active)
                        }
                        className="font-medium text-[#8a3d32] underline"
                      >
                        {product.active ? "Désactiver" : "Réactiver"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
