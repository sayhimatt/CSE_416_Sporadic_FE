import React from "react";
import { Route, Redirect } from "react-router-dom";

const GuardedRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (authenticated ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

export default GuardedRoute;
