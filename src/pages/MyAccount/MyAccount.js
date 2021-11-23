import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext/UserContext";
import { getUser, patchUserAbout } from "../../API/API";
import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";

import "./styles.scss";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import { Alert } from "react-bootstrap";

const MyAccount = () => {
  const { user, dispatch } = useContext(UserContext);
  const [userState, setuserState] = useState();
  const [about, setAbout] = useState("");
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [alerts, setAlerts] = useState({ show: false, style: "danger", message: "" });

  useEffect(() => {
    getUser(user.username)
      .then((user) => {
        setuserState(user);
        setAbout(user.aboutSection);
      })
      .catch((e) => console.log("Could not retrieve user"));
  }, []);

  const updateAbout = () => {
    patchUserAbout(user.username, about)
      .then((res) =>
        setAlerts({
          show: true,
          style: "sporadic-secondary",
          message: "Your about section has been updated!",
        }),
      )
      .catch((e) =>
        setAlerts({
          show: true,
          style: "danger",
          message: "Could not save your updates. Please try again.",
        }),
      );
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
          <Link key="nav-createPlatformB" to="/createPlatform">
            <Button>Create A Platform</Button>
          </Link>,
          <Link key="nav-notificationsB" to="/Notifications">
            <Button>Notifications</Button>
          </Link>,
        ]}
      />
      <Alert
        variant={alerts.style}
        show={alerts.show}
        onClose={() => setAlerts((prevState) => ({ ...prevState, show: false }))}
        dismissible
      >
        {alerts.message}
      </Alert>
      {userState && (
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
                  defaultValue={userState.aboutSection}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <Button onClick={updateAbout}>Save About</Button>
              </div>
            </div>
            <div className="account-section">
              <h2>AVATAR</h2>
              <img className="profile-avatar" alt="avatar" src={user.profilePicture} />
              <div>
                <Button onClick={() => setShowAvatarUpload(true)}>Change Avatar</Button>
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
          <ImageUploader
            visible={showAvatarUpload}
            desiredFile="avatar"
            visibilityHandler={() => setShowAvatarUpload(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MyAccount;
