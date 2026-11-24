import "dotenv/config";
import photoCredits from "../src/features/products/data/photo-credits.json";
import prisma from "../src/lib/prisma";

async function main() {
  if (photoCredits.length !== 60) {
    throw new Error("Le catalogue doit référencer exactement 60 photos.");
  }

  await prisma.$transaction(
    photoCredits.map((photo) =>
      prisma.product.update({
        where: { slug: photo.slug },
        data: { image: photo.image },
      }),
    ),
  );

  console.log(`${photoCredits.length} chemins de photos synchronisés.`);
}

main()
  .catch((error: unknown) => {
    console.error("Impossible de synchroniser les photos produits :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
