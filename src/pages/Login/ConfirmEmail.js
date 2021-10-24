import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router";

import Button from "../../components/Button/Button";
import "./styles.css";

const ConfirmEmail = () => {
  const history = useHistory();
  const [confirmation, setConfirmation] = useState("");

  const confirmCode = async () => {
    try {
      const username = history.location.state.username;
      await axios
        .post(
          `https://cse-416-sporadic-api-prod.herokuapp.com/users/${username}/confirm`,
          {
            confirmCode: confirmation,
          }
        )
        .then((res) => history.push("/login"))
        .catch((e) => console.log(e));
    } catch (error) {
      alert("Invalid code");
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
    </div>
  );
};

export default ConfirmEmail;
