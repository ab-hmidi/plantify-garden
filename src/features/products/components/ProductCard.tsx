import Link from "next/link";
import type { Product, ProductCategory } from "../types/product";
import Image from "next/image";

type ProductCardProps = {
  product: Product;
};
const categoryLabels: Record<ProductCategory, string> = {
  interieur: "Plante d'intérieur",
  exterieur: "Plante d'extérieur",
  "plante-fleurie": "Plante fleurie",
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="rounded-xl border border-gray-200 p-6">
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-300 hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
        {categoryLabels[product.category]}
      </span>
      <h2 className="text-xl font-semibold">{product.name}</h2>

      <p className="mt-3 text-gray-600">{product.description}</p>

      <p className="mt-4 text-lg font-bold text-green-700">
        {product.price.toFixed(2)} €
      </p>

      <Link
        href={`/shop/${product.slug}`}
        className="mt-5 inline-block font-medium text-green-700 hover:text-green-900"
      >
        Voir le produit →
      </Link>
    </article>
  );
}
