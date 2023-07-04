import { AuthContext } from "@/src/state/AuthContext";
import { CartContext } from "@/src/state/CartContext";
import { db } from "@/src/utils/dbClient";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import Auth from "../Auth";
import Modal from "../Modal";

const Layout = ({ children }) => {
  const router = useRouter();

  const {
    state: { isModalOpen, formType, session },
    dispatch,
  } = useContext(AuthContext);

  const { totalCartItems } = useContext(CartContext);

  const handleLogout = async () => {
    await db.auth.signOut();
    dispatch({ type: "LOGOUT" });
    router.push("/");
  };

  return (
    <div className="w-full h-full flex flex-col">
      <header
        className="bg-gray-200 w-full h-16 flex justify-end space-x-4 px-2 
      items-center"
      >
        <Link
          href="/"
          className="mr-auto text-xl select-none font-bold cursor-pointer"
        >
          {`Для партнеров "ПЭТ ПРОДАШН"`}
        </Link>
        {!session && (
          <>
            <div>
              <button
                className="px-4 py-2 text-lg bg-black
          hover:bg-slate-900 border-black text-white rounded"
                onClick={() =>
                  dispatch({
                    type: "OPEN_AUTH_MODAL",
                    formType: "sign",
                  })
                }
              >
                Регистрация
              </button>
            </div>
            <div>
              <button
                className="px-4 py-2 text-lg bg-black
          hover:bg-slate-900 border-black text-white rounded"
                onClick={() =>
                  dispatch({
                    type: "OPEN_AUTH_MODAL",
                    formType: "login",
                  })
                }
              >
                Войти
              </button>
            </div>
          </>
        )}
        <div>
          {session && (
            <>
              <button
                className="px-4 mx-3 py-2 text-lg bg-black
          hover:bg-slate-900 border-black text-white rounded"
                onClick={() => {
                  router.push("/admin");
                }}
              >
                Админ
              </button>
              <Link
                href="/cart"
                className="px-4 py-2 text-lg mx-6
        hover:bg-slate-300 border-black text-black rounded"
              >
                Корзина  { totalCartItems }
              </Link>
              <button
                className="px-4 py-2 text-lg bg-black
        hover:bg-slate-900 border-black text-white rounded"
                onClick={handleLogout}
              >
                Выйти
              </button>
            </>
          )}
        </div>
      </header>

      <Modal
        isOpen={isModalOpen}
        closeModal={() =>
          dispatch({
            type: "CLOSE_AUTH_MODAL",
          })
        }
        title="Регистрация"
      >
        <Auth />
      </Modal>

      {children}
    </div>
  );
};

export default Layout;
