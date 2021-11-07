import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

import { postConfirmCode } from "../../API/API";
import Button from "../../components/Button/Button";
import ErrorMessage from  "../../components/ErrorMessage/ErrorMessage";
import LoadingOverlay from "../../components/LoadingIndicators/LoadingOverlay";

import "./styles.css";

const ConfirmEmail = () => {
  const history = useHistory();
  const [confirmation, setConfirmation] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const confirmCode = async () => {
    setIsLoading(true);
    await postConfirmCode(history.location.state.username, confirmation)
      .then((res) => history.push("/login"))
      .catch((e) => { 
        setShowMsg(true); 
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
                id="confirmation"
                className="textInput"
                placeholder="Confirmation Code"
                onChange={(e) => {
                  setConfirmation(e.target.value);
                }}
              ></input>
            </div>
          </div>
          <Button type="button" onClick={confirmCode}>
            Confirm
          </Button>
        </form>
        <div className="d-flex flex-column mt-2 align-items-center">
          <div>Already Logged In?</div>
          <div className="links d-flex flex-row justify-content-around mt-1">
            <Link className="link color-secondary" to="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
      <ErrorMessage 
        visible={showMsg} 
        errorStyle="errorBox" 
        text="Invalid Code"/>     
      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
};

export default ConfirmEmail;
