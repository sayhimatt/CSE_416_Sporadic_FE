import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AuthContextProvider from "./contexts/AuthContext";
import GuardedRoute from "./components/GuardedRoute/GuardedRoute";
import Feed from "./pages/Feed/Feed";
import Login from "./pages/Login/MainLogin/MainLogin";
import CreateAccount from "./pages/Login/MainCreateAccount/MainCreateAccount";
import ConfirmEmail from "./pages/Login/ConfirmEmail";
import ForgotPassword from "./pages/Login/MainForgotPassword/MainForgotPassword";
import ForgotPasswordConfirmation from "./pages/Login/MainForgotPassword/ForgotPasswordConfirmation";
import Platform from "./pages/Platform/Platform";
import NotFound from "./pages/NotFound/NotFound";
import CreatePlatform from "./pages/CreatePlatform/CreatePlatform";

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
          <Route exact path="/forgotPassword" component={ForgotPassword} />
          <Route exact path="/forgotPassword/confirmation"
            component={ForgotPasswordConfirmation}
          />
          <GuardedRoute exact path="/" component={Feed}></GuardedRoute>
          <GuardedRoute exact path="/About" component={Feed}></GuardedRoute>
          <GuardedRoute exact path="/Contact" component={Feed}></GuardedRoute>
          <GuardedRoute exact path="/p/:platform" component={Platform} />
          <GuardedRoute
            exact
            path="/createPlatform"
            component={CreatePlatform}
          />
          <GuardedRoute path="/" component={NotFound} />
        </Switch>
      </Router>
    </AuthContextProvider>
  );
};

export default MainRouter;
