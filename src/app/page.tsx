import { Suspense } from "react";
import ProductCatalog from "@/features/products/components/ProductCatalog";

type HomePageProps = {
  searchParams: Promise<{ page?: string | string[] | undefined }>;
};

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
          Chargement du catalogue...
        </main>
      }
    >
      <ProductCatalog searchParams={searchParams} />
    </Suspense>
  );
}
