import "dotenv/config";
import prisma from "../src/lib/prisma";

const products = [
  {
    name: "Monstera Deliciosa",
    slug: "monstera-deliciosa",
    description: "Une magnifique plante tropicale pour votre intérieur.",
    price: "29.90",
    image: "/images/monstera.jpg",
    stock: 12,
    category: "INTERIEUR" as const,
  },
  {
    name: "Ficus Elastica",
    slug: "ficus-elastica",
    description: "Un ficus élégant aux feuilles épaisses et brillantes.",
    price: "24.90",
    image: "/images/ficus.jpg",
    stock: 8,
    category: "INTERIEUR" as const,
  },
  {
    name: "Pothos",
    slug: "pothos",
    description: "Une plante facile à entretenir, idéale pour débuter.",
    price: "14.90",
    image: "/images/pothos.jpg",
    stock: 20,
    category: "PLANTE_FLEURIE" as const,
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log("Les produits ont été ajoutés avec succès !");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
