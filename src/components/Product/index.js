import { CartContext } from "@/src/state/CartContext";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { FaSpinner } from 'react-icons/fa';

const Product = (el) => {
  const { cartState, removeFromCart, addToCart } = useContext(CartContext);

  const [loading, setLoading] = useState(false);

  const handleCartOperation = async (operation) => {
    setLoading(true);
    await operation;
    setLoading(false);
  };

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
            onClick={() => handleCartOperation(addToCart(el))}
            className="m-1 px-4 py-2 text-sm bg-gray-600 w-52 flex items-center justify-center
          hover:bg-gray-400  hover:text-black hover:border border text-white rounded 
		        transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 "
            disabled={loading}
          >
            {!loading ? "Добавить товар в корзину" : <FaSpinner className="text-lg animate-spin"/> }
          </button>
        ) : (
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleCartOperation(addToCart(el))}
              className="m-1 px-4 py-2 text-sm bg-gray-600
            hover:bg-gray-400  hover:text-black hover:border border text-white rounded 
		          transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 "
              disabled={loading}
            >
              <AiOutlinePlus />
            </button>

            <span className="mx-5">
              {!loading ? cartState[el.id] : <FaSpinner className="text-lg animate-spin"/>}
            </span>

            <button
              onClick={() => handleCartOperation(removeFromCart(el))}
              className="m-1 px-4 py-2 text-sm bg-gray-600
            hover:bg-gray-400  hover:text-black hover:border border text-white rounded 
              transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300 "
              disabled={loading}
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
