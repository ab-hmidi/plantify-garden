import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AccountPage() {
  // Récupérer la session depuis les cookies de la requête
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Rediriger les visiteurs non connectés
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-4 text-3xl font-bold text-[#34523d]">Mon compte</h1>

      <p className="mb-8 text-gray-600">Bienvenue, {session.user.name} !</p>

      <div className="rounded-xl border border-gray-200 p-6">
        <h2 className="mb-4 text-xl font-semibold">Mes informations</h2>

        <p className="mb-2">
          <strong>Nom :</strong> {session.user.name}
        </p>

        <p>
          <strong>Email :</strong> {session.user.email}
        </p>
      </div>
    </main>
  );
}
