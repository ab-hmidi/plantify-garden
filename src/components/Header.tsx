"use client";
import { useCart } from "@/features/cart/context/CartContext";
import { focusRing, pageContainer } from "../utils/uiClasses";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type HeaderProps = {
  cartCount: number;
  onCartOpen: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onHome: (section: string) => void;
  isViewingProduct: boolean;
};

const links = [
  { label: "Accueil", href: "#accueil" },
  { label: "Nos plantes", href: "#plantes" },
  { label: "Notre histoire", href: "#histoire" },
];

export default function Header({
  onCartOpen,
  searchQuery,
  onSearchChange,
  onHome,
  isViewingProduct,
}: HeaderProps) {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
    router.refresh();
  }

  const { items } = useCart();

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  return (
    <header className="sticky top-0 z-10 border-b border-[#edf0e9] bg-white/95 backdrop-blur-[14px]">
      <div
        className={`${pageContainer} flex min-h-[88px] items-center gap-[42px] max-[900px]:gap-6 max-[620px]:min-h-[66px] max-[620px]:gap-[10px]`}
      >
        <a
          className={`inline-flex shrink-0 items-center ${focusRing}`}
          href="#accueil"
          aria-label="Plantify, accueil"
          onClick={(event) => {
            event.preventDefault();
            onHome("accueil");
          }}
        >
          <img
            className="block h-[72px] w-[108px] object-contain max-[620px]:h-[43px] max-[620px]:w-16"
            src="/logo.png"
            alt="Plantify-garden"
          />
        </a>

        <nav
          className="flex items-center gap-8 max-[900px]:gap-[18px] max-[620px]:hidden"
          aria-label="Navigation principale"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium text-[#637066] no-underline transition-colors hover:text-[#315d3b] max-[900px]:text-xs ${focusRing}`}
              onClick={
                isViewingProduct
                  ? (event) => {
                      event.preventDefault();
                      onHome(link.href.slice(1));
                    }
                  : undefined
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-[14px] max-[900px]:gap-2 max-[620px]:gap-1">
          <label className="flex h-[42px] w-[220px] items-center gap-[9px] rounded-full border border-[#e8ece5] bg-[#fbfcfa] px-[13px] text-[#7d897e] focus-within:border-[#9eb18d] max-[900px]:w-[175px] max-[620px]:h-[38px] max-[620px]:w-[min(34vw,150px)] max-[620px]:gap-[5px] max-[620px]:px-[9px]">
            <span className="text-[22px] leading-none" aria-hidden="true">
              ⌕
            </span>
            <input
              type="search"
              placeholder="Rechercher une plante"
              aria-label="Rechercher une plante"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className={`w-full min-w-0 bg-transparent p-0 text-xs text-[#2d3f32] outline-none placeholder:text-[#929b91] max-[620px]:text-[11px] ${focusRing}`}
            />
          </label>
          <div className="flex items-center gap-3 text-sm">
            {!isPending &&
              (session ? (
                <>
                  <span className="font-medium text-[#34523d] max-[620px]:hidden">
                    Bonjour, {session.user.name}
                  </span>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-[#637066] hover:text-[#315d3b]"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-[#637066] hover:text-[#315d3b]"
                  >
                    Connexion
                  </Link>

                  <Link
                    href="/register"
                    className="text-[#637066] hover:text-[#315d3b] max-[620px]:hidden"
                  >
                    Inscription
                  </Link>
                </>
              ))}
          </div>
          <button
            className={`relative grid size-[42px] shrink-0 place-items-center rounded-full border-0 bg-transparent text-[#34523d] transition-colors hover:bg-[#f0f4ed] max-[620px]:size-9 ${focusRing}`}
            type="button"
            aria-label={`Ouvrir le panier, ${cartCount} article${cartCount > 1 ? "s" : ""}`}
            onClick={onCartOpen}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-[22px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.5L21 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            {cartCount > 0 && (
              <Link
                href="/cart"
                className="font-medium text-gray-700 hover:text-green-700"
              >
                {cartCount}
              </Link>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
