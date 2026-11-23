import "server-only";
import * as productRepository from "../repositories/product.repository";
import type { Product } from "../types/product";

export async function getAllProducts(): Promise<Product[]> {
  return productRepository.findAll();
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  return productRepository.findBySlug(slug);
}
