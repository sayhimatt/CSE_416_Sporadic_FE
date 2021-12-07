import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext/UserContext";
import { getUser, getUserIcon, manageFriend } from "../../API/API";
import NavBar from "../../components/NavBar/MainNav/MainNav";
import Button from "../../components/Buttons/Button/Button";
import LinkButton from "../../components/Buttons/LinkButton/LinkButton";
import AwardCarousel from "../../components/AwardCarousel/AwardCarousel";
import { Alert } from "react-bootstrap";

import "./styles.scss";

const Profile = () => {
  const { user } = useContext(UserContext);
  const [userState, setuserState] = useState();
  const [friends, setFriends] = useState();
  const [avatar, setAvatar] = useState();
  const [alert, setAlert] = useState({ show: false, message: "", style: "danger" });
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    getUser(params.username)
      .then((user) => {
        getUserIcon(params.username).then((link) => {
          setAvatar(link);
          setuserState(user);
        });
      })
      .catch((e) => history.push(`/search?searchQuery=${params.username}`));
    getUser(user.username)
      .then((user) => {
        setFriends(user.friends);
      })
      .catch((e) => console.log("Could not retrieve user"));
  }, [params]);

  const loadButton = () => {
    if (params.username === user.username) {
      return (
        <LinkButton to="/myAccount" buttonStyle="btn--secondary">
          <b>Edit Profile</b>
        </LinkButton>
      );
    } else if (friends.includes(params.username)) {
      return (
        <Button buttonStyle="btn--secondary" onClick={removeFriend}>
          <b>Remove Friend</b>
        </Button>
      );
    } else {
      return (
        <Button buttonStyle="btn--secondary" onClick={addFriend}>
          <b>Add friend</b>
        </Button>
      );
    }
  };

  const addFriend = () => {
    manageFriend(params.username, "add")
      .then((res) => {
        setFriends((prevState) => [...prevState, params.username]);
        setAlert({
          show: true,
          style: "sporadic-secondary",
          message: `${params.username} has been added as a friend`,
        });
      })
      .catch((e) =>
        setAlert({
          show: true,
          style: "danger",
          message: `${params.username} could not be added as a friend`,
        }),
      );
  };

  const removeFriend = () => {
    manageFriend(params.username, "remove")
      .then((res) => {
        setFriends((prevState) => prevState.filter((user) => user !== params.username));
        setAlert({
          show: true,
          style: "sporadic-secondary",
          message: `${params.username} has been removed from your friends`,
        });
      })
      .catch((e) =>
        setAlert({
          show: true,
          style: "danger",
          message: `${params.username} could not be removed from your friends`,
        }),
      );
  };

  return (
    <div>
      <NavBar />
      <Alert
        show={alert.show}
        variant={alert.style}
        onClose={() => setAlert({ show: false, message: "", style: "" })}
        dismissible
      >
        {alert.message}
      </Alert>
      {userState && avatar && (
        <div className="page-content ms-5 me-5">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="profile-section">
              <h1 className="color-secondary">{params.username}</h1>
              <img className="profile-avatar" alt="avatar" src={avatar} />
              <div className="d-flex flex-column">
                <div className="profile-button">{userState && friends && loadButton()}</div>
              </div>
            </div>
            <div className="profile-section">
              <h3>STATS</h3>
              <div className="d-flex w-50 justify-content-around">
                <h3>
                  <b className="color-secondary">
                    {(userState.awards && userState.awards.length) || 0}
                  </b>{" "}
                  Awards
                </h3>
                <h3>
                  <b className="color-secondary">{userState.friends.length}</b> Friends
                </h3>
              </div>
            </div>
            <div className="profile-section">
              <h3>ABOUT</h3>
              <div id="account-about-input" className="input-box w-75">
                <div className="input">
                  {userState.aboutSection ? userState.aboutSection : "This user has no description"}
                </div>
              </div>
            </div>
            <div className="profile-section">
              <h3>AWARDS</h3>
              <AwardCarousel
                awards={[
                  { title: "Award", quiz: "Quiz", image: "/quizIcon.png" },
                  { title: "Award 2", quiz: "Quiz", image: "/platformIcon.png" },
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
