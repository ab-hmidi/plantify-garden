"use client";
import Link from "next/link";
import Image from "next/image";
import { focusRing, pageContainer } from "../utils/uiClasses";

function Footer() {
  return (
    <footer className="border-t border-[#e9ede5] bg-[#f7f8f3]">
      <div
        className={`${pageContainer} grid grid-cols-[1fr_1.1fr_auto] items-center gap-7 py-7 max-[900px]:grid-cols-2 max-[620px]:grid-cols-1 max-[620px]:gap-[14px] max-[620px]:py-[23px]`}
      >
        <div>
          <a
            className={`inline-flex items-center ${focusRing}`}
            href="#accueil"
          >
            <Image
              className="block h-[62px] w-24 object-contain"
              src="/logo.png"
              alt="Plantify-garden"
              width={96}
              height={62}
            />
          </a>
          <p className="mt-1 text-[11px] text-[#7b867b]">
            Des plantes et des conseils pour un quotidien plus vert.
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          <p className="mt-1 max-w-[260px] text-[11px] leading-[1.6] text-[#7b867b] max-[620px]:mt-0">
            Un peu plus de nature, chaque jour.
          </p>
        </div>
        <p className="text-[10px] text-[#92998e] max-[900px]:col-span-full max-[900px]:m-0 max-[620px]:mt-[3px]">
          © 2026 Plantify-garden · Fait pousser avec amour ·{" "}
          <Link
            href="/image-credits"
            className="underline underline-offset-2 hover:text-[#38503b]"
          >
            Crédits photos
          </Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
