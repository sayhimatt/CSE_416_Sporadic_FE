import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AuthContextProvider from "./contexts/AuthContext/AuthContext";
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
import Quiz from "./pages/Quiz/Quiz";
import CreateQuiz from "./pages/CreateQuiz/CreateQuiz";
import MyAccount from "./pages/MyAccount/MyAccount";
import QuizComplete from "./pages/Quiz/QuizComplete";
import Friends from "./pages/Friends/Friends";
import { authenticate } from "./API/API";

import "./App.scss";

const App = () => {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    authenticate().then(setAuth(true));
  }, []);

  return (
    <AuthContextProvider>
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route exact path="/createAccount" component={CreateAccount} />
          <Route exact path="/createAccount/confirmation" component={ConfirmEmail} />
          <Route exact path="/forgotPassword" component={ForgotPassword} />
          <Route exact path="/forgotPassword/confirmation" component={ForgotPasswordConfirmation} />
          <GuardedRoute exact path="/" component={Feed} authenticated={auth} />
          <GuardedRoute exact path="/myAccount" component={MyAccount} authenticated={auth} />
          <GuardedRoute exact path="/About" component={Feed} authenticated={auth} />
          <GuardedRoute exact path="/Contact" component={Feed} authenticated={auth} />
          <GuardedRoute exact path="/friends" component={Friends} authenticated={auth} />
          <GuardedRoute exact path="/p/:platform" component={Platform} authenticated={auth} />
          <GuardedRoute
            exact
            path="/createPlatform"
            component={CreatePlatform}
            authenticated={auth}
          />
          <GuardedRoute
            exact
            path="/p/:platform/createQuiz"
            component={CreateQuiz}
            authenticated={auth}
          />
          <GuardedRoute exact path="/p/:platform/:quiz" component={Quiz} authenticated={auth} />
          <GuardedRoute
            exact
            path="/p/:platform/:quiz/complete"
            component={QuizComplete}
            authenticated={auth}
          />
          <GuardedRoute path="/" component={NotFound} authenticated={auth} />
        </Switch>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
