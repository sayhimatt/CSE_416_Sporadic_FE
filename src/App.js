import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Auth } from "aws-amplify";

import GuardedRoute from "./components/GuardedRoot/GuardedRoot";
import MainNav from "./components/NavBar/MainNav/MainNav";
import Footer from "./components/Footer/Footer";
import Feed from "./pages/Feed/Feed";
import Login from "./pages/Login/MainLogin/MainLogin";

const MainRouter = () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      console.log("Logged in");
      setAuth(true);
    } catch (e) {
      console.log("Failed login");
    }
  }

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
          exact
          path="/login"
          component={() => <Login loginHandler={login} />}
        />
        <MainNav />
        <GuardedRoute path="/" auth={auth} component={Feed}></GuardedRoute>
        <GuardedRoute path="/About" auth={auth} component={Feed}></GuardedRoute>
        <GuardedRoute
          path="/Contact"
          auth={auth}
          component={Feed}
        ></GuardedRoute>
        <Footer />
      </Switch>
    </Router>
  );
};

export default MainRouter;
