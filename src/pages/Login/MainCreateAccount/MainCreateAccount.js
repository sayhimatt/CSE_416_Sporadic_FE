import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

import { postCreateAccount } from "../../../API/API";
import Button from "../../../components/Button/Button";
import ErrorMessage from  "../../../components/ErrorMessage/ErrorMessage";
import LoadingOverlay from "../../../components/LoadingIndicators/LoadingOverlay";
import "../styles.css";

const MainCreateAccount = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const [credentials, setCredentials] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [showMsg, setShowMsg] = useState({
    ruleText: false,
    checkText: false,
    errorBox: false,
    matchBox: false,
    lengthBox: false,
  });

  const createAccount = async () => {
    setShowMsg((prevState) => {
      return { ...prevState, errorBox: false };
    });

    setShowMsg((prevState) => {
      return { ...prevState, lengthBox: (credentials.password.length < 8) };
    });

    setShowMsg((prevState) => {
      return { ...prevState, matchBox: (credentials.password !== credentials.passwordConfirm) };
    });

    if (showMsg.matchBox || showMsg.lengthBox) return;


    setIsLoading(true);

    await postCreateAccount(credentials.username, credentials.password, credentials.email)
      .then(() => {
        history.push({
          pathname: "/createAccount/confirmation",
          state: { username: credentials.username },
        });
      })
      .catch((error) => {
        setShowMsg((prevState) => {
          return { ...prevState, errorBox: true };
        }, console.log(error));
        setIsLoading(false);
      });
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
                id="email"
                className="textInput"
                placeholder="Email"
                onChange={(e) => {
                  setCredentials((prevState) => {
                    return { ...prevState, email: e.target.value };
                  });
                }}
              ></input>
            </div>
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
                    setShowMsg((prevState) => {
                      return {
                        ...prevState,
                        ruleText: e.target.value.length > 0 && e.target.value.length < 8,
                        checkMsg:
                          credentials.passwordConfirm.length > 0 &&
                          credentials.passwordConfirm !== e.target.value,
                      };
                    });
                    return { ...prevState, password: e.target.value };
                  });
                }}
              ></input>
            </div>
            <ErrorMessage 
              visible={showMsg.ruleText} 
              errorStyle="errorText" 
              text="Password must be at least 8 characters long">
            </ErrorMessage>          
            <div className="inputBox">
              <input
                id="passwordConfirm"
                className="textInput"
                placeholder="Confirm Password"
                type="password"
                onChange={(e) => {
                  setCredentials((prevState) => {
                    setShowMsg((prevState) => {
                      return {
                        ...prevState,
                        checkMsg:
                          e.target.value.length > 0 && credentials.password !== e.target.value,
                      };
                    });
                    return { ...prevState, passwordConfirm: e.target.value };
                  });
                }}
              ></input>
            </div>
            <ErrorMessage 
              visible={showMsg.checkMsg} 
              errorStyle="errorText" 
              text="Passwords do not match">
            </ErrorMessage>
          </div>
          <Button type="button" onClick={createAccount}>
            Create Account
          </Button>
        </form>
        <div className="links d-flex flex-row justify-content-around">
          <Link className="link" to="/login">
            Log In
          </Link>
        </div>
      </div>
      <ErrorMessage 
        visible={showMsg.errorBox} 
        errorStyle="errorBox" 
        text="Could not create account">
      </ErrorMessage>
      <ErrorMessage 
        visible={showMsg.lengthBox} 
        errorStyle="errorBox" 
        text="Password is not long enough">
      </ErrorMessage>
      <ErrorMessage 
        visible={showMsg.matchBox} 
        errorStyle="errorBox" 
        text="Passwords do not match">
      </ErrorMessage>
      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
};

export default MainCreateAccount;
