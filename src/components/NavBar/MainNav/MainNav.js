import React, { useContext, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Auth from "@aws-amplify/auth";

import "./styles.css";

import { UserContext } from "../../../contexts/UserContext/UserContext";
import DropdownMenu from "../../Dropdown/DropdownMenu/DropdownMenu";

const NavBar = () => {
  const { user, dispatch } = useContext(UserContext);
  const [subscriptionDropdownOpen, setSubscriptionDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const history = useHistory();

  const logout = async () => {
    await Auth.signOut();
    window.location.reload();
    dispatch({ type: "LOGOUT" });
  };

  const submitSearch = (e) => {
    e.preventDefault();
    history.push(`/search?searchQuery=${search}`);
  };

  return (
    <div className="navBar navbar navbar-expand-lg sticky-top">
      <div className="logo navbar-brand">
        <Link to="/">
          <img src="/logo.svg" alt="placeholder" />
        </Link>
      </div>
      <form className="searchBar" onSubmit={submitSearch}>
        <input
          className="search"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        ></input>
      </form>
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
            <DropdownMenu proximity="navbar">
              {user.subscriptions &&
                user.subscriptions.map((subscription) => (
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
          <img className="profilePicture" src={user.profilePicture} alt="placeholder" />
          <div className="navText">{user.username}</div>
          {accountDropdownOpen && (
            <DropdownMenu proximity="navbar">
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
