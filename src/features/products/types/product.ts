export type ProductCategory = "interieur" | "exterieur" | "plante-fleurie";

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: ProductCategory;
};
