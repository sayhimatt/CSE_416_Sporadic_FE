import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";
import { AuthContext } from "../../../contexts/AuthContext";
import Feed from "../../../pages/Feed/Feed";

const NavBar = () => {
  const { auth, dispatch } = useContext(AuthContext);
  return (
    <div>
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
              <img className="profilePicture" src="/propic.png" alt="placeholder" />
              <div className="navText">{auth.username}</div>
            </div>
            <div className="subscriptionDropdown">
              <div className="navText">Subscription</div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-alignment-fixer" />
    </div>
  );
};

export default NavBar;
