import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Auth from "@aws-amplify/auth";

import "./styles.css";

import { AuthContext } from "../../../contexts/AuthContext";
import DropdownMenu from "../../Dropdown/DropdownMenu/DropdownMenu";

const NavBar = () => {
  const { auth, dispatch } = useContext(AuthContext);
  const [subscriptionDropdownOpen, setSubscriptionDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const logout = async () => {
    await Auth.signOut();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div className="navBar navbar navbar-expand-lg sticky-top">
      <div className="logo navbar-brand">
        <Link to="/">
          <img src="/logo.svg" alt="placeholder" />
        </Link>
      </div>
      <div className="searchBar">
        <input className="search" placeholder="Search"></input>
      </div>
      <div className="navbar-nav ms-auto">
        <a
          href="#"
          className="navItem"
          onClick={() => {
            setSubscriptionDropdownOpen(!subscriptionDropdownOpen);
          }}
        >
          <div className="navText">Subscriptions</div>
          {subscriptionDropdownOpen && (
            <DropdownMenu>
              {auth.subscriptions &&
                auth.subscriptions.map((subscription) => (
                  <Link to={`/p/${subscription}`}>{subscription}</Link>
                ))}
            </DropdownMenu>
          )}
        </a>
        <a
          href="#"
          className="navItem"
          onClick={() => {
            setAccountDropdownOpen(!accountDropdownOpen);
          }}
        >
          <img className="profilePicture" src="/propic.png" alt="placeholder" />
          <div className="navText">{auth.username}</div>
          {accountDropdownOpen && (
            <DropdownMenu>
              <Link to="/myAccount">My Account</Link>
              <Link to="/friends">Friends</Link>
              <Link to="/nofitifcations">Notifications</Link>
              <div onClick={logout}>Logout</div>
            </DropdownMenu>
          )}
        </a>
      </div>
    </div>
  );
};

export default NavBar;
