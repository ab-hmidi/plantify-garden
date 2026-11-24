import { Suspense } from "react";
import ProductCatalog from "@/features/products/components/ProductCatalog";

type ShopPageProps = {
  searchParams: Promise<{
    page?: string | string[] | undefined;
    q?: string | string[] | undefined;
    category?: string | string[] | undefined;
  }>;
};

export default function ShopPage({ searchParams }: ShopPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
          Chargement du catalogue...
        </main>
      }
    >
      <ProductCatalog
        title="Boutique"
        description="Recherchez une plante ou explorez le catalogue par catégorie."
        basePath="/shop"
        enableFilters
        searchParams={searchParams}
      />
    </Suspense>
  );
}
