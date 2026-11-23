"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import { useEffect } from "react";

export type CartItem = {
  productId: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | {
      type: "ADD_ITEM";
      productId: number;
    }
  | {
      type: "REMOVE_ITEM";
      productId: number;
    }
  | {
      type: "INCREMENT_ITEM";
      productId: number;
      stock: number;
    }
  | {
      type: "DECREMENT_ITEM";
      productId: number;
    }
  | {
      type: "SET_CART";
      items: CartItem[];
    };

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  incrementItem: (productId: number) => Promise<void>;
  decrementItem: (productId: number) => Promise<void>;
};

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.productId === action.productId,
      );

      if (existingItem) {
        if (existingItem.quantity >= action.stock) {
          return state;
        }

        return {
          items: state.items.map((item) =>
            item.productId === action.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      if (action.stock <= 0) {
        return state;
      }

      return {
        items: [...state.items, { productId: action.productId, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (item) => item.productId !== action.productId,
        ),
      };
    case "INCREMENT_ITEM": {
      const existingItem = state.items.find(
        (item) => item.productId === action.productId,
      );

      if (!existingItem || existingItem.quantity >= action.stock) {
        return state;
      }

      return {
        items: state.items.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };
    }

    case "DECREMENT_ITEM":
      return {
        items: state.items
          .map((item) =>
            item.productId === action.productId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    case "SET_CART":
      return {
        items: action.items,
      };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  useEffect(() => {
    async function loadCart() {
      try {
        const response = await fetch("/api/cart");

        if (!response.ok) {
          throw new Error("Impossible de récupérer le panier");
        }

        const cart = await response.json();

        dispatch({
          type: "SET_CART",
          items: cart.items.map(
            (item: { productId: number; quantity: number }) => ({
              productId: item.productId,
              quantity: item.quantity,
            }),
          ),
        });
      } catch (error) {
        console.error("Erreur lors du chargement du panier :", error);
      }
    }

    loadCart();
  }, []);

  async function addItem(productId: number) {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Impossible d'ajouter le produit");
    }

    await refreshCart();
  }

  async function removeItem(productId: number) {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Impossible de supprimer le produit");
      }

      await refreshCart();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  }

  async function incrementItem(productId: number) {
    try {
      const currentItem = state.items.find(
        (item) => item.productId === productId,
      );

      if (!currentItem) return;

      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: currentItem.quantity + 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Impossible d'augmenter la quantité");
      }

      await refreshCart();
    } catch (error) {
      console.error("Erreur lors de l'augmentation :", error);
    }
  }

  async function decrementItem(productId: number) {
    try {
      const currentItem = state.items.find(
        (item) => item.productId === productId,
      );

      if (!currentItem) return;

      if (currentItem.quantity === 1) {
        await removeItem(productId);
        return;
      }

      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: currentItem.quantity - 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible de diminuer la quantité");
      }

      await refreshCart();
    } catch (error) {
      console.error("Erreur lors de la diminution :", error);
    }
  }

  async function refreshCart() {
    const response = await fetch("/api/cart");

    if (!response.ok) {
      throw new Error("Impossible de récupérer le panier");
    }

    const cart = await response.json();

    dispatch({
      type: "SET_CART",
      items: cart.items.map(
        (item: { productId: number; quantity: number }) => ({
          productId: item.productId,
          quantity: item.quantity,
        }),
      ),
    });
  }
  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        decrementItem,
        incrementItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }

  return context;
}
