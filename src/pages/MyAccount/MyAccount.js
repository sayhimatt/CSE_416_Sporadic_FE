import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext/UserContext";
import { getUser } from "../../API/API";
import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";

import "./styles.scss";

const MyAccount = () => {
  const { user, dispatch } = useContext(UserContext);
  const [userState, setuserState] = useState({});
  const [about, setAbout] = useState("");

  useEffect(() => {
    getUser(user.username)
      .then((user) => setuserState(user))
      .catch((e) => console.log("Could not retrieve user"));
    return () => {
      updateAbout(); // On onmount
    };
  }, []);

  const updateAbout = () => {
    // send updated about section to API
  };

  const changeAvatar = () => {
    // send Avatar to API and update on page
  };

  const changePassword = () => {
    // implement change password functionality
  };

  return (
    <div>
      <NavBar />
      <SubNav
        heading="My Account"
        buttons={[
          <Link to="/createPlatform">
            <Button>Create A Platform</Button>
          </Link>,
          <Link to="/Notifications">
            <Button>Notifications</Button>
          </Link>,
        ]}
      />
      {Object.entries(userState).length != 0 && (
        <div className="page-content ms-5 me-5">
          <div className="d-flex flex-column">
            <div className="account-section">
              <h2>STATS</h2>
              <div className="d-flex w-75 justify-content-between">
                <h3>
                  <b className="color-secondary">
                    {(userState.awards && userState.awards.length) || 0}
                  </b>{" "}
                  Awards
                </h3>
                <h3>
                  <b className="color-secondary">{userState.friends.length}</b> Friends
                </h3>
                <h3>
                  <b className="color-secondary">{userState.subscriptions.length}</b> Subscriptions
                </h3>
              </div>
            </div>
            <div className="account-section">
              <h2>ABOUT</h2>
              <div id="account-about-input" className="input-box w-75">
                <textarea
                  className="input"
                  placeholder="About"
                  onChange={(e) => setAbout(e.target.value)}
                />
              </div>
            </div>
            <div className="account-section">
              <h2>AVATAR</h2>
              <img className="avatar" alt="avatar" src={user.profilePicture} />
              <div>
                <Button>Change Avatar</Button>
              </div>
            </div>
            <div className="account-section">
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
              <div id="manage-awards-button-container" className="align-self-center">
                <Button>Manage Awards</Button>
              </div>
            </div>
            <div className="account-section">
              <h2>ACCOUNT</h2>
              <div className="account-info">
                <div className="account-info-heading">Email</div>
                <p>{userState.email}</p>
              </div>
              <div className="account-info">
                <div className="account-info-heading">Username</div>
                <p>{userState.username}</p>
              </div>
              <div className="account-info">
                <div className="account-info-heading mb-2">Password</div>
                <Button>Change Password</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
