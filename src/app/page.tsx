import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <section className="text-center">
        <p className="mb-4 font-medium text-green-700">
          Bienvenue chez Plantify Garden
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
          Faites entrer la nature chez vous
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Découvrez notre sélection de plantes pour embellir votre intérieur et
          votre jardin.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-block rounded-lg bg-green-700 px-6 py-3 font-medium text-white transition hover:bg-green-800"
        >
          Découvrir nos plantes
        </Link>
      </section>
    </main>
  );
}
