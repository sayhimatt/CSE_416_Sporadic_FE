import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext/UserContext";
import { getUser, getUserIcon, manageFollow, getAllAwardIcons } from "../../API/API";
import NavBar from "../../components/NavBar/MainNav/MainNav";
import Button from "../../components/Buttons/Button/Button";
import LinkButton from "../../components/Buttons/LinkButton/LinkButton";
import AwardCarousel from "../../components/AwardCarousel/AwardCarousel";
import { Alert } from "react-bootstrap";

import "./styles.scss";

const Profile = () => {
  const { user } = useContext(UserContext);
  const [userState, setuserState] = useState();
  const [following, setFollowing] = useState();
  const [avatar, setAvatar] = useState();
  const [alert, setAlert] = useState({ show: false, message: "", style: "danger" });
  const [awards, setAwards] = useState();
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    getUser(params.username)
      .then((user) => {
        getUserIcon(params.username).then((link) => {
          setAvatar(link);
          setuserState(user);
        });
        getAllAwardIcons(user.showcasedAwards ? user.showcasedAwards : []).then((awards) =>
          setAwards(awards),
        );
      })
      .catch((e) => history.push(`/search?searchQuery=${params.username}`));
    getUser(user.username)
      .then((user) => {
        setFollowing(user.followedUsers);
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
    } else if (following.includes(params.username)) {
      return (
        <Button buttonStyle="btn--secondary" onClick={unfollowUser}>
          <b>Unfollow</b>
        </Button>
      );
    } else {
      return (
        <Button buttonStyle="btn--secondary" onClick={followUser}>
          <b>Follow User</b>
        </Button>
      );
    }
  };

  const followUser = () => {
    manageFollow(params.username, "add")
      .then((res) => {
        setFollowing((prevState) => [...prevState, params.username]);
        setAlert({
          show: true,
          style: "sporadic-secondary",
          message: `${params.username} has been followed`,
        });
      })
      .catch((e) =>
        setAlert({
          show: true,
          style: "danger",
          message: `${params.username} could not be followed`,
        }),
      );
  };

  const unfollowUser = () => {
    manageFollow(params.username, "remove")
      .then((res) => {
        setFollowing((prevState) => prevState.filter((user) => user !== params.username));
        setAlert({
          show: true,
          style: "sporadic-secondary",
          message: `${params.username} has been unfollowed`,
        });
      })
      .catch((e) =>
        setAlert({
          show: true,
          style: "danger",
          message: `${params.username} could not be unfollowed`,
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
                <div className="profile-button">{userState && following && loadButton()}</div>
              </div>
            </div>
            <div className="profile-section">
              <h3>STATS</h3>
              <div className="d-flex">
                <h3 className="stat-box text-center">
                  <b className="color-secondary">
                    {(userState.awards && userState.awards.length) || 0}
                  </b>{" "}
                  Awards
                </h3>
                <h3 className="stat-box text-center">
                  <b className="color-secondary">{userState.followedUsers.length}</b> Following
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
              <AwardCarousel awards={awards} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
