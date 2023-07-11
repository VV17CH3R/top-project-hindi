import useForm from "@/src/hooks/useForm";
import { AuthContext } from "@/src/state/AuthContext";
import { showErrorToast } from "@/src/utils";
import { db } from "@/src/utils/dbClient";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";

const Auth = () => {
  const {
    state: { formType },
    dispatch,
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const { form, handleChange, resetForm } = useForm({
    full_name: "",
    password: "",
    email: "",
    phone: null,
  });

  const handlerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formType === "sign") {
      const { error: signUpError } = await db.auth.signUp(
        {
          email: form.email,
          password: form.password,
        },
        {
          full_name: form.name,
        }
      );

      if (signUpError) {
        return showErrorToast(signUpError.message, setLoading);
      }

      await db.from("user").insert([
        {
          full_name: form.full_name,
          email: form.email.toLowerCase(),
          phone: Number(form.phone),
        },
      ]);
    } else {
      const { error } = await db.auth.signIn({
        email: form.email,
        password: form.password,
      });

      if (error) {
        return showErrorToast(error.message, setLoading);
      }
    }

    toast.success(`
      ${
        formType === "sign"
          ? "Вы успешно зарегестрировались."
          : "Вы успешно вошли."
      }
    `);
    resetForm();
    setLoading(false);
    dispatch({ type: "CLOSE_AUTH_MODAL" });
  };

  return (
    <div className="my-2">
      <form
        onSubmit={handlerSubmit}
        className="flex flex-col gap-y-1 justify-center"
      >
        {formType === "sign" && (
          <>
            <label htmlFor="full_name">Имя</label>
            <input
              className="outline-black border rounded p-2 border-gray-500"
              htmlFor="full_name"
              name="full_name"
              id="full_name"
              placeholder=" Ваше имя..."
              value={form.full_name}
              onChange={handleChange}
              required={formType === "sign"}
              minLength={2}
              disabled={loading}
            />
            <label htmlFor="phone">Телефон</label>
            <div> 
              <input
                className="outline-black border rounded p-2 border-gray-500"
                htmlFor="phone"
                name="phone"
                id="phone"
                placeholder="89876543210 "
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required={formType === "sign"}
                minLength={10}
                maxLength={14}
                disabled={loading}
              />
            </div>
          </>
        )}
        <label htmlFor="email">Электонная почта</label>
        <input
          required
          className="outline-black border rounded border-gray-500 p-2"
          htmlFor="email"
          name="email"
          id="email"
          placeholder=" Эл. почта..."
          value={form.email}
          onChange={handleChange}
          minLength={6}
          disabled={loading}
        />
        <label htmlFor="password">Пароль</label>
        <input
          required
          placeholder=" Пароль..."
          className="outline-black border rounded p-2 border-gray-500"
          htmlFor="password"
          name="password"
          id="password"
          type="password"
          onChange={handleChange}
          value={form.password}
          minLength={4}
          disabled={loading}
        />
        <button
          className={`m-1 px-4 py-2 text-sm bg-gray-600
                    hover:bg-gray-400  hover:text-black hover:border border text-white rounded 
                    transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110  duration-300
                    ${
                      loading
                        ? "cursor-not-allowed animate-pulse"
                        : "cursor-pointer"
                    }
                  `}
          type="sybmit"
        >
          {loading
            ? "Загрузка... "
            : formType === "sign"
            ? "Регистрация"
            : "Войти"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
