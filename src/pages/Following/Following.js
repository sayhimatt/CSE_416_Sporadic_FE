import React, { useContext, useEffect, useState } from "react";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Buttons/Button/Button";
import LinkButton from "../../components/Buttons/LinkButton/LinkButton";
import SmallCard from "../../components/Card/SmallCard/SmallCard";
import { getUser, manageFollow, getAllUserIcons } from "../../API/API";
import { UserContext } from "../../contexts/UserContext/UserContext";

import "./styles.scss";

const Following = () => {
  const { user } = useContext(UserContext);
  const [following, setFollowing] = useState([]);
  const [profilePictures, setProfilePictures] = useState();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUser(user.username)
      .then((res) => {
        setFollowing(res.followedUsers);
        getAllUserIcons(res.followedUsers).then((icons) => setProfilePictures(icons));
      })
      .catch((e) => console.log("Could not get user"));
  }, []);

  const followUser = () => {
    const username = search;
    if (following.includes(username)) {
      alert(`You are already following ${username}`);
      return;
    }
    manageFollow(username, "add")
      .then((res) => setFollowing((prevState) => [...prevState, username]))
      .catch((e) => alert("User does not exist"));
  };

  const unfollowUser = (username) => {
    manageFollow(username, "remove")
      .then((res) => setFollowing((prevState) => prevState.filter((user) => user !== username)))
      .catch((e) => alert("Could not unfollow user"));
  };

  return (
    <div>
      <NavBar />
      <SubNav
        heading="Manage Followers"
        buttons={[<LinkButton to="/createPlatform">Create A Platform</LinkButton>]}
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
          <Button buttonStyle="btn--secondary" onClick={followUser}>
            Follow User
          </Button>
        </div>
        <div className="small-card-list w-50">
          {following &&
            profilePictures &&
            following.map((user) => (
              <SmallCard
                key={user}
                profilePicture={profilePictures[user]}
                username={user}
                rightCard={<Button onClick={(e) => unfollowUser(user)}>Unfollow</Button>}
              ></SmallCard>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Following;
