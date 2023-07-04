import { useContext } from "react";
import Layout from "../components/Layout";
import { CartContext } from "../state/CartContext";

const CartPage = () => {
  const { cartWithQuantity, totalPrice } = useContext(CartContext);

  return (
    <>
      <Layout />
      <section className="p-4 gap-y-4">
        <h1 className="text-4xl text-light my-4">Корзина</h1>
        {cartWithQuantity && (
          <div>
            {cartWithQuantity.map((el) => (
              <div key={el.id} className="flex flex-col gap-y-4 ">
                <p>
                  {el.name} x{el.quantity} = ₽ {el.quantity * el.price || 0}
                </p>
              </div>
            ))}
            <p>Итого: {totalPrice || 0}  ₽</p>
          </div>
        )}
      </section>
    </>
  );
};

export default CartPage;
