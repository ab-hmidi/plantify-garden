import Link from "next/link";
import photoCredits from "@/features/products/data/photo-credits.json";

export default function ImageCreditsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold text-[#2d4634]">Crédits des photos</h1>
      <p className="mt-3 text-[#667568]">
        Les photos du catalogue sont hébergées localement. Retrouvez ci-dessous
        leurs auteurs, licences et pages sources Wikimedia Commons.
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {photoCredits.map((photo) => (
          <li
            key={photo.slug}
            className="rounded-xl border border-[#e5eade] bg-white p-5"
          >
            <h2 className="font-semibold text-[#2d4634]">{photo.name}</h2>
            <p className="mt-2 text-sm text-[#667568]">{photo.title}</p>
            <p className="mt-2 text-sm text-[#667568]">
              Auteur : {photo.author}
            </p>
            <p className="mt-2 text-sm text-[#667568]">
              Licence :{" "}
              {photo.licenseUrl ? (
                <a
                  href={photo.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  {photo.license}
                </a>
              ) : (
                photo.license
              )}
            </p>
            <Link
              href={photo.source}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-[#315e3d] underline underline-offset-2"
            >
              Voir la source sur Wikimedia Commons
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
