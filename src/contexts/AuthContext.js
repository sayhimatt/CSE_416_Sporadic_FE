import React, { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return true;
    case "LOGOUT":
      return false;
    default:
      return state;
  }
};

export const AuthContextProvider = (props) => {
  const [auth, dispatch] = useReducer(authReducer, false, () => {
    const data = localStorage.getItem("auth");
    return data ? data === "true" : false;
  });
  useEffect(() => {
    localStorage.setItem("auth", auth.toString());
  }, [auth]);
  return (
    <AuthContext.Provider value={{ auth, dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
