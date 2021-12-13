import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import ReactDOM from "react-dom";
import { postCreateAccount } from "../../../API/API";
import Button from "../../../components/Buttons/Button/Button";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import ErrorText from "../../../components/ErrorMessage/ErrorText";
import LoadingOverlay from "../../../components/LoadingIndicators/LoadingOverlay";
import "../styles.css";
import { resolveConfig } from "prettier";

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
    lengthBox: false,
    matchBox: false,
    errorBox: false,
  });

  const usernameReqsTextContainer = document.querySelector('#usernameReqsTextDiv');
  const lengthTextContainer = document.querySelector("#lengthTextDiv");
  const matchTextContainer = document.querySelector("#matchTextDiv");

  const checkUsernameInput = (input) => {
    if (!input.match(/^[a-z0-9]*$/))
      ReactDOM.render(<ErrorText text="Username may only contain lowercase letters and numbers" />, usernameReqsTextContainer);
    else ReactDOM.unmountComponentAtNode(usernameReqsTextContainer);
  };

  const checkPasswordInput = (input) => {
    if (input.length > 0 && input.length < 8)
      ReactDOM.render(
        <ErrorText text="Password must be at least 8 characters long" />,
        lengthTextContainer,
      );
    else ReactDOM.unmountComponentAtNode(lengthTextContainer);

    if (credentials.passwordConfirm.length > 0 && credentials.passwordConfirm !== input)
      ReactDOM.render(<ErrorText text="Passwords do not match" />, matchTextContainer);
    else ReactDOM.unmountComponentAtNode(matchTextContainer);
  };

  const checkConfirmInput = (input) => {
    if (input.length > 0 && credentials.password !== input)
      ReactDOM.render(<ErrorText text="Passwords do not match" />, matchTextContainer);
    else ReactDOM.unmountComponentAtNode(matchTextContainer);
  };

  const createAccount = async () => {
    setShowMsg((prevState) => {
      return { ...prevState, errorBox: false };
    });

    setShowMsg((prevState) => {
      return { ...prevState, lengthBox: credentials.password.length < 8 };
    });

    setShowMsg((prevState) => {
      return { ...prevState, matchBox: credentials.password !== credentials.passwordConfirm };
    });

    console.log(showMsg.errorBox, showMsg.lengthBox, showMsg.matchBox);

    if (credentials.password.length < 8 || credentials.password !== credentials.passwordConfirm)
      return;

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
                  checkUsernameInput(e.target.value);
                  setCredentials((prevState) => {
                    return { ...prevState, username: e.target.value };
                  });
                }}
              ></input>
            </div>
            <div id="usernameReqsTextDiv" />
            <div className="inputBox">
              <input
                id="password"
                className="textInput"
                placeholder="Password"
                type="password"
                onChange={(e) => {
                  checkPasswordInput(e.target.value);
                  setCredentials((prevState) => {
                    return { ...prevState, password: e.target.value };
                  });
                }}
              ></input>
            </div>
            <div id="lengthTextDiv" />
            <div className="inputBox">
              <input
                id="passwordConfirm"
                className="textInput"
                placeholder="Confirm Password"
                type="password"
                onChange={(e) => {
                  checkConfirmInput(e.target.value);
                  setCredentials((prevState) => {
                    return { ...prevState, passwordConfirm: e.target.value };
                  });
                }}
              ></input>
            </div>
            <div id="matchTextDiv" />
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
        text="Could not create account"
      />
      <ErrorMessage
        visible={showMsg.lengthBox}
        errorStyle="errorBox"
        text="Password is not long enough"
      />
      <ErrorMessage
        visible={showMsg.matchBox}
        errorStyle="errorBox"
        text="Passwords do not match"
      />
      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
};

export default MainCreateAccount;
