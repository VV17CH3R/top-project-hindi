import { useState } from "react";
import toast from "react-hot-toast";
import { db } from "../utils/dbClient";

const useCart = () => {
  const [cartState, setCartState] = useState({});

  const fetchCurrentCart = async () => {
    const { data: cart, error: cartError } = await db
      .from("cart")
      .select("*")
      .eq("owner", db.auth.session().user.email);

    if (cartError) {
      toast.error(cartError.message);
      return;
    }

    setCartState(
      cart.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.product_id]: curr.quantity,
        }),
        {}
      )
    );
  };

  const addToCart = async (product) => {
    let error;

    if (cartState[product.id]) {
      const { error: updateError } = await db
        .from("cart")
        .update({
          quantity: cartState[product.id] + 1,
        })
        .eq("owner", db.auth.session().user.email)
        .eq("product_id", product.id);

      error = updateError;
    } else {
      const { error: insertError } = await db.from("cart").insert([
        {
          product_id: product.id,
          quantity: cartState[product.id] || 0 + 1,
          owner: db.auth.session().user.email,
        },
      ]);

      error = insertError;
    }

    if (error) {
      return toast.error(error.message);
    }

    await fetchCurrentCart();
  };

  const removeFromCart = async (product) => {
    let error;

    if (cartState[product.id] > 1) {
      const { data, error: updateError } = await db
        .from("cart")
        .update({
          quantity: cartState[product.id] - 1,
        })
        .eq("owner", db.auth.session().user.email)
        .eq("product_id", product.id);

      error = updateError;
    } else {
      const { data, error: delError } = await db
        .from("cart")
        .delete()
        .eq("owner", db.auth.session().user.email)
        .eq("product_id", product.id);

      error = delError;
    }

    if (error) {
      return toast.error(error.message);
    }

    await fetchCurrentCart();
  };

  const clearCart = async () => {
    const { error } = await db
      .from("cart")
      .delete()
      .eq("owner", db.auth.session().user.email);
    setCartState({});

    if(error) return toast.error(error.message);
  };

  return {
    cartState,
    clearCart,
    addToCart,
    removeFromCart,
    setCartState,
    fetchCurrentCart,
  };
};

export default useCart;
