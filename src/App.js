import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AuthContextProvider from "./contexts/AuthContext";
import GuardedRoute from "./components/GuardedRoute/GuardedRoute";
import Feed from "./pages/Feed/Feed";
import Login from "./pages/Login/MainLogin/MainLogin";
import CreateAccount from "./pages/Login/MainCreateAccount/MainCreateAccount";
import ConfirmEmail from "./pages/Login/ConfirmEmail";

import "./App.scss";

const MainRouter = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route exact path="/createAccount" component={CreateAccount} />
          <Route
            exact
            path="/createAccount/confirmation"
            component={ConfirmEmail}
          />
          <GuardedRoute path="/" component={Feed}></GuardedRoute>
          <GuardedRoute path="/About" component={Feed}></GuardedRoute>
          <GuardedRoute path="/Contact" component={Feed}></GuardedRoute>
        </Switch>
      </Router>
    </AuthContextProvider>
  );
};

export default MainRouter;
