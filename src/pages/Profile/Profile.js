import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext/UserContext";
import { getUser, getUserIcon } from "../../API/API";
import NavBar from "../../components/NavBar/MainNav/MainNav";
import Button from "../../components/Button/Button";

import "./styles.scss";

const Profile = () => {
  const { user } = useContext(UserContext);
  const [userState, setuserState] = useState();
  const [friends, setFriends] = useState();
  const [avatar, setAvatar] = useState();
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
  }, []);

  const loadButton = () => {
    if (params.username === user.username) {
      return (
        <Button buttonStyle="btn--secondary">
          <b>Edit Profile</b>
        </Button>
      );
    } else if (friends.includes(params.username)) {
      return (
        <Button buttonStyle="btn--secondary">
          <b>Remove Friend</b>
        </Button>
      );
    } else {
      return (
        <Button buttonStyle="btn--secondary">
          <b>Add friend</b>
        </Button>
      );
    }
  };

  return (
    <div>
      <NavBar />
      {userState && avatar && (
        <div className="page-content ms-5 me-5">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="profile-section">
              <h1 className="color-secondary">{params.username}</h1>
              <img className="profile-avatar" alt="avatar" src={avatar} />
              <div className="d-flex flex-column">{userState && friends && loadButton()}</div>
            </div>
            <div className="profile-section">
              <h2>STATS</h2>
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
              <h2>ABOUT</h2>
              <div id="account-about-input" className="input-box w-75">
                <div className="input">{userState.aboutSection}</div>
              </div>
            </div>
            <div className="profile-section">
              <h2>AWARDS</h2>
              <div id="account-awards-shelf">
                {userState.awards &&
                  userState.awards
                    .filter((award) => award.isShowcased)
                    .map((award, index) => (
                      <div key={`award-${index}`} className="account-award">
                        <img alt="award" src="award.url" />
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
