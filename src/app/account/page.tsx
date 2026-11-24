import { Suspense } from "react";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/authorization";

const orderStatusLabels = {
  PENDING: "En attente de traitement",
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
} as const;

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
          Chargement du compte...
        </main>
      }
    >
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#68806b]">
        Mon espace
      </p>
      <h1 className="mt-2 text-3xl font-bold text-[#34523d]">Mon compte</h1>
      <p className="mb-8 mt-3 text-[#667568]">Bienvenue, {user.name}.</p>

      <section className="rounded-2xl border border-[#e5eade] bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-[#2d4634]">
          Mes informations
        </h2>
        <p className="mb-2">
          <strong>Nom :</strong> {user.name}
        </p>
        <p>
          <strong>Email :</strong> {user.email}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[#2d4634]">
          Mes commandes
        </h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-[#667568]">Vous n’avez pas encore de commande.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-[#e5eade] bg-white p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#2d4634]">
                      Commande {order.orderNumber}
                    </h3>
                    <p className="mt-1 text-sm text-[#667568]">
                      {order.createdAt.toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#f1f4ec] px-3 py-1 text-sm text-[#526455]">
                    {orderStatusLabels[order.status]}
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[#526455]">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-4">
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span>
                        {(item.unitPrice.toNumber() * item.quantity).toFixed(2)} €
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-right font-semibold text-[#315e3d]">
                  Total : {order.total.toNumber().toFixed(2)} €
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
