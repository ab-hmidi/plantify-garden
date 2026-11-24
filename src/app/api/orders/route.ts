import { NextResponse } from "next/server";
import { createOrder } from "@/features/orders/services/order.service";
import { getCurrentUser } from "@/lib/authorization";
import { hasSameOrigin, readJsonObject } from "@/lib/request-validation";

type CheckoutAddress = {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

function parseAddress(
  value: Record<string, unknown> | null,
): CheckoutAddress | null {
  if (!value) {
    return null;
  }

  const { name, phone, address, city, postalCode, country } = value;

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    name.trim().length > 120 ||
    typeof phone !== "string" ||
    phone.trim().length === 0 ||
    phone.trim().length > 40 ||
    typeof address !== "string" ||
    address.trim().length === 0 ||
    address.trim().length > 250 ||
    typeof city !== "string" ||
    city.trim().length === 0 ||
    city.trim().length > 120 ||
    typeof postalCode !== "string" ||
    postalCode.trim().length === 0 ||
    postalCode.trim().length > 24 ||
    typeof country !== "string" ||
    country.trim().length === 0 ||
    country.trim().length > 80
  ) {
    return null;
  }

  return {
    name: name.trim(),
    phone: phone.trim(),
    address: address.trim(),
    city: city.trim(),
    postalCode: postalCode.trim(),
    country: country.trim(),
  };
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json(
      { message: "Origine de requête invalide" },
      { status: 403 },
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { message: "Connectez-vous pour passer commande" },
      { status: 401 },
    );
  }

  const address = parseAddress(await readJsonObject(request));

  if (!address) {
    return NextResponse.json(
      { message: "Les informations de livraison sont invalides" },
      { status: 400 },
    );
  }

  try {
    const order = await createOrder(user.id, user.email, address);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "CART_EMPTY") {
        return NextResponse.json(
          { message: "Votre panier est vide" },
          { status: 409 },
        );
      }

      if (
        error.message === "PRODUCT_UNAVAILABLE" ||
        error.message === "INSUFFICIENT_STOCK"
      ) {
        return NextResponse.json(
          { message: "Un produit n'est plus disponible dans la quantité demandée" },
          { status: 409 },
        );
      }
    }

    console.error("Erreur lors de la création de la commande :", error);
    return NextResponse.json(
      { message: "Impossible de créer la commande" },
      { status: 500 },
    );
  }
}
