import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

import { postCreateAccount } from "../../../API/API";
import Button from "../../../components/Button/Button";
import "../styles.css";

const MainCreateAccount = () => {
  const history = useHistory();
  const [credentials, setCredentials] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });

  const createAccount = async () => {
    if (credentials.password !== credentials.passwordConfirm) {
      alert("Passwords do not match.");
      return;
    }
    await postCreateAccount(
      credentials.username,
      credentials.password,
      credentials.email
    )
      .then((res) => {
        history.push({
          pathname: "/createAccount/confirmation",
          state: { username: credentials.username },
        });
      })
      .catch((error) => console.log(error));
  };

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
                    return { ...prevState, password: e.target.value };
                  });
                }}
              ></input>
            </div>
            <div className="inputBox">
              <input
                id="passwordConfirm"
                className="textInput"
                placeholder="Confirm Password"
                type="password"
                onChange={(e) => {
                  setCredentials((prevState) => {
                    return { ...prevState, passwordConfirm: e.target.value };
                  });
                }}
              ></input>
            </div>
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
    </div>
  );
};

export default MainCreateAccount;
