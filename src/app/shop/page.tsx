import { getAllProducts } from "@/features/products/services/product.service";
import ProductCard from "@/features/products/components/ProductCard";

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold">Nos plantes</h1>

      <p className="mt-3 text-gray-600">
        Découvrez notre sélection de plantes pour votre intérieur et votre
        jardin.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
