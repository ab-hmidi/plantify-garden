"use client";
import { eyebrow, focusRing, pageContainer } from "../utils/uiClasses";

function Footer() {
  return (
    <>
      <section
        className="scroll-mt-[78px] bg-[#f1f4ec]"
        id="histoire"
        aria-labelledby="story-title"
      >
        <div
          className={`${pageContainer} grid grid-cols-[0.75fr_1.25fr] items-start gap-16 py-[76px] max-[900px]:grid-cols-1 max-[900px]:gap-6 max-[900px]:py-14 max-[620px]:gap-[18px] max-[620px]:py-12`}
        >
          <div>
            <p className={eyebrow}>Notre histoire</p>
            <h2
              id="story-title"
              className="m-0 max-w-[390px] font-sans text-[clamp(29px,3.5vw,40px)] leading-[1.15] font-semibold tracking-[-1.4px] text-[#2d4634]"
            >
              Faire entrer un peu plus de nature chez soi.
            </h2>
          </div>
          <div>
            <p className="mb-6 max-w-[690px] text-sm leading-[1.8] text-[#667568] max-[620px]:text-[13px]">
              Plantify est née d’une idée simple : rendre les plantes faciles à
              découvrir et à choisir. Nous réunissons des plantes d’intérieur et
              des conseils pratiques pour aider chacun à trouver sa prochaine
              compagne de verdure.
            </p>
            <div className="grid grid-cols-3 gap-3 max-[620px]:grid-cols-1">
              <article className="rounded-xl border border-[#e5eade] bg-white/80 px-[14px] py-4">
                <span className="text-xl" aria-hidden="true">
                  🌱
                </span>
                <h3 className="mt-[9px] mb-[5px] text-xs text-[#38503b]">
                  Pour tous les niveaux
                </h3>
                <p className="m-0 text-[10px] leading-[1.6] text-[#7b867b]">
                  Des plantes pour débuter comme pour compléter sa collection.
                </p>
              </article>
              <article className="rounded-xl border border-[#e5eade] bg-white/80 px-[14px] py-4">
                <span className="text-xl" aria-hidden="true">
                  ☀
                </span>
                <h3 className="mt-[9px] mb-[5px] text-xs text-[#38503b]">
                  Des conseils simples
                </h3>
                <p className="m-0 text-[10px] leading-[1.6] text-[#7b867b]">
                  Les repères essentiels pour prendre soin de chaque plante.
                </p>
              </article>
              <article className="rounded-xl border border-[#e5eade] bg-white/80 px-[14px] py-4">
                <span className="text-xl" aria-hidden="true">
                  🏡
                </span>
                <h3 className="mt-[9px] mb-[5px] text-xs text-[#38503b]">
                  Un choix pour chaque pièce
                </h3>
                <p className="m-0 text-[10px] leading-[1.6] text-[#7b867b]">
                  Des idées pour créer un intérieur qui vous ressemble.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-[#e9ede5] bg-[#f7f8f3]">
        <div
          className={`${pageContainer} grid grid-cols-[1fr_1.1fr_auto] items-center gap-7 py-7 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1 max-[620px]:gap-[14px] max-[620px]:py-[23px]`}
        >
          <div>
            <a
              className={`inline-flex items-center ${focusRing}`}
              href="#accueil"
            >
              <img
                className="block h-[62px] w-24 object-contain"
                src="/logo.png"
                alt="Plantify-garden"
              />
            </a>
            <p className="mt-1 text-[11px] text-[#7b867b]">
              Des plantes et des conseils pour un quotidien plus vert.
            </p>
          </div>
          <div className="flex items-center gap-[10px]">
            <span className="text-[21px]" aria-hidden="true">
              🌱
            </span>
            <p className="mt-1 max-w-[260px] text-[11px] leading-[1.6] text-[#7b867b] max-[620px]:mt-0">
              Un peu plus de nature, chaque jour.
            </p>
          </div>
          <p className="text-[10px] text-[#92998e] max-[900px]:col-span-full max-[900px]:m-0 max-[620px]:mt-[3px]">
            © mettre lannée ici Plantify · Fait pousser avec amour
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
