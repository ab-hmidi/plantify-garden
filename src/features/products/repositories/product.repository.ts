import "server-only";
import prisma from "@/lib/prisma";
import { getPageWindow } from "../services/pagination";
import type { Product, ProductCategory } from "../types/product";

const categoryMap: Record<string, ProductCategory> = {
  INTERIEUR: "interieur",
  EXTERIEUR: "exterieur",
  PLANTE_FLEURIE: "plante-fleurie",
};

const databaseCategoryMap: Record<
  ProductCategory,
  "INTERIEUR" | "EXTERIEUR" | "PLANTE_FLEURIE"
> = {
  interieur: "INTERIEUR",
  exterieur: "EXTERIEUR",
  "plante-fleurie": "PLANTE_FLEURIE",
};

type DbProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number];

export function mapProduct(product: DbProduct): Product {
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
    where: { active: true },
    orderBy: { id: "asc" },
  });

  return products.map(mapProduct);
}

export async function findPage(
  page: number,
  pageSize: number,
  filters: { search?: string; category?: ProductCategory } = {},
) {
  return prisma.$transaction(async (transaction) => {
    const where = {
      active: true,
      ...(filters.category
        ? { category: databaseCategoryMap[filters.category] }
        : {}),
      ...(filters.search
        ? {
            OR: [
              {
                name: {
                  contains: filters.search,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: filters.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };
    const total = await transaction.product.count({ where });
    const pageWindow = getPageWindow(page, total, pageSize);
    const products = await transaction.product.findMany({
      where,
      orderBy: { id: "asc" },
      skip: pageWindow.skip,
      take: pageWindow.take,
    });

    return {
      products: products.map(mapProduct),
      total,
      page: pageWindow.page,
      totalPages: pageWindow.totalPages,
    };
  });
}

export async function findBySlug(slug: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  return product?.active ? mapProduct(product) : undefined;
}
