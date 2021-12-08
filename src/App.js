import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import UserContextProvider from "./contexts/UserContext/UserContext";
import GuardedRoute from "./components/GuardedRoute/GuardedRoute";
import UnguardedRoute from "./components/UnguardedRoute/UnguardedRoute";
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
import ManageSubscribers from "./pages/ManageSubscribers/ManageSubscribers";
import ContactUs from "./pages/ContactUs/ContactUs";
import About from "./pages/About/About";
import SearchResults from "./pages/SearchResults/SearchResults";
import Profile from "./pages/Profile/Profile";
import AdminPanel from "./pages/AdminPanel/AdminPanel";
import AwardCase from "./pages/AwardCase/AwardCase";
import { authenticate } from "./API/API";

import "./App.scss";

const App = () => {
  const [auth, setAuth] = useState({ authenticated: false, complete: false });

  useEffect(() => {
    authenticate()
      .then((res) => setAuth({ authenticated: true, complete: true }))
      .catch((e) => setAuth({ authenticated: false, complete: true }));
  }, []);

  const setAuthHandler = (booleanValue) => {
    setAuth((prevState) => ({ ...prevState, authenticated: booleanValue }));
  };

  return (
    auth.complete && (
      <UserContextProvider>
        <Router>
          <Switch>
            <Route exact path="/login">
              <Login auth={auth.authenticated} authHandler={setAuthHandler} />
            </Route>
            <UnguardedRoute
              exact
              path="/createAccount"
              component={CreateAccount}
              authenticated={auth.authenticated}
            />
            <UnguardedRoute
              exact
              path="/createAccount/confirmation"
              component={ConfirmEmail}
              authenticated={auth.authenticated}
            />
            <UnguardedRoute
              exact
              path="/forgotPassword"
              component={ForgotPassword}
              authenticated={auth.authenticated}
            />
            <UnguardedRoute
              exact
              path="/forgotPassword/confirmation"
              component={ForgotPasswordConfirmation}
            />
            <GuardedRoute exact path="/" component={Feed} authenticated={auth.authenticated} />
            <GuardedRoute
              exact
              path="/myAccount"
              component={MyAccount}
              authenticated={auth.authenticated}
            />
            <GuardedRoute
              exact
              path="/awardCase"
              component={AwardCase}
              authenticated={auth.authenticated}
            />
            <GuardedRoute
              exact
              path="/About"
              component={About}
              authenticated={auth.authenticated}
            />
            <GuardedRoute
              exact
              path="/Contact"
              component={ContactUs}
              authenticated={auth.authenticated}
            />
            <GuardedRoute
              exact
              path="/friends"
              component={Friends}
              authenticated={auth.authenticated}
            />
            <GuardedRoute
              exact
              path="/p/:platform"
              component={Platform}
              authenticated={auth.authenticated}
            />
            <GuardedRoute
              exact
              path="/createPlatform"
              component={CreatePlatform}
              authenticated={auth.authenticated}
            />
            <GuardedRoute
              exact
              path="/p/:platform/createQuiz"
              component={CreateQuiz}
              authenticated={auth.authenticated}
            />
            <GuardedRoute
              exact
              path="/p/:platform/subscribers"
              component={ManageSubscribers}
              authenticated={auth.authenticated}
            />
            <GuardedRoute
              exact
              path="/p/:platform/:quiz"
              component={Quiz}
              authenticated={auth.authenticated}
            />
            <GuardedRoute
              exact
              path="/p/:platform/:quiz/complete"
              component={QuizComplete}
              authenticated={auth.authenticated}
            />
            <GuardedRoute exact path="/" component={Feed} authenticated={auth.authenticated} />
            <GuardedRoute
              exact
              path="/search"
              component={SearchResults}
              authenticated={auth.authenticated}
            />
            <GuardedRoute
              exact
              path="/user/:username"
              component={Profile}
              authenticated={auth.authenticated}
            />
            <GuardedRoute
              exact
              path="/adminPanel"
              component={AdminPanel}
              authenticated={auth.authenticated}
            />
            <GuardedRoute path="/" component={NotFound} authenticated={auth.authenticated} />
          </Switch>
        </Router>
      </UserContextProvider>
    )
  );
};

export default App;
