import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";
import SmallCard from "../../components/Card/SmallCard/SmallCard";
import { getUser, manageFriend } from "../../API/API";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";

import "./styles.scss";

const Friends = () => {
  const { auth } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUser(auth.username)
      .then((res) => setFriends(res.friends))
      .catch((e) => console.log("Could not get user"));
  }, []);

  const addFriend = () => {
    const username = search;
    manageFriend(username, "add")
      .then((res) => setFriends((prevState) => [...prevState, username]))
      .catch((e) => alert("User does not exist"));
  };

  const removeFriend = (username) => {
    manageFriend(username, "remove")
      .then((res) => setFriends((prevState) => prevState.filter((user) => user !== username)))
      .catch((e) => alert("Could not remove friend"));
  };

  return (
    <div>
      <NavBar />
      <SubNav
        heading="Manage Friends"
        buttons={[
          <Link to="/createPlatform">
            <Button>Create a Platform</Button>
          </Link>,
          <Link to="/notfications">
            <Button>Notifications</Button>
          </Link>,
        ]}
      />
      <div className="page-content d-flex flex-column align-items-center">
        <div className="d-flex flex-row mb-3 mt-3">
          <div className="searchBar searchBar--border d-flex align-items-center">
            <input
              className="search"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            ></input>
          </div>
          <Button buttonStyle="btn--secondary" onClick={addFriend}>
            Add Friend
          </Button>
        </div>
        <div className="small-card-list w-50">
          {friends &&
            friends.map((friend) => (
              <SmallCard
                key={friend}
                username={friend}
                rightCard={<Button onClick={(e) => removeFriend(friend)}>Remove Friend</Button>}
              ></SmallCard>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Friends;
