import "dotenv/config";
import prisma from "../src/lib/prisma";

async function main() {
  const userId = process.argv[2]?.trim();

  if (!userId) {
    throw new Error(
      "Usage : npm run admin:promote -- identifiant-utilisateur",
    );
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: "ADMIN" },
    select: { name: true, id: true },
  });

  console.log(`Administrateur activé pour ${user.name} (${user.id}).`);
}

main()
  .catch((error: unknown) => {
    console.error("Impossible de promouvoir cet utilisateur :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
