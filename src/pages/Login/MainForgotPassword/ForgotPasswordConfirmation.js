import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";

import Button from "../../../components/Button/Button";

import "../styles.css";

const ForgotPasswordConfirmation = () => {
  const history = useHistory();
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState({
    password: "",
    passwordConfirm: "",
  })
  const [showMsg, setShowMsg] = useState({
    ruleMsg: false,
    checkMsg: false,
  });
  const ForgotPasswordConfirmation = async () => {
    try {
      const success = await Auth.forgotPasswordSubmit(history.location.state.username, confirmation, password.password)
      history.push({
        pathname: "/login",
      })
    } catch (error) {
      console.log("error sending code", error);
      window.alert("Invalid input");
    }
  }

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
                        ruleMsg: (e.target.value.length > 0 && e.target.value.length < 8),
                        checkMsg: (password.passwordConfirm.length > 0 && (password.passwordConfirm !== e.target.value)),
                      }
                    });
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
                placeholder="Confirm New Password"
                type="password"
                onChange={(e) => {
                  setPassword((prevState) => {
                    setShowMsg((prevState) => {
                      return {...prevState, checkMsg: (e.target.value.length > 0 && (password.password !== e.target.value))}
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
    </div>
  )
}
export default ForgotPasswordConfirmation;