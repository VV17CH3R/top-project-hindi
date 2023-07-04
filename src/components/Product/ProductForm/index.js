import useForm from "@/src/hooks/useForm";
import { db } from "@/src/utils/dbClient";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

const ProductForm = () => {
  const { form, handleChange, resetForm } = useForm({
    name: "",
    price: "",
    description: "",
    image: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);
  const imageFileRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);

  const uploadImage = async () => {
    const imgName = `${Date.now()}-${imageFile.name}`;
    const { error } = await db.storage
      .from("products")
      .upload(`images/${imgName}`, imageFile, {
        cacheControl: '3600',
        upsert: false,
      });
    if (error) return toast.error(error.message);

    const { publicURL } = db.storage.from("products").getPublicUrl(`images/${imgName}`);
      
    return new URL(publicURL).href;
  };



  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image.size > 2000000) {
      toast.error('Картинка должна быть не более 2MB');
      return
    }
    setImageFile(image);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    let publicUrl = "";

    if (imageFile) {
      publicUrl = await uploadImage();
    }

    const { data, error } = await db.from("product").insert([
      {
        name: form.name,
        price: form.price,
        description: form.description,
        image: publicUrl,
        stock: form.stock,
      },
    ]);

    if(error) {
      return toast.error(error.message);
    }

    toast.success("Продукт успешно добавлен");
    imageFileRef.current.value = "";
    resetForm();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmitProduct} className="mx-auto w-96 space-y-4">
      <div className="my-8">
        <label htmlFor="name" className="font-bold text-xl ">
          Название продукта
        </label>
        <input
          className="outline-black border rounded p-2 border-gray-500 w-full"
          type="text"
          name="name"
          id="name"
          placeholder=" ..."
          onChange={handleChange}
          value={form.name}
          required
        ></input>
      </div>
      <div>
        <label className="font-bold text-lg" htmlFor="price">
          Цена
        </label>
        <input
          className="outline-black border rounded p-2 border-gray-500 w-full"
          type="number"
          name="price"
          id="price"
          placeholder=" руб."
          onChange={handleChange}
          value={form.price}
          required
        ></input>
      </div>
      <div>
        <label className="font-bold text-lg" htmlFor="stock">
          Количество
        </label>
        <input
          className="outline-black border rounded p-2 border-gray-500 w-full"
          type="number"
          name="stock"
          id="stock"
          placeholder=" ед."
          onChange={handleChange}
          value={form.stock}
          required
        ></input>
      </div>
      <div>
        <label className="font-bold text-lg" htmlFor="description">
          Описание
        </label>
        <textarea
          className="outline-black border rounded p-2 border-gray-500 w-full"
          type="text"
          name="description"
          id="description"
          placeholder="Описание..."
          rows="7"
          onChange={handleChange}
          value={form.description}
        ></textarea>
      </div>
      <div>
        <label className="font-bold text-lg" htmlFor="image">
          Картинка
        </label>
        <input
          accept="image/*"
          className=" p-2 border-gray-500 w-full"
          type="file"
          name="image"
          id="image"
          ref={imageFileRef}
          onChange={handleImageChange}
        />
      </div>
      <button
        type="submit"
        className={`m-1 px-4 py-2 w-full text-sm bg-gray-600
                    hover:bg-gray-400  hover:text-black hover:border border text-white rounded 
                    transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300
                    ${
                      loading
                        ? "cursor-not-allowed animate-pulse"
                        : "cursor-pointer"
                    }
                  `}
      >
        Добавить продукт
      </button>
    </form>
  );
};

export default ProductForm;
