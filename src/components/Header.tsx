"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/features/cart/context/CartContext";

export default function Header() {
  const router = useRouter();
  const { items } = useCart();
  const { data: session, isPending } = authClient.useSession();
  const [authError, setAuthError] = useState("");
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  async function handleSignOut() {
    setAuthError("");

    try {
      await authClient.signOut();
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      setAuthError("La déconnexion a échoué. Veuillez réessayer.");
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[#e5eade] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center gap-8 px-6 max-sm:gap-3 max-sm:px-4">
        <Link href="/" className="shrink-0" aria-label="Plantify Garden, accueil">
          <Image
            src="/logo.png"
            alt="Plantify Garden"
            width={108}
            height={72}
            priority
            className="h-16 w-24 object-contain max-sm:h-12 max-sm:w-16"
          />
        </Link>

        <nav
          aria-label="Navigation principale"
          className="flex items-center gap-6 text-sm font-medium text-[#526455] max-sm:hidden"
        >
          <Link href="/" className="hover:text-[#315d3b]">
            Accueil
          </Link>
          <Link href="/shop" className="hover:text-[#315d3b]">
            Boutique
          </Link>
          <Link href="/histoire" className="hover:text-[#315d3b]">
            Notre histoire
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4 text-sm max-sm:gap-2">
          {!isPending &&
            (session ? (
              <>
                <Link
                  href="/account"
                  className="font-medium text-[#34523d] hover:underline"
                >
                  {session.user.name}
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="text-[#526455] hover:underline">
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-[#526455] hover:text-[#315d3b] max-sm:hidden"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link href="/login" className="text-[#526455] hover:underline">
                Connexion
              </Link>
            ))}

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full bg-[#315e3d] px-4 py-2 font-semibold text-white hover:bg-[#244b30]"
            aria-label={`Panier, ${cartCount} article${cartCount > 1 ? "s" : ""}`}
          >
            Panier <span>({cartCount})</span>
          </Link>
        </div>
      </div>
      {authError && (
        <p role="alert" className="mx-auto max-w-7xl px-6 pb-2 text-sm text-red-700">
          {authError}
        </p>
      )}
    </header>
  );
}
