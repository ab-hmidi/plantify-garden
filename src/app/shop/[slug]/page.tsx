import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/features/products/services/product.service";
import AddToCartButton from "@/features/cart/components/AddToCartButton";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<p className="p-12">Chargement du produit...</p>}>
      <ProductDetails params={params} />
    </Suspense>
  );
}

async function ProductDetails({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-wide text-green-700">
            {product.category}
          </p>

          <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>

          <p className="mt-5 text-gray-600">{product.description}</p>

          <p className="mt-6 text-3xl font-bold text-green-700">
            {product.price.toFixed(2)} €
          </p>

          <p className="mt-3 text-sm text-gray-500">
            {product.stock > 0
              ? `${product.stock} exemplaires disponibles`
              : "Rupture de stock"}
          </p>
          <AddToCartButton productId={product.id} stock={product.stock} />
        </div>
      </div>
    </main>
  );
}
