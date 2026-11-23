import { NextResponse } from "next/server";
import { getAllProducts } from "@/features/products/services/product.service";

export async function GET() {
  try {
    const products = await getAllProducts();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);

    return NextResponse.json(
      { message: "Erreur lors de la récupération des produits" },
      { status: 500 },
    );
  }
}
