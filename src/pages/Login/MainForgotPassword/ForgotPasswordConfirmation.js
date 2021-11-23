import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";

import Button from "../../../components/Buttons/Button/Button";
import LoadingOverlay from "../../../components/LoadingIndicators/LoadingOverlay";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import "../styles.css";

const ForgotPasswordConfirmation = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState({
    password: "",
    passwordConfirm: "",
  });
  const [showMsg, setShowMsg] = useState({
    lengthText: false,
    matchText: false,
    lengthBox: false,
    matchBox: false,
    errorBox: false,
  });
  const ForgotPasswordConfirmation = async () => {
    setShowMsg((prevState) => {
      return { ...prevState, errorBox: false };
    });

    setShowMsg((prevState) => {
      return { ...prevState, lengthBox: password.password.length < 8 };
    });

    setShowMsg((prevState) => {
      return { ...prevState, matchBox: password.password !== password.passwordConfirm };
    });

    if (password.password.length < 8 || password.password !== password.passwordConfirm) return;

    setIsLoading(true);

    try {
      const success = await Auth.forgotPasswordSubmit(
        history.location.state.username,
        confirmation,
        password.password,
      );
      history.push({
        pathname: "/login",
      });
    } catch (error) {
      setShowMsg((prevState) => {
        return { ...prevState, errorBox: true };
      }),
        console.log(error),
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
                id="code"
                className="textInput"
                placeholder="Confirmation Code"
                onChange={(e) => {
                  setConfirmation(e.target.value);
                }}
              ></input>
            </div>
            <div className="inputBox">
              <input
                id="password"
                className="textInput"
                placeholder="New Password"
                type="password"
                onChange={(e) => {
                  setPassword((prevState) => {
                    setShowMsg((prevState) => {
                      return {
                        ...prevState,
                        lengthText: e.target.value.length > 0 && e.target.value.length < 8,
                        matchText:
                          password.passwordConfirm.length > 0 &&
                          password.passwordConfirm !== e.target.value,
                      };
                    });
                    return { ...prevState, password: e.target.value };
                  });
                }}
              ></input>
            </div>
            <ErrorMessage
              visible={showMsg.lengthText}
              errorStyle="errorText"
              text="Password must be at least 8 characters long"
            />
            <div className="inputBox">
              <input
                id="passwordConfirm"
                className="textInput"
                placeholder="Confirm New Password"
                type="password"
                onChange={(e) => {
                  setPassword((prevState) => {
                    setShowMsg((prevState) => {
                      return {
                        ...prevState,
                        matchText:
                          e.target.value.length > 0 && password.password !== e.target.value,
                      };
                    });
                    return { ...prevState, passwordConfirm: e.target.value };
                  });
                }}
              ></input>
            </div>
            <ErrorMessage
              visible={showMsg.matchText}
              errorStyle="errorText"
              text="Passwords do not match"
            />
          </div>
          <Button type="button" onClick={ForgotPasswordConfirmation}>
            Submit
          </Button>
        </form>
        <div className="links d-flex flex-row justify-content-around">
          <Link className="link" to="/login">
            Log In
          </Link>
        </div>
      </div>
      <ErrorMessage visible={showMsg.errorBox} errorStyle="errorBox" text="Invalid Code" />
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
export default ForgotPasswordConfirmation;
