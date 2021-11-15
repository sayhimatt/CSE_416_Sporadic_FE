import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";
import { getUser } from "../../API/API";
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
    //todo
  };

  return (
    <div>
      <NavBar />
      <SubNav
        heading="Manage Friends"
        buttons={[
          <Link to="/notfications">
            <Button>Notifications</Button>
          </Link>,
          <Link to="/createPlatform">
            <Button>Create a Platform</Button>
          </Link>,
        ]}
      />
      <div className="page-content d-flex justify-content-center">
        <div className="d-flex flex-row">
          <div className="searchBar searchBar--border d-flex align-items-center">
            <input
              className="search"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            ></input>
          </div>
          <Button onClick={addFriend}>Add Friend</Button>
        </div>
        <div className="small-card-list"></div>
      </div>
    </div>
  );
};

export default Friends;
