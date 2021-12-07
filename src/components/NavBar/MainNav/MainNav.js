import React, { useContext, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Auth from "@aws-amplify/auth";

import "./styles.scss";

import { UserContext } from "../../../contexts/UserContext/UserContext";
import CustomToggle from "../../CustomToggle/CustomToggle";
import { Dropdown } from "react-bootstrap";

const NavBar = () => {
  const { user, dispatch } = useContext(UserContext);
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
      <div className="navbar-dropdowns ms-auto">
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle}>
            <div className="sort-categories">Subscriptions</div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="custom-dropdown-menu" align="end">
            {user.subscriptions &&
              user.subscriptions.map((subscription, index) => (
                <Dropdown.Item
                  key={index}
                  className="custom-dropdown-item"
                  onClick={() => {
                    history.push(`/p/${subscription}`);
                  }}
                >
                  {subscription}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle}>
            <div className="d-flex justify-content-center align-items-center ms-3">
              <img className="profilePicture" src={user.profilePicture} alt="placeholder" />
              <div className="navText">{user.username}</div>
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="custom-dropdown-menu">
            <Dropdown.Item
              className="custom-dropdown-item"
              onClick={() => history.push(`/user/${user.username}`)}
            >
              My Account
            </Dropdown.Item>
            <Dropdown.Item
              className="custom-dropdown-item"
              onClick={() => history.push(`/friends`)}
            >
              Friends
            </Dropdown.Item>
            <Dropdown.Item
              className="custom-dropdown-item"
              onClick={() => history.push(`/notifications`)}
            >
              Notifications
            </Dropdown.Item>
            <Dropdown.Item className="custom-dropdown-item" onClick={logout}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default NavBar;
