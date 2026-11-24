import { Suspense } from "react";
import { redirect } from "next/navigation";
import CheckoutForm from "@/features/orders/components/CheckoutForm";
import { getCurrentUser } from "@/lib/authorization";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
          Chargement...
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

async function CheckoutContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/checkout");
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#68806b]">
        Finalisation
      </p>
      <h1 className="mt-2 text-3xl font-bold text-[#2d4634]">
        Adresse de livraison
      </h1>
      <p className="mt-3 text-[#667568]">
        La commande est enregistrée sans paiement en ligne. Le stock est
        vérifié au moment de la validation.
      </p>
      <CheckoutForm defaultName={user.name} />
    </main>
  );
}
