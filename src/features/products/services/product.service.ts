import "server-only";
import * as productRepository from "../repositories/product.repository";
import type { Product, ProductCategory } from "../types/product";

export async function getAllProducts(): Promise<Product[]> {
  return productRepository.findAll();
}

export async function getProductsPage(
  page: number,
  pageSize: number,
  filters: { search?: string; category?: ProductCategory } = {},
) {
  return productRepository.findPage(page, pageSize, filters);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  return productRepository.findBySlug(slug);
}
