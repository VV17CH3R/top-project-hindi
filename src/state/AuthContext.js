import { createContext, useEffect, useReducer } from "react";
import React from "react";
import { db } from "../utils/dbClient";

const initialAuthState = {
  isModalOpen: false,
  formType: "sign",
  session: null,
};

export const AuthContext = createContext(initialAuthState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_AUTH_MODAL":
      return {
        ...state,
        formType: action.formType,
        isModalOpen: true,
      };
    case "CLOSE_AUTH_MODAL":
      return {
        ...state,
        isModalOpen: false,
      };
    case "LOGIN":
      return {
        ...state,
        session: action.session,
      };
    case "LOGOUT" : {
        return {
            ...state,
            session: null,
        }
    }
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    dispatch({ type: 'LOGIN', session: db.auth.session() });
    db.auth.onAuthStateChange((event, session) => {
      dispatch({ type: 'LOGIN', session });
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
