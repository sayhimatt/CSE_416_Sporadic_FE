import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";

import Button from "../../../components/Buttons/Button/Button";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import LoadingOverlay from "../../../components/LoadingIndicators/LoadingOverlay";

import "../styles.css";

const MainForgotPassword = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  const forgotPassword = async () => {
    setIsLoading(true);
    try {
      const success = await Auth.forgotPassword(username);
      history.push({
        pathname: "/forgotPassword/confirmation",
        state: { username: username },
      });
    } catch (error) {
      console.log(error);
      setShowMsg(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => setIsLoading(false);
  }, []);

  return (
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
                  setUsername(e.target.value);
                }}
              ></input>
            </div>
          </div>
          <Button
            type="button"
            onClick={async () => {
              await forgotPassword();
            }}
          >
            Send Code
          </Button>
        </form>
        <div className="links d-flex flex-row justify-content-around">
          <Link className="link" to="/createAccount">
            Create Account
          </Link>
          <Link className="link" to="/login">
            Login
          </Link>
        </div>
      </div>
      <ErrorMessage visible={showMsg} errorStyle="errorBox" text="Invalid Username" />
      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
};
export default MainForgotPassword;
