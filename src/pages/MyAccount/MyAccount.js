import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { getUser, getUserIcon } from "../../API/API";
import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";

import "./styles.scss";

const MyAccount = () => {
  const { auth, dispatch } = useContext(AuthContext);
  const [profileIcon, setProfileIcon] = useState("/propic.png");
  const [user, setUser] = useState({});
  const [about, setAbout] = useState("");

  useEffect(() => {
    getProfileIcon();
    getUser(auth.username)
      .then((user) => setUser(user))
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
  const getProfileIcon = async () => {
    try {
      const url = await getUserIcon(auth.username);
      setProfileIcon(url);
    } catch (error) {
      console.log(error);
    }
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
      {Object.entries(user).length != 0 && (
        <div className="page-content ms-5 me-5">
          <div className="d-flex flex-column">
            <div className="account-section">
              <h2>STATS</h2>
              <div className="d-flex w-75 justify-content-between">
                <h3>
                  <b className="color-secondary">{(user.awards && user.awards.length) || 0}</b>{" "}
                  Awards
                </h3>
                <h3>
                  <b className="color-secondary">{user.friends.length}</b> Friends
                </h3>
                <h3>
                  <b className="color-secondary">{user.subscriptions.length}</b> Subscriptions
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
              <img className="avatar" alt="avatar" src={profileIcon} />
              <div>
                <Button>Change Avatar</Button>
              </div>
            </div>
            <div className="account-section">
              <h2>AWARDS</h2>
              <div id="account-awards-shelf">
                {user.awards &&
                  user.awards
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
                <p>{user.email}</p>
              </div>
              <div className="account-info">
                <div className="account-info-heading">Username</div>
                <p>{user.username}</p>
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
