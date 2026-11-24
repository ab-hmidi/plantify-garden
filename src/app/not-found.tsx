import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <span className="text-6xl">🌱</span>

      <h1 className="mt-6 text-4xl font-bold text-gray-900">
        Oups ! Page introuvable
      </h1>

      <p className="mt-4 max-w-md text-gray-600">
        Cette page ou ce produit n&apos;existe pas. Mais ne t&apos;inquiète pas, d&apos;autres
        belles plantes t&apos;attendent !
      </p>

      <Link
        href="/shop"
        className="mt-8 rounded-lg bg-green-700 px-6 py-3 font-medium text-white transition hover:bg-green-800"
      >
        Découvrir la boutique
      </Link>
    </main>
  );
}
