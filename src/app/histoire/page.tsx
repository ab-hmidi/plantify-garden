import type { Metadata } from "next";
import { eyebrow, pageContainer } from "@/utils/uiClasses";

export const metadata: Metadata = {
  title: "Notre histoire",
  description:
    "Découvrez l'histoire et les engagements de Plantify Garden pour rendre les plantes faciles à choisir.",
};

const commitments = [
  {
    icon: "🌱",
    title: "Pour tous les niveaux",
    description:
      "Des plantes pour débuter comme pour compléter sa collection.",
  },
  {
    icon: "☀",
    title: "Des conseils simples",
    description: "Les repères essentiels pour prendre soin de chaque plante.",
  },
  {
    icon: "🏡",
    title: "Un choix pour chaque pièce",
    description: "Des idées pour créer un intérieur qui vous ressemble.",
  },
];

export default function StoryPage() {
  return (
    <main className="flex-1 bg-[#f1f4ec]">
      <section
        className={`${pageContainer} grid grid-cols-[0.75fr_1.25fr] items-start gap-16 py-[76px] max-[900px]:grid-cols-1 max-[900px]:gap-6 max-[900px]:py-14 max-[620px]:gap-[18px] max-[620px]:py-12`}
        aria-labelledby="story-title"
      >
        <div>
          <p className={eyebrow}>Notre histoire</p>
          <h1
            id="story-title"
            className="m-0 max-w-[390px] font-sans text-[clamp(29px,3.5vw,40px)] leading-[1.15] font-semibold tracking-[-1.4px] text-[#2d4634]"
          >
            Faire entrer un peu plus de nature chez soi.
          </h1>
        </div>
        <div>
          <p className="mb-6 max-w-[690px] text-sm leading-[1.8] text-[#667568] max-[620px]:text-[13px]">
            Plantify est née d’une idée simple : rendre les plantes faciles à
            découvrir et à choisir. Nous réunissons des plantes d’intérieur et
            des conseils pratiques pour aider chacun à trouver sa prochaine
            compagne de verdure.
          </p>
          <div className="grid grid-cols-3 gap-3 max-[620px]:grid-cols-1">
            {commitments.map((commitment) => (
              <article
                key={commitment.title}
                className="rounded-xl border border-[#e5eade] bg-white/80 px-[14px] py-4"
              >
                <span className="text-xl" aria-hidden="true">
                  {commitment.icon}
                </span>
                <h2 className="mt-[9px] mb-[5px] text-xs text-[#38503b]">
                  {commitment.title}
                </h2>
                <p className="m-0 text-[10px] leading-[1.6] text-[#7b867b]">
                  {commitment.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
