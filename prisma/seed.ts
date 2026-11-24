import "dotenv/config";
import prisma from "../src/lib/prisma";

type ProductCategory = "INTERIEUR" | "EXTERIEUR" | "PLANTE_FLEURIE";

function plant(
  name: string,
  slug: string,
  description: string,
  price: string,
  image: string,
  stock: number,
  category: ProductCategory,
) {
  const imageDirectory = image.slice(0, image.indexOf("/", 1) + 1);

  return {
    name,
    slug,
    description,
    price,
    image: `${imageDirectory}products/${slug}.jpg`,
    stock,
    category,
    active: true,
  };
}

const products = [
  plant("Monstera Deliciosa", "monstera-deliciosa", "Ses grandes feuilles découpées donnent une touche tropicale au salon.", "29.90", "/images/monstera.jpg", 12, "INTERIEUR"),
  plant("Ficus Elastica", "ficus-elastica", "Un ficus robuste aux feuilles épaisses et brillantes.", "24.90", "/images/ficus.jpg", 8, "INTERIEUR"),
  plant("Pothos", "pothos", "Une plante retombante facile à entretenir, idéale pour débuter.", "14.90", "/images/pothos.jpg", 20, "INTERIEUR"),
  plant("Aloe Vera", "aloe-vera", "Une succulente graphique qui apprécie les pièces lumineuses.", "12.50", "/images/aloe.jpg", 16, "INTERIEUR"),
  plant("Sansevieria Laurentii", "sansevieria-laurentii", "Ses feuilles dressées apportent une silhouette élégante et moderne.", "22.90", "/images/sansevieria.jpg", 14, "INTERIEUR"),
  plant("Calathea Orbifolia", "calathea-orbifolia", "Ses larges feuilles nervurées décorent les espaces lumineux sans soleil direct.", "27.50", "/images/calatea.jpg", 9, "INTERIEUR"),
  plant("Zamioculcas Zamiifolia", "zamioculcas-zamiifolia", "Une plante d’intérieur résistante au feuillage vert profond.", "25.90", "/images/ficus.jpg", 13, "INTERIEUR"),
  plant("Spathiphyllum", "spathiphyllum", "Une plante élégante qui produit de belles fleurs blanches.", "18.90", "/images/pothos.jpg", 11, "PLANTE_FLEURIE"),
  plant("Dracaena Marginata", "dracaena-marginata", "Un petit arbre d’intérieur au port fin et aux feuilles arquées.", "32.00", "/images/strelitzia.jpg", 7, "INTERIEUR"),
  plant("Chlorophytum Comosum", "chlorophytum-comosum", "Une plante retombante généreuse, parfaite sur une étagère.", "13.90", "/images/pilea.jpg", 22, "INTERIEUR"),
  plant("Pilea Peperomioides", "pilea-peperomioides", "Ses feuilles rondes et graphiques en font une plante pleine de caractère.", "16.90", "/images/pilea.jpg", 18, "INTERIEUR"),
  plant("Philodendron Brasil", "philodendron-brasil", "Un philodendron retombant aux feuilles panachées de vert et de jaune.", "19.90", "/images/philodendron.jpg", 15, "INTERIEUR"),
  plant("Anthurium", "anthurium", "Une plante fleurie aux bractées colorées et au feuillage brillant.", "24.50", "/images/monstera.jpg", 8, "PLANTE_FLEURIE"),
  plant("Begonia Maculata", "begonia-maculata", "Ses feuilles ponctuées de blanc donnent un aspect original à la pièce.", "21.90", "/images/philodendron.jpg", 10, "PLANTE_FLEURIE"),
  plant("Areca", "areca", "Un palmier d’intérieur qui apporte une ambiance douce et tropicale.", "39.90", "/images/strelitzia.jpg", 6, "INTERIEUR"),
  plant("Kentia", "kentia", "Un palmier au port élégant, adapté aux grands espaces lumineux.", "59.00", "/images/strelitzia.jpg", 5, "INTERIEUR"),
  plant("Cactus Echinopsis", "cactus-echinopsis", "Un cactus compact qui aime la lumière et demande peu d’arrosage.", "9.90", "/images/cactus.jpg", 30, "INTERIEUR"),
  plant("Cactus Opuntia", "cactus-opuntia", "Une silhouette graphique pour composer une collection de succulentes.", "11.50", "/images/cactus.jpg", 24, "INTERIEUR"),
  plant("Echeveria", "echeveria", "Une rosette charnue aux couleurs douces pour un rebord ensoleillé.", "8.90", "/images/aloe.jpg", 28, "INTERIEUR"),
  plant("Crassula Ovata", "crassula-ovata", "L’arbre de jade se cultive facilement dans une pièce très lumineuse.", "15.90", "/images/aloe.jpg", 19, "INTERIEUR"),
  plant("Strelitzia Nicolai", "strelitzia-nicolai", "Ses grandes feuilles créent une présence tropicale dans la maison.", "49.90", "/images/strelitzia.jpg", 4, "INTERIEUR"),
  plant("Lavande", "lavande", "Une plante parfumée qui aime le soleil et les sols bien drainés.", "10.90", "/images/hero.jpg", 25, "EXTERIEUR"),
  plant("Romarin", "romarin", "Un aromatique persistant à garder près de la cuisine ou au jardin.", "7.90", "/images/hero.jpg", 27, "EXTERIEUR"),
  plant("Olivier", "olivier", "Un petit olivier décoratif pour une terrasse ensoleillée.", "45.00", "/images/hero.jpg", 6, "EXTERIEUR"),
  plant("Hortensia", "hortensia", "Une plante généreuse qui apporte une floraison colorée au jardin.", "24.90", "/images/hero.jpg", 12, "PLANTE_FLEURIE"),
  plant("Rosier Paysager", "rosier-paysager", "Un rosier compact pour apporter des fleurs au jardin ou sur la terrasse.", "21.50", "/images/hero.jpg", 14, "PLANTE_FLEURIE"),
  plant("Jasmin Étoilé", "jasmin-etoile", "Une plante grimpante aux fleurs parfumées pour un support ensoleillé.", "19.90", "/images/hero.jpg", 9, "PLANTE_FLEURIE"),
  plant("Bambou Fargesia", "bambou-fargesia", "Un bambou non traçant adapté aux haies et aux grands bacs.", "34.90", "/images/hero.jpg", 8, "EXTERIEUR"),
  plant("Citronnier", "citronnier", "Un agrume en pot qui apprécie la lumière et les emplacements abrités.", "39.90", "/images/hero.jpg", 7, "EXTERIEUR"),
  plant("Menthe", "menthe", "Une aromatique fraîche à cultiver en pot pour en limiter l’expansion.", "5.90", "/images/hero.jpg", 32, "EXTERIEUR"),
  plant("Basilic", "basilic", "Une plante aromatique à placer au soleil et à arroser régulièrement.", "4.90", "/images/hero.jpg", 35, "EXTERIEUR"),
  plant("Orchidée Phalaenopsis", "orchidee-phalaenopsis", "Une orchidée aux fleurs délicates pour une pièce claire.", "26.90", "/images/calatea.jpg", 10, "PLANTE_FLEURIE"),
  plant("Kalanchoé", "kalanchoe", "Une petite plante fleurie qui aime la lumière et les arrosages modérés.", "9.50", "/images/aloe.jpg", 20, "PLANTE_FLEURIE"),
  plant("Violette Africaine", "violette-africaine", "Une plante compacte qui offre une floraison colorée en intérieur.", "11.90", "/images/pilea.jpg", 13, "PLANTE_FLEURIE"),
  plant("Bromélia", "bromelia", "Une plante tropicale reconnaissable à son inflorescence vive.", "23.90", "/images/monstera.jpg", 7, "PLANTE_FLEURIE"),
  plant("Ficus Lyrata", "ficus-lyrata", "Ses grandes feuilles en forme de violon structurent la décoration.", "42.00", "/images/ficus.jpg", 5, "INTERIEUR"),
  plant("Ficus Ginseng", "ficus-ginseng", "Un bonsaï d’intérieur au tronc sculptural et au feuillage dense.", "28.90", "/images/ficus.jpg", 9, "INTERIEUR"),
  plant("Monstera Adansonii", "monstera-adansonii", "Une plante grimpante aux feuilles ajourées, à palisser ou laisser retomber.", "22.50", "/images/monstera.jpg", 11, "INTERIEUR"),
  plant("Alocasia Zebrina", "alocasia-zebrina", "Une plante tropicale remarquable par ses tiges rayées.", "31.90", "/images/philodendron.jpg", 6, "INTERIEUR"),
  plant("Tradescantia Zebrina", "tradescantia-zebrina", "Une plante retombante aux feuilles violettes et argentées.", "12.90", "/images/philodendron.jpg", 17, "INTERIEUR"),
  plant("Peperomia Obtusifolia", "peperomia-obtusifolia", "Une plante compacte au feuillage épais, facile à placer sur un bureau.", "15.50", "/images/pilea.jpg", 16, "INTERIEUR"),
  plant("Maranta Leuconeura", "maranta-leuconeura", "Ses feuilles nervurées se replient légèrement le soir.", "20.90", "/images/calatea.jpg", 8, "INTERIEUR"),
  plant("Dieffenbachia", "dieffenbachia", "Un feuillage panaché qui apporte du volume à un intérieur lumineux.", "23.50", "/images/philodendron.jpg", 10, "INTERIEUR"),
  plant("Schefflera Arboricola", "schefflera-arboricola", "Un arbuste d’intérieur au feuillage palmé et à la croissance généreuse.", "26.90", "/images/ficus.jpg", 7, "INTERIEUR"),
  plant("Yucca Elephantipes", "yucca-elephantipes", "Un petit arbre résistant qui apprécie les emplacements lumineux.", "35.90", "/images/strelitzia.jpg", 6, "INTERIEUR"),
  plant("Aglaonema", "aglaonema", "Une plante décorative aux feuilles panachées et aux tons variés.", "24.90", "/images/calatea.jpg", 9, "INTERIEUR"),
  plant("Ceropegia Woodii", "ceropegia-woodii", "Une plante retombante aux petites feuilles en forme de cœur.", "17.90", "/images/pothos.jpg", 12, "INTERIEUR"),
  plant("Ctenanthe Burle-Marxii", "ctenanthe-burle-marxii", "Un feuillage graphique aux motifs contrastés pour une lumière douce.", "25.90", "/images/calatea.jpg", 8, "INTERIEUR"),
  plant("Fittonia", "fittonia", "Une plante compacte aux nervures colorées, idéale en terrarium.", "8.50", "/images/pilea.jpg", 21, "INTERIEUR"),
  plant("Passiflore", "passiflore", "Une plante grimpante à la floraison spectaculaire pour l’extérieur.", "18.90", "/images/hero.jpg", 7, "PLANTE_FLEURIE"),
  plant("Géranium Lierre", "geranium-lierre", "Une plante fleurie retombante adaptée aux balcons et jardinières.", "8.90", "/images/hero.jpg", 26, "PLANTE_FLEURIE"),
  plant("Calathea Lancifolia", "calathea-lancifolia", "Ses feuilles ondulées et tachetées décorent une pièce lumineuse.", "21.90", "/images/calatea.jpg", 7, "INTERIEUR"),
  plant("Bégonia Rex", "begonia-rex", "Un feuillage décoratif aux motifs et aux couleurs remarquables.", "18.50", "/images/philodendron.jpg", 9, "PLANTE_FLEURIE"),
  plant("Calathea Makoyana", "calathea-makoyana", "Ses feuilles rondes présentent des motifs délicats et contrastés.", "23.90", "/images/calatea.jpg", 6, "INTERIEUR"),
  plant("Calathea Roseopicta", "calathea-roseopicta", "Un feuillage velouté aux nervures rosées pour une lumière douce.", "24.90", "/images/calatea.jpg", 7, "INTERIEUR"),
  plant("Philodendron Pink Princess", "philodendron-pink-princess", "Un philodendron rare au feuillage vert ponctué de rose.", "39.90", "/images/philodendron.jpg", 4, "INTERIEUR"),
  plant("Monstera Thai Constellation", "monstera-thai-constellation", "Une monstera panachée aux feuilles marbrées de crème.", "69.90", "/images/monstera.jpg", 3, "INTERIEUR"),
  plant("Rhipsalis", "rhipsalis", "Un cactus épiphyte retombant qui préfère une lumière tamisée.", "18.90", "/images/cactus.jpg", 9, "INTERIEUR"),
  plant("Alocasia Polly", "alocasia-polly", "Un feuillage sombre et nervuré qui apporte du relief à la pièce.", "27.90", "/images/philodendron.jpg", 6, "INTERIEUR"),
  plant("Orchidée Dendrobium", "orchidee-dendrobium", "Une orchidée élégante aux grappes de fleurs colorées.", "29.90", "/images/calatea.jpg", 5, "PLANTE_FLEURIE"),
];

async function main() {
  const slugs = products.map((product) => product.slug);

  if (products.length !== 60 || new Set(slugs).size !== products.length) {
    throw new Error("Le seed doit contenir exactement 60 produits sans doublon.");
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  const activeProductCount = await prisma.product.count({
    where: { active: true },
  });

  console.log(
    `${products.length} produits de démonstration synchronisés. ${activeProductCount} produits actifs dans le catalogue.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
