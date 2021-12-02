import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, Redirect } from "react-router-dom";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Buttons/Button/Button";
import SmallCard from "../../components/Card/SmallCard/SmallCard";
import { getUser, getAllUsers, getAllUserIcons, patchGlobalBanStatus } from "../../API/API";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { DropdownButton } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { Alert } from "react-bootstrap";

import "./styles.scss";

const AdminPanel = () => {
  const { user } = useContext(UserContext);
  const [adminStatus, setAdminStatus] = useState({ isGlobalAdmin: false, complete: false });
  const [listType, setListType] = useState("Users");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState({ page: 0, users: [], hasMore: true, profilePictures: {} });
  const [searchUsers, setSearchUsers] = useState({
    page: 0,
    users: [],
    hasMore: true,
    profilePictures: {},
  });
  const [alert, setAlert] = useState({ show: false, style: "danger", message: "" });

  useEffect(() => {
    getUser(user.username)
      .then((res) => {
        setAdminStatus({ isGlobalAdmin: res.isGlobalAdmin, complete: true });
        if (res.isGlobalAdmin) {
          retrieveUsers();
        }
      })
      .catch((e) => setAdminStatus({ isGlobalAdmin: false, complete: true }));
  }, []);

  const retrieveUsers = () => {
    const newPage = users.page + 1;
    let retrievedUsers = [];
    getAllUsers(newPage)
      .then((users) => {
        retrievedUsers = users;
        const usernames = users.map((user) => user.username);
        return getAllUserIcons(usernames);
      })
      .then((images) => {
        if (retrievedUsers.length === 0) {
          setUsers((prevState) => ({ ...prevState, hasMore: false, page: -1 }));
        } else {
          addNewUsers(retrievedUsers, images, newPage);
        }
      })
      .catch((e) => console.log(e));
  };

  const addNewUsers = (users, images, newPage) => {
    setUsers((prevState) => ({
      users: prevState.users.concat(users),
      profilePictures: Object.assign(prevState.profilePictures, images),
      page: newPage,
      hasMore: true,
    }));
  };

  const manageBanStatus = (username, action) => {
    if (!manageable(username)) {
      return;
    }
    patchGlobalBanStatus(username, action)
      .then((res) => {
        //update user card list
        setAlert({
          show: true,
          style: "sporadic-secondary",
          message:
            action === "add" ? `${username} has been banned` : `${username} has been unbanned`,
        });
      })
      .catch((e) => console.log(e));
  };

  const manageable = (username) => {
    let valid = true;
    if (user.username === username) {
      setAlert({ show: true, style: "danger", message: "You cannot manage yourself" });
      valid = false;
    } else if (users.find((user) => user.username === username).isGlobalAdmin) {
      setAlert({
        show: true,
        style: "danger",
        message: "You do not have permission to manage this user",
      });
      valid = false;
    }
    return valid;
  };

  const loadUserList = () => {
    if (listType === "Users") {
      return loadStandardUserList();
    } else {
      return loadBannedUserList();
    }
  };

  const loadStandardUserList = () => {
    return users.users.map((user) => {
      const username = user.username;
      return (
        <SmallCard
          key={`user-card-${username}`}
          profilePicture={users.profilePictures[username]}
          username={username}
          userTag={user.isGlobalAdmin && <b className="color-special">(Admin)</b>}
          rightCard={
            <div className="p-1">
              <Dropdown>
                <Dropdown.Toggle size="sm" className="btn-sporadic" variant="sporadic-secondary" />
                <Dropdown.Menu>
                  <DropdownItem onClick={(e) => manageBanStatus(username, "add")}>
                    Ban User
                  </DropdownItem>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          }
        ></SmallCard>
      );
    });
  };

  const loadBannedUserList = () => {
    return users.users
      .filter((user) => user.isGloballyBanned)
      .map((user) => {
        const username = user.username;
        return (
          <SmallCard
            key={`ban-card-${username}`}
            profilePicture={profilePictures[username]}
            username={username}
            rightCard={
              <Button onClick={(e) => manageBanStatus(username, "remove")}>Unban User</Button>
            }
          ></SmallCard>
        );
      });
  };

  return !adminStatus.complete ? (
    <NavBar />
  ) : !adminStatus.isGlobalAdmin ? (
    <Redirect to="/" />
  ) : (
    <div>
      <NavBar />
      <SubNav heading="Admin Panel"></SubNav>
      <div className="quiz-alerts">
        <Alert
          show={alert.show}
          onClose={() => setAlert({ show: false, message: "" })}
          variant={alert.style}
          dismissible
        >
          {alert.message}
        </Alert>
      </div>
      <div className="page-content d-flex flex-column align-items-center">
        <div className="d-flex mb-3 mt-3 w-50 justify-content-center">
          <div className="searchBar searchBar--border d-flex align-items-center w-50">
            <input
              className="search"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            ></input>
          </div>
          <DropdownButton id="list-type-dropdown" title={listType} variant="secondary">
            <DropdownItem onClick={() => setListType("Users")}>Users</DropdownItem>
            <DropdownItem onClick={() => setListType("Banned Users")}>Banned Users</DropdownItem>
          </DropdownButton>
        </div>
        <div className="small-card-list w-50">{loadUserList()}</div>
      </div>
    </div>
  );
};

export default AdminPanel;
