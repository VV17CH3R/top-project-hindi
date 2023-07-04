import { CartContext } from "@/src/state/CartContext";
import Image from "next/image";
import React, { useContext } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

const Product = (el) => {
  const { cartState, removeFromCart, addToCart } = useContext(CartContext);

  return (
    <div
      key={el.id}
      className="hover:border-2 transition transform hover:scale-105 
	flex-col flex space-y-2 p-4 border border-gray-400 hover:border-black"
    >
      <h3 className="text-xl font-semibold">{el.name}</h3>
      <p className="truncate">{el.description}</p>
      <div className="aspect-video relative">
        {el.image && (
          <Image src={el.image} alt={el.name} layout="fill" objectFit="cover" />
        )}
      </div>
      <p>
        <span className="m-2">₽{el.price}</span>
      </p>
      <div className="flex flex-row">
        <button
          className="m-1 px-4 py-2 text-base bg-gray-600
          hover:bg-gray-400  hover:text-black hover:border border text-white rounded 
		  transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 mr-auto"
        >
          Купить
        </button>
        {!cartState[el.id] ? (
          <button
            onClick={() => addToCart(el)}
            className="m-1 px-4 py-2 text-sm bg-gray-600
          hover:bg-gray-400  hover:text-black hover:border border text-white rounded 
		  transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 "
          >
            Добавить товар в корзину
          </button>
        ) : (
          <div className="flex items-center justify-center">
            <button
              onClick={() => addToCart(el)}
              className="m-1 px-4 py-2 text-sm bg-gray-600
          hover:bg-gray-400  hover:text-black hover:border border text-white rounded 
		  transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 "
            >
              <AiOutlinePlus />
            </button>

            <span className="mx-5">
              {cartState[el.id]}
            </span>

            <button
              onClick={() => removeFromCart(el)}
              className="m-1 px-4 py-2 text-sm bg-gray-600
        hover:bg-gray-400  hover:text-black hover:border border text-white rounded 
    transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 "
            >
              <AiOutlineMinus />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
