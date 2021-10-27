import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router";

import Button from "../../../components/Button/Button";
import "../styles.css";

const MainCreateAccount = () => {
  const history = useHistory();
  const inputRef = useRef();
  const [credentials, setCredentials] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [showMsg, setShowMsg] = useState({
    ruleMsg: false,
    checkMsg: false,
    errorMsg: false,
    matchMsg: false,
  });

  const createAccount = async () => {
    setShowMsg((prevState) => {
      return {...prevState, errorMsg: false};
    });
    if (credentials.password !== credentials.passwordConfirm) {
      setShowMsg((prevState) => {
        return {...prevState, matchMsg: true}
      });
      return;
    } else {
      setShowMsg((prevState) => {
        return {...prevState, matchMsg: false}
      });
    }
    try {
      await axios
        .post("https://cse-416-sporadic-api-prod.herokuapp.com/users/", {
          username: credentials.username,
          password: credentials.password,
          email: credentials.email,
        })
        .then((res) => {
          history.push({
            pathname: "/createAccount/confirmation",
            state: { username: credentials.username },
          });
        })
        .catch((error) => setShowMsg((prevState) => {
          return {...prevState, errorMsg: true};
        }));
    } catch (error) {
      console.log(error);
    }
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
                    setShowMsg((prevState) => {
                      return {
                        ...prevState,
                        ruleMsg: (e.target.value.length > 0 && e.target.value.length < 8),
                        checkMsg: (credentials.passwordConfirm.length > 0 && (credentials.passwordConfirm !== e.target.value)),
                      }
                    });
                    console.log(e.target.value);
                    console.log(e.target.value.length);
                    return { ...prevState, password: e.target.value };
                  });
                }}
              ></input>
            </div>
            {showMsg.ruleMsg ? 
              <div className="passwordMsg" >
                <p>Password must be at least 8 characters long</p>
              </div> 
            : null}
            <div className="inputBox">
              <input
                id="passwordConfirm"
                className="textInput"
                placeholder="Confirm Password"
                type="password"
                onChange={(e) => {
                  setCredentials((prevState) => {
                    setShowMsg((prevState) => {
                      return {...prevState, checkMsg: (e.target.value.length > 0 && (credentials.password !== e.target.value))}
                    });
                    return { ...prevState, passwordConfirm: e.target.value };
                  });
                }}
              ></input>
            </div>
            {showMsg.checkMsg ?
              <div className="passwordMsg" >
                <p>Passwords do not match</p>
              </div>  
            : null}             
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
      {showMsg.errorMsg ?
          <div className="errorMsg" >
            <p>Could not create account</p>
          </div>  
        : null}  
        {showMsg.matchMsg ?
          <div className="errorMsg" >
            <p>Passwords do not match</p>
          </div>  
        : null}  
    </div>
  );
};

export default MainCreateAccount;
