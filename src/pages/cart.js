import { useContext } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { AuthContext } from "../state/AuthContext";
import { CartContext } from "../state/CartContext";
import { db } from "../utils/dbClient";

const CartPage = () => {
  const { cartWithQuantity, totalPrice } = useContext(CartContext);

  const { dispatch } = useContext(AuthContext);

  const handleCheckout = async () => {
    if (!db.auth.session()) {
      dispatch({
        type: "OPEN_AUTH_MODAL",
        formType: "login",
      });
      return toast.error("Войдите чтобы продолжить");
    }

    const { data: user, error: userError } = await db
      .from("user")
      .select("*")
      .eq("email", db.auth.session().user.email);

    if (userError) {
      toast.error(userError.message);
    }

    await db.from("order").insert([
      {
        user_phone: user[0].phone,
        user_id: user[0].id,
        status: "in_process",
        total_price: Number(totalPrice)
      },
    ]);

    const { data: orderItems, error: orderItemsError } = await db
      .from("cart")
      .select(
        `
          quantity, 
          product(
            id,
            price
          ),
          owner
        `
      )
      .eq("owner", db.auth.session().user.email);

    if (orderItemsError) {
      toast.error(orderItemsError.message);
    }

    const { data: order, error: orderError } = await db
      .from("order")
      .select(
        `
          id
        `
      )
      .eq("user_id", user[0].id)
      .eq("status", "in_process")

    if (orderError) {
      toast.error(orderError.message);
    }

    const orderId = order[0].id;

    const cartToOrder = orderItems.map((el) => ({
        order_id: orderId,
        product_id: el.product.id,
        user_email: el.owner,
        quantity: el.quantity,
        total: el.quantity * el.product.price
    }));

    await db.from("order_item").insert(cartToOrder);
 
    await db.from("order").update([{
      status: "on_moderation"
    }]).eq("user_id", user[0].id)
    

    await db.from("cart").delete().eq("owner", db.auth.session().user.email);
  };

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
            <p>Итого: {totalPrice || 0} ₽</p>
            <button
              className="m-1 w-96 my-10 px-4 py-2 text-sm bg-gray-600
            hover:bg-gray-400  hover:text-black hover:border border text-white rounded 
              transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 "
              onClick={handleCheckout}
            >
              Заказ
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default CartPage;
