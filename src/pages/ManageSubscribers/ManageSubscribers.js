import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, Redirect } from "react-router-dom";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import Button from "../../components/Button/Button";
import SmallCard from "../../components/Card/SmallCard/SmallCard";
import { getPlatform, putBanStatus, putModeratorStatus } from "../../API/API";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { DropdownButton } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { Alert } from "react-bootstrap";

import { getUserIcon } from "../../API/API";

import "./styles.scss";

const ManageSubscribers = () => {
  const { user } = useContext(UserContext);
  const [platform, setPlatform] = useState();
  const [listType, setListType] = useState("Subscribers");
  const [search, setSearch] = useState("");
  const [profilePictures, setProfilePictures] = useState();
  const [alert, setAlert] = useState({ show: false, style: "danger", message: "" });
  const params = useParams();

  useEffect(() => {
    retrievePlatform(params.platform);
  }, []);

  const manageBanStatus = (username, action) => {
    if (!manageable(username)) {
      return;
    }
    putBanStatus(params.platform, username, action)
      .then((res) => {
        retrievePlatform(params.platform);
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
    } else if (
      platform.owner !== user.username &&
      (platform.moderators.includes(username) || platform.owner === username)
    ) {
      setAlert({
        show: true,
        style: "danger",
        message: "You do not have permission to manage this user",
      });
      valid = false;
    }
    return valid;
  };

  const manageModeratorStatus = (username, action) => {
    if (!manageable(username)) {
      return;
    }
    putModeratorStatus(params.platform, username, action)
      .then((res) => {
        retrievePlatform(params.platform);
        setAlert({
          show: true,
          style: "sporadic-secondary",
          message:
            action === "add"
              ? `${username} is now a moderator`
              : `${username} is no longer a moderator`,
        });
      })
      .catch((e) => console.log(e));
  };

  const retrievePlatform = (platformName) => {
    getPlatform(platformName)
      .then((platformData) => {
        setPlatform(platformData);
        retrieveProfilePictures(platformData.subscribers.concat(platformData.bannedUsers));
      })
      .catch((e) => console.log("Could not get platform"));
  };

  const retrieveProfilePictures = (users) => {
    users.forEach((user) =>
      getUserIcon(user).then((link) =>
        setProfilePictures((prevState) => ({ ...prevState, [user]: link })),
      ),
    );
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
      .map((subscriber) => {
        const isModerator = platform.moderators.includes(subscriber);
        const isOwner = platform.owner === subscriber;
        return (
          <SmallCard
            key={`subscriber-card-${subscriber}`}
            profilePicture={profilePictures[subscriber]}
            username={subscriber}
            userTag={(isModerator || isOwner) && <b className="color-special">(Moderator)</b>}
            rightCard={
              <div className="p-1">
                <Dropdown>
                  <Dropdown.Toggle
                    size="sm"
                    className="btn-sporadic"
                    variant="sporadic-secondary"
                  />
                  <Dropdown.Menu>
                    <DropdownItem
                      onClick={(e) =>
                        isModerator || isOwner
                          ? manageModeratorStatus(subscriber, "remove")
                          : manageModeratorStatus(subscriber, "add")
                      }
                    >
                      {isModerator || isOwner ? "Remove Moderator" : "Make Moderator"}
                    </DropdownItem>
                    <DropdownItem onClick={(e) => manageBanStatus(subscriber, "add")}>
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
    return platform.bannedUsers
      .filter((user) => user.includes(search))
      .map((user) => (
        <SmallCard
          key={`ban-card-${user}`}
          profilePicture={profilePictures[user]}
          username={user}
          rightCard={<Button onClick={(e) => manageBanStatus(user, "remove")}>Unban User</Button>}
        ></SmallCard>
      ));
  };

  const hasPrivilege = (username) => {
    return platform.moderators.includes(username) || platform.owner === username;
  };

  return !platform ? (
    <NavBar />
  ) : !hasPrivilege(user.username) ? (
    <Redirect to={`/p/${params.platform}`} />
  ) : (
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
          variant={alert.style}
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
        <div className="small-card-list w-50">{platform && profilePictures && loadUserList()}</div>
      </div>
    </div>
  );
};

export default ManageSubscribers;
