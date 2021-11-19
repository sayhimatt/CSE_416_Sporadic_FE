import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import Button from "../../components/Button/Button";
import SmallCard from "../../components/Card/SmallCard/SmallCard";
import { getPlatform, putBanStatus } from "../../API/API";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { DropdownButton } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { Alert } from "react-bootstrap";

import "./styles.scss";

const ManageSubscribers = () => {
  const { user } = useContext(UserContext);
  const [platform, setPlatform] = useState();
  const [listType, setListType] = useState("Subscribers");
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "" });
  const params = useParams();

  useEffect(() => {
    retrievePlatform(params.platform);
  }, []);

  const manageBanStatus = (username, action) => {
    if (!bannable(username)) {
      return;
    }
    putBanStatus(params.platform, username, action)
      .then((res) => retrievePlatform(params.platform))
      .catch((e) => console.log(e));
  };

  const bannable = (username) => {
    let valid = true;
    if (user.username === username) {
      setAlert({ show: true, message: "You cannot manage yourself" });
      valid = false;
    } else if (
      platform.owner !== user.username &&
      (platform.moderators.includes(username) || platform.owner === username)
    ) {
      setAlert({ show: true, message: "You do not have permission to manage this user" });
      valid = false;
    }
    return valid;
  };

  const retrievePlatform = (platform) => {
    getPlatform(platform)
      .then((res) => setPlatform(res))
      .catch((e) => console.log("Could not get platform"));
  };

  const loadUserList = () => {
    if (listType === "Subscribers") {
      return loadSubscriberList();
    } else {
      return loadBannedUserList();
    }
  };

  const loadSubscriberList = () => {
    return platform.subscribers
      .filter((subscriber) => subscriber.includes(search))
      .map((subscriber) => (
        <SmallCard
          key={subscriber}
          username={subscriber}
          rightCard={<Button onClick={(e) => manageBanStatus(subscriber, "add")}>Ban User</Button>}
        ></SmallCard>
      ));
  };

  const loadBannedUserList = () => {
    return platform.bannedUsers
      .filter((user) => user.includes(search))
      .map((user) => (
        <SmallCard
          key={user}
          username={user}
          rightCard={<Button onClick={(e) => manageBanStatus(user, "remove")}>Unban User</Button>}
        ></SmallCard>
      ));
  };

  return (
    <div>
      <NavBar />
      <PlatformSubNav platformName={params.platform}>
        <Link to={`/p/${params.platform}`}>
          <Button>{`Back to ${params.platform}`}</Button>
        </Link>
      </PlatformSubNav>
      <div className="quiz-alerts">
        <Alert
          show={alert.show}
          onClose={() => setAlert({ show: false, message: "" })}
          variant="danger"
          dismissible
        >
          {alert.message}
        </Alert>
      </div>
      <div className="page-content d-flex flex-column align-items-center">
        <p className="fs-1">Subscriber Management</p>
        <div className="d-flex mb-3 mt-3 w-50 justify-content-center">
          <div className="searchBar searchBar--border d-flex align-items-center w-50">
            <input
              className="search"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            ></input>
          </div>
          <DropdownButton id="list-type-dropdown" title={listType} variant="secondary">
            <DropdownItem onClick={() => setListType("Subscribers")}>Subscribers</DropdownItem>
            <DropdownItem onClick={() => setListType("Banned Users")}>Banned Users</DropdownItem>
          </DropdownButton>
        </div>
        <div className="small-card-list w-50">{platform && loadUserList()}</div>
      </div>
    </div>
  );
};

export default ManageSubscribers;
