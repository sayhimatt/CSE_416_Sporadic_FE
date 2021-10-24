import React, { createContext, useReducer } from "react";

const AuthContext = createContext();

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

const AuthContextProvider = (props) => {
  const [auth, dispatch] = useReducer(authReducer, false);
  return (
    <AuthContext.Provider value={(auth, dispatch)}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
