import "server-only";
import prisma from "@/lib/prisma";
import type { Product, ProductCategory } from "../types/product";

const categoryMap: Record<string, ProductCategory> = {
  INTERIEUR: "interieur",
  EXTERIEUR: "exterieur",
  PLANTE_FLEURIE: "plante-fleurie",
};

type DbProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number];

function mapProduct(product: DbProduct): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price.toNumber(),
    image: product.image,
    stock: product.stock,
    category: categoryMap[product.category],
  };
}

export async function findAll(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
  });

  return products.map(mapProduct);
}

export async function findBySlug(slug: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  return product ? mapProduct(product) : undefined;
}
