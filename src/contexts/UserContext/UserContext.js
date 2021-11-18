import React, { createContext, useReducer, useEffect } from "react";

export const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        username: action.payload.username,
        subscriptions: action.payload.subscriptions || [],
        profilePicture: action.payload.profilePicture || "/propic.png",
      };
    case "LOGOUT":
      return {};
    case "SUBSCRIBE":
      return { ...state, subscriptions: state.subscriptions.concat([action.payload]) };
    case "UNSUBSCRIBE":
      return {
        ...state,
        subscriptions: state.subscriptions.filter((platform) => platform !== action.payload),
      };
    default:
      return state;
  }
};

export const UserContextProvider = (props) => {
  const [user, dispatch] = useReducer(userReducer, {}, () => {
    const data = JSON.parse(localStorage.getItem("user"));
    return data ? data : {};
  });
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);
  return <UserContext.Provider value={{ user, dispatch }}>{props.children}</UserContext.Provider>;
};

export default UserContextProvider;
