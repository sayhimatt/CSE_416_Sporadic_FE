import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Auth } from "aws-amplify";

import GuardedRoute from "./components/GuardedRoute/GuardedRoute";
import Feed from "./pages/Feed/Feed";
import Login from "./pages/Login/MainLogin/MainLogin";
import CreateAccount from "./pages/Login/MainCreateAccount/MainCreateAccount";
import ConfirmEmail from "./pages/Login/ConfirmEmail";

import "./App.scss";

const MainRouter = () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    try {
      await Auth.currentSession();
      console.log("Logged in");
      setAuth(true);
    } catch (e) {
      console.log("Failed login");
    }
  };

  const logout = async () => {
    await Auth.signOut();
    setAuth(false);
  };

  const login = async (username, password) => {
    try {
      const success = await Auth.signIn(username, password);
      console.log(success);
      setAuth(true);
    } catch (error) {
      console.log("error signing in", error);
      window.alert("Invalid Login");
    }
  };

  return (
    <Router>
      <Switch>
        <Route
          path="/login"
          component={() => <Login auth={auth} loginHandler={login} />}
        />
        <Route exact path="/createAccount" component={CreateAccount} />
        <Route
          exact
          path="/createAccount/confirmation"
          component={ConfirmEmail}
        />
        <GuardedRoute
          path="/"
          auth={auth}
          component={() => <Feed logoutHandler={logout} />}
        ></GuardedRoute>
        <GuardedRoute
          path="/About"
          auth={auth}
          component={() => <Feed logoutHandler={logout} />}
        ></GuardedRoute>
        <GuardedRoute
          path="/Contact"
          auth={auth}
          component={() => <Feed logoutHandler={logout} />}
        ></GuardedRoute>
      </Switch>
    </Router>
  );
};

export default MainRouter;
