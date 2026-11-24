import type { ProductCategory } from "../types/product";

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: ProductCategory;
};

function isProductCategory(value: unknown): value is ProductCategory {
  return (
    value === "interieur" ||
    value === "exterieur" ||
    value === "plante-fleurie"
  );
}

const categoryToDatabase = {
  interieur: "INTERIEUR",
  exterieur: "EXTERIEUR",
  "plante-fleurie": "PLANTE_FLEURIE",
} as const;

export function parseProductInput(
  value: Record<string, unknown>,
): ProductInput | null {
  const { name, slug, description, price, image, stock, category } = value;

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    name.trim().length > 120 ||
    typeof slug !== "string" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    slug.length > 120 ||
    typeof description !== "string" ||
    description.trim().length === 0 ||
    description.trim().length > 5000 ||
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price <= 0 ||
    price > 99999999.99 ||
    Math.abs(price * 100 - Math.round(price * 100)) > 1e-8 ||
    typeof image !== "string" ||
    !/^\/images\/[A-Za-z0-9._/-]+$/.test(image) ||
    image.includes("..") ||
    typeof stock !== "number" ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    stock > 1_000_000 ||
    !isProductCategory(category)
  ) {
    return null;
  }

  return {
    name: name.trim(),
    slug,
    description: description.trim(),
    price,
    image,
    stock,
    category,
  };
}

export function toDatabaseProduct(input: ProductInput) {
  return {
    name: input.name,
    slug: input.slug,
    description: input.description,
    price: input.price,
    image: input.image,
    stock: input.stock,
    category: categoryToDatabase[input.category],
  };
}
