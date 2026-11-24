import AdminProductManager from "@/features/admin/components/AdminProductManager";

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-[#68806b]">
        Espace administrateur
      </p>
      <h1 className="mt-2 text-3xl font-bold text-[#2d4634]">
        Produits et stock
      </h1>
      <p className="mt-3 max-w-2xl text-[#667568]">
        Gérez le catalogue, les prix et les quantités disponibles.
      </p>
      <AdminProductManager />
    </main>
  );
}
