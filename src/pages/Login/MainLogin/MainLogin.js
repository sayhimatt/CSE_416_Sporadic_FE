import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Button from "../../../components/Button/Button";
import "../styles.css";
import "./styles.css";

const MainLogin = ({ children, loginHandler }) => {
  const history = useHistory();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

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
              await loginHandler(credentials.username, credentials.password);
              history.push("/homepage");
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
    </div>
  );
};

export default MainLogin;
