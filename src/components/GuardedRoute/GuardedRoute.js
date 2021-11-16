import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../../contexts/UserContext/UserContext";

const GuardedRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (authenticated ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

export default GuardedRoute;
