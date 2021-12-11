import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "../../contexts/UserContext/UserContext";
import { getUser, patchUserAbout, getAllAwardIcons } from "../../API/API";
import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Buttons/Button/Button";
import LinkButton from "../../components/Buttons/LinkButton/LinkButton";
import AwardCarousel from "../../components/AwardCarousel/AwardCarousel";

import "./styles.scss";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import { Alert } from "react-bootstrap";

const MyAccount = () => {
  const { user } = useContext(UserContext);
  const [userState, setuserState] = useState();
  const [about, setAbout] = useState("");
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [awards, setAwards] = useState();
  const [alerts, setAlerts] = useState({ show: false, style: "danger", message: "" });

  useEffect(() => {
    getUser(user.username)
      .then((user) => {
        setuserState(user);
        setAbout(user.aboutSection);
        //setAwards(getAllAwardIcons(user.showCasedAwards));
      })
      .catch(() => console.log("Could not retrieve user"));
  }, []);

  const updateAbout = () => {
    patchUserAbout(user.username, about)
      .then(() =>
        setAlerts({
          show: true,
          style: "sporadic-secondary",
          message: "Your about section has been updated!",
        }),
      )
      .catch(() =>
        setAlerts({
          show: true,
          style: "danger",
          message: "Could not save your updates. Please try again.",
        }),
      );
  };

  return (
    <div>
      <NavBar />
      <SubNav
        heading="My Account"
        buttons={[
          <LinkButton key="navCreatePlatB" to="/createPlatform">
            Create A Platform
          </LinkButton>,
          <LinkButton key="navNotificationB" to="/notifications">
            Notifications
          </LinkButton>,
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
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="account-section">
              <h2>AVATAR</h2>
              <img className="profile-avatar" alt="avatar" src={user.profilePicture} />
              <div>
                <Button onClick={() => setShowAvatarUpload(true)}>Change Avatar</Button>
              </div>
            </div>
            <div className="account-section">
              <h2>STATS</h2>
              <div className="d-flex justify-content-between">
                <h3 className="stat-box text-end">
                  <b className="color-secondary">
                    {(userState.awards && userState.awards.length) || 0}
                  </b>{" "}
                  Awards
                </h3>
                <h3 className="stat-box text-center ms-5 me-5">
                  <b className="color-secondary">{userState.subscriptions.length}</b> Subscriptions
                </h3>
                <h3 className="stat-box text-start">
                  <b className="color-secondary">{userState.followedUsers.length}</b> Following
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
              <h2>AWARDS</h2>
              <AwardCarousel awards={awards} />
              <div id="manage-awards-button-container" className="align-self-center">
                <LinkButton to="/awardCase">Manage Awards</LinkButton>
              </div>
            </div>
            <div className="account-section">
              <h2>ACCOUNT</h2>
              <div className="account-info">
                <div className="account-info-heading">Email</div>
                <p>{userState.email}</p>
                <div className="account-info-heading">Username</div>
                <p>{userState.username}</p>
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
