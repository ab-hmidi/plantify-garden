import Link from "next/link";
import { connection } from "next/server";
import { getProductsPage } from "@/features/products/services/product.service";
import type { ProductCategory } from "@/features/products/types/product";
import {
  parsePageNumber,
  PRODUCTS_PER_PAGE,
} from "@/features/products/services/pagination";
import ProductCard from "./ProductCard";

const categoryMap: Record<string, ProductCategory> = {
  interieur: "interieur",
  exterieur: "exterieur",
  "plante-fleurie": "plante-fleurie",
};

const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: "interieur", label: "Plantes d'intérieur" },
  { value: "exterieur", label: "Plantes d'extérieur" },
  { value: "plante-fleurie", label: "Plantes fleuries" },
];

type ProductCatalogProps = {
  title?: string;
  description?: string;
  basePath?: "/" | "/shop";
  enableFilters?: boolean;
  searchParams: Promise<{
    page?: string | string[] | undefined;
    q?: string | string[] | undefined;
    category?: string | string[] | undefined;
  }>;
};

export default async function ProductCatalog({
  title = "Nos plantes",
  description = "Découvrez notre sélection de plantes pour votre intérieur et votre jardin.",
  basePath = "/",
  enableFilters = false,
  searchParams,
}: ProductCatalogProps) {
  await connection();
  const {
    page: requestedPage,
    q: requestedSearch,
    category: requestedCategory,
  } = await searchParams;
  const search =
    enableFilters && typeof requestedSearch === "string"
      ? requestedSearch.trim().slice(0, 100)
      : "";
  const category =
    enableFilters && typeof requestedCategory === "string"
      ? categoryMap[requestedCategory]
      : undefined;
  const pagination = await getProductsPage(
    parsePageNumber(requestedPage),
    PRODUCTS_PER_PAGE,
    { search: search || undefined, category },
  );
  const firstProduct =
    pagination.total === 0 ? 0 : (pagination.page - 1) * PRODUCTS_PER_PAGE + 1;
  const lastProduct = Math.min(
    pagination.page * PRODUCTS_PER_PAGE,
    pagination.total,
  );
  const pageHref = (page: number) => {
    const params = new URLSearchParams();

    if (search) params.set("q", search);
    if (category) params.set("category", category);
    if (page > 1) params.set("page", String(page));

    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold text-[#2d4634]">{title}</h1>
      <p className="mt-3 text-[#667568]">{description}</p>

      {enableFilters && (
        <form
          action={basePath}
          method="get"
          className="mt-8 grid gap-4 rounded-2xl border border-[#e5eade] bg-white p-5 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.65fr)_auto_auto] sm:items-end"
        >
          <label className="grid gap-2 text-sm font-medium text-[#38503b]">
            Rechercher une plante
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Ex. Monstera"
              className="rounded-lg border border-[#cad5c6] px-3 py-2 text-[#2d4634] outline-none focus:border-[#315e3d] focus:ring-2 focus:ring-[#315e3d]/20"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#38503b]">
            Catégorie
            <select
              name="category"
              defaultValue={category ?? ""}
              className="rounded-lg border border-[#cad5c6] bg-white px-3 py-2 text-[#2d4634] outline-none focus:border-[#315e3d] focus:ring-2 focus:ring-[#315e3d]/20"
            >
              <option value="">Toutes les catégories</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-full bg-[#315e3d] px-5 py-2 text-sm font-semibold text-white hover:bg-[#244b30]"
          >
            Rechercher
          </button>
          <Link
            href={basePath}
            className="pb-2 text-center text-sm font-medium text-[#34523d] underline underline-offset-2"
          >
            Effacer
          </Link>
        </form>
      )}

      {pagination.total === 0 ? (
        <p className="mt-10 rounded-2xl bg-white p-8 text-center text-[#667568]">
          Aucun produit n’est disponible pour le moment.
        </p>
      ) : (
        <>
          <p className="mt-6 text-sm text-[#667568]">
            {firstProduct}–{lastProduct} sur {pagination.total} produits
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pagination.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <nav
            aria-label="Pagination des produits"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            {pagination.page > 1 && (
              <Link
                href={pageHref(pagination.page - 1)}
                className="rounded-full border border-[#cad5c6] px-4 py-2 text-sm font-medium text-[#34523d] hover:bg-[#f1f4ec]"
              >
                Précédent
              </Link>
            )}
            {Array.from({ length: pagination.totalPages }, (_, index) => {
              const page = index + 1;

              return (
                <Link
                  key={page}
                  href={pageHref(page)}
                  aria-current={page === pagination.page ? "page" : undefined}
                  className={`grid size-10 place-items-center rounded-full text-sm font-semibold ${
                    page === pagination.page
                      ? "bg-[#315e3d] text-white"
                      : "border border-[#cad5c6] text-[#34523d] hover:bg-[#f1f4ec]"
                  }`}
                >
                  {page}
                </Link>
              );
            })}
            {pagination.page < pagination.totalPages && (
              <Link
                href={pageHref(pagination.page + 1)}
                className="rounded-full border border-[#cad5c6] px-4 py-2 text-sm font-medium text-[#34523d] hover:bg-[#f1f4ec]"
              >
                Suivant
              </Link>
            )}
          </nav>
          <p className="mt-3 text-center text-sm text-[#667568]">
            Page {pagination.page} sur {pagination.totalPages}
          </p>
        </>
      )}
    </main>
  );
}
