import useCart from "../hooks/useCart";
import { ProductsContext } from "./ProductsContext";

const { createContext, useMemo, useContext, useEffect } = require("react");

export const CartContext = createContext({
  cartState: {},
  removeFromCart: () => {},
  addToCart: () => {},
  clearCart: () => {},
  totalCartItems: 0,
  cartWithQuantity: [],
  totalPrice: 0,
});

const CartContextProvider = ({ children }) => {
  const { productsList } = useContext(ProductsContext);


  const { setCartState, fetchCurrentCart, cartState, removeFromCart, addToCart, clearCart } =
    useCart();

  useEffect(() => {
    (async () => {
      await fetchCurrentCart();
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartState]);

  const totalCartItems = useMemo(() => {
    return Object.values(cartState)
      .filter((el) => typeof el === "number")
      .reduce((prev, curr) => prev + curr, 0);
  }, [cartState]);


  const { totalPrice, cartWithQuantity } = useMemo(() => {
    if (!productsList) return [];
    const cartWithQuantity = Object.keys(cartState)
    .map((el) => {
      return {
        ...productsList.find((product) => product.id === +el),
        quantity: cartState[el],
      };
    });

    const totalPrice = cartWithQuantity

    .reduce((prev, curr) => {
      return prev + +curr.price * +curr.quantity;
    }, 0);

    return {
      totalPrice,
      cartWithQuantity,
    };
  }, [productsList, cartState]);

  return (
    <CartContext.Provider
      value={{
        setCartState,
        cartState,
        removeFromCart,
        addToCart,
        clearCart,
        totalCartItems,
        totalPrice,
        cartWithQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
