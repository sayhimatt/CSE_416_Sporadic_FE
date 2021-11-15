import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory, Redirect } from "react-router-dom";
import { Auth } from "aws-amplify";

import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import Button from "../../../components/Button/Button";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import { getUser, getUserIcon } from "../../../API/API";

import "../styles.css";
import LoadingOverlay from "../../../components/LoadingIndicators/LoadingOverlay";

const MainLogin = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const { auth, dispatch } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    return () => setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      await Auth.signIn(username, password);
      const user = await getUser(username);
      const profilePicture = await getUserIcon(username);
      dispatch({
        type: "LOGIN",
        payload: {
          username: user.username,
          subscriptions: user.subscriptions,
          profilePicture: profilePicture,
        },
      });
    } catch (error) {
      setShowMsg(true);
      console.log("error signing in", error);
      setIsLoading(false);
    }
  };

  return auth.authenticated ? (
    <Redirect to="/" />
  ) : (
    <div className="page d-flex flex-column align-items-center justify-content-start">
      <div className="logo">
        <img className="logoImage" src="/logo.svg" alt="logo" />
      </div>
      <div className="loginContainer d-flex flex-column">
        <form className="loginForm d-flex flex-column">
          <div className="inputs d-flex flex-column">
            <div className="inputBox">
              <input
                id="username"
                className="textInput"
                placeholder="Username"
                onChange={(e) => {
                  setCredentials((prevState) => {
                    return { ...prevState, username: e.target.value };
                  });
                }}
              ></input>
            </div>
            <div className="inputBox">
              <input
                id="password"
                className="textInput"
                placeholder="Password"
                type="password"
                onChange={(e) => {
                  setCredentials((prevState) => {
                    return { ...prevState, password: e.target.value };
                  });
                }}
              ></input>
            </div>
          </div>
          <Button
            type="button"
            onClick={async () => {
              await login(credentials.username, credentials.password);
            }}
          >
            Log In
          </Button>
        </form>
        <div className="links d-flex flex-row justify-content-around">
          <Link className="link" to="/createAccount">
            Create Account
          </Link>
          <Link className="link" to="/forgotPassword">
            Forgot Password
          </Link>
        </div>
      </div>
      <ErrorMessage visible={showMsg} errorStyle="errorBox" text="Invalid Login" />
      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
};

export default MainLogin;
