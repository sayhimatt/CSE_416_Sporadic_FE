import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import "./styles.css";
const { auth, dispatch } = useContext(AuthContext);
const NavBar = () => {
  return (
    <div className="navBar">
      <div className="logo">
        <Link to="/">
          <img src="/logo.svg" alt="placeholder" />
        </Link>
      </div>
      <div className="searchBar">
        <input className="search" placeholder="Search"></input>
      </div>
      <div className="rightNav">
        <div className="rightNavItems">
          <div className="account">
            <img
              className="profilePicture"
              src="/propic.png"
              alt="placeholder"
            />
            <div className="navText">${auth.username}</div>
          </div>
          <div className="subscriptionDropdown">
            <div className="navText">Subscription</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
