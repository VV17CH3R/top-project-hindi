import "@/src/styles/globals.css";
import { Toaster } from "react-hot-toast";
import AuthContextProvider from "../state/AuthContext";
import CartContextProvider from "../state/CartContext";
import ProductsContextProvider from "../state/ProductsContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <ProductsContextProvider>
        <CartContextProvider>
          <Toaster />
          <Component {...pageProps} />
        </CartContextProvider>
      </ProductsContextProvider>
    </AuthContextProvider>
  );
}
