import React, { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { authenticated: true, username: action.payload };
    case "LOGOUT":
      return { authenticated: false, username: "" };
    default:
      return state;
  }
};

export const AuthContextProvider = (props) => {
  const [auth, dispatch] = useReducer(authReducer, { authenticated: false, username: "" }, () => {
    const data = JSON.parse(localStorage.getItem("auth"));
    return data ? data : { authenticated: false, username: "" };
  });
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);
  return <AuthContext.Provider value={{ auth, dispatch }}>{props.children}</AuthContext.Provider>;
};

export default AuthContextProvider;
