import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";
import SmallCard from "../../components/Card/SmallCard/SmallCard";
import { getUser, manageFriend, getAllUserIcons } from "../../API/API";
import { UserContext } from "../../contexts/UserContext/UserContext";

import "./styles.scss";

const Friends = () => {
  const { user } = useContext(UserContext);
  const [friends, setFriends] = useState([]);
  const [profilePictures, setProfilePictures] = useState();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUser(user.username)
      .then((res) => {
        setFriends(res.friends);
        getAllUserIcons(res.friends).then((icons) => setProfilePictures(icons));
      })
      .catch((e) => console.log("Could not get user"));
  }, []);

  const addFriend = () => {
    const username = search;
    if (friends.includes(username)) {
      alert(`You are already friends with ${username}`);
      return;
    }
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
            profilePictures &&
            friends.map((friend) => (
              <SmallCard
                key={friend}
                profilePicture={profilePictures[friend]}
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
