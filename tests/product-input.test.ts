import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { parseProductInput, toDatabaseProduct } from "../src/features/products/validation/product-input";
import {
  getPageWindow,
  parsePageNumber,
} from "../src/features/products/services/pagination";
import photoCredits from "../src/features/products/data/photo-credits.json";

const validProduct = {
  name: "Monstera",
  slug: "monstera",
  description: "Plante tropicale.",
  price: 29.9,
  image: "/images/monstera.jpg",
  stock: 12,
  category: "interieur",
};

describe("parseProductInput", () => {
  it("accepts a valid product and maps its category for Prisma", () => {
    const parsed = parseProductInput(validProduct);

    assert.ok(parsed);
    assert.equal(parsed.name, "Monstera");
    assert.equal(toDatabaseProduct(parsed).category, "INTERIEUR");
  });

  describe("product pagination", () => {
    it("keeps all sixty products on exactly five distinct twelve-item pages", () => {
      const ids = Array.from({ length: 60 }, (_, index) => index + 1);
      const pages = Array.from({ length: 5 }, (_, index) => {
        const window = getPageWindow(index + 1, ids.length, 12);
        return ids.slice(window.skip, window.skip + window.take);
      });
      const paginatedIds = pages.flat();

      assert.ok(pages.every((page) => page.length === 12));
      assert.equal(new Set(paginatedIds).size, 60);
      assert.deepEqual(paginatedIds, ids);
    });

    it("defaults invalid page parameters and clamps pages beyond the last page", () => {
      assert.equal(parsePageNumber("0"), 1);
      assert.equal(parsePageNumber(["2", "3"]), 1);
      assert.equal(parsePageNumber("3"), 3);
      assert.deepEqual(getPageWindow(99, 60, 12), {
        page: 5,
        totalPages: 5,
        skip: 48,
        take: 12,
      });
    });
  });

  it("rejects malformed slugs, remote image paths, fractional stock and sub-cent prices", () => {
    assert.equal(
      parseProductInput({ ...validProduct, slug: "../monstera" }),
      null,
    );
    assert.equal(
      parseProductInput({ ...validProduct, image: "https://example.com/plant.jpg" }),
      null,
    );
    assert.equal(parseProductInput({ ...validProduct, stock: 1.5 }), null);
    assert.equal(parseProductInput({ ...validProduct, price: 10.001 }), null);
  });

  describe("product photos", () => {
    it("uses sixty distinct local photos with source and license credits", () => {
      assert.equal(photoCredits.length, 60);
      assert.equal(new Set(photoCredits.map((photo) => photo.image)).size, 60);

      for (const photo of photoCredits) {
        assert.match(photo.image, /^\/images\/products\/[a-z0-9-]+\.jpg$/);
        assert.ok(existsSync(join(process.cwd(), "public", photo.image.slice(1))));
        assert.match(photo.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
        assert.match(photo.license, /^(CC0|Public domain|CC BY)/);
        assert.ok(photo.author.length > 0);
      }
    });
  });
});
