import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, Redirect } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { DropdownButton } from "react-bootstrap";
import { Dropdown, Alert } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Buttons/Button/Button";
import SmallCard from "../../components/Card/SmallCard/SmallCard";
import { getUser, getSearchResults, getAllUserIcons, patchGlobalBanStatus } from "../../API/API";
import { UserContext } from "../../contexts/UserContext/UserContext";
import LoadingSpinner from "../../components/LoadingIndicators/LoadingSpinner";

import "./styles.scss";

const AdminPanel = () => {
  const { user } = useContext(UserContext);
  const [adminStatus, setAdminStatus] = useState({ isGlobalAdmin: false, complete: false });
  const [listType, setListType] = useState("Users");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState();
  const [timer, setTimer] = useState(3);
  const [alert, setAlert] = useState({ show: false, style: "danger", message: "" });

  useEffect(() => {
    getUser(user.username)
      .then((res) => {
        setAdminStatus({ isGlobalAdmin: res.isGlobalAdmin, complete: true });
        setInterval(() => {
          setTimer((prevCount) => prevCount - 1);
        }, 1000);
      })
      .catch((e) => setAdminStatus({ isGlobalAdmin: false, complete: true }));
  }, []);

  useEffect(() => {
    setTimer(1);
    setUsers({ page: 0, users: [], hasMore: true, profilePictures: {} });
  }, [search]);

  useEffect(() => {
    if (users && users.page === 0 && (search === "" || (search !== "" && timer <= 0))) {
      console.log("retrieving users");
      retrieveUsers();
    }
  }, [users, timer]);

  const retrieveUsers = () => {
    const newPage = users.page + 1;
    let retrievedUsers = [];
    getSearchResults("users", search, newPage)
      .then((users) => {
        console.log(users);
        retrievedUsers = users;
        const usernames = users.map((user) => user.username);
        return getAllUserIcons(usernames);
      })
      .then((images) => addNewUsers(retrievedUsers, images, newPage))
      .catch((e) => console.log(e));
  };

  const addNewUsers = (users, images, newPage) => {
    if (users.length === 0) {
      setUsers((prevState) => ({ ...prevState, hasMore: false, page: -1 }));
    } else {
      setUsers((prevState) => ({
        users: prevState.users.concat(users),
        profilePictures: Object.assign(prevState.profilePictures, images),
        page: newPage,
        hasMore: true,
      }));
    }
  };

  const manageBanStatus = (username, action) => {
    if (!manageable(username)) {
      return;
    }
    patchGlobalBanStatus(username, action)
      .then((res) => {
        updateUserList();
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

  const updateUserList = () => {
    //todo
  };

  const loadUserList = () => {
    if (listType === "Users") {
      return loadStandardUserScroll();
    } else {
      return loadBannedUserList();
    }
  };

  const loadStandardUserScroll = () => {
    return (
      <InfiniteScroll
        next={retrieveUsers}
        dataLength={users.users.length}
        hasMore={users.hasMore}
        loader={
          <div className="d-flex justify-content-center mt-4 mb-4">
            <LoadingSpinner isVisible={true} />
          </div>
        }
        endMessage={
          <div className="d-flex justify-content-center mt-4 mb-4">
            <h4>No more users</h4>
          </div>
        }
        className="pe-3 pb-5"
        scrollableTarget="results-list"
        scrollThreshold={0.7}
      >
        {loadStandardUserList()}
      </InfiniteScroll>
    );
  };

  const loadStandardUserList = () => {
    return users.users.map((user, index) => {
      const username = user.username;
      return (
        <SmallCard
          key={index}
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
            profilePicture={users.profilePictures[username]}
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
        <div className="small-card-list w-50 mb-4">{users && loadUserList()}</div>
      </div>
    </div>
  );
};

export default AdminPanel;
