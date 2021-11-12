import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import { getUser } from "../../API/API";
import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";

import "./styles.css";

const MyAccount = () => {
  const { auth, dispatch } = useContext(AuthContext);
  const [user, setUser] = useState({});

  useEffect(() => {
    getUser(auth.username)
      .then((user) => setUser(user))
      .catch((e) => console.log("Could not retrieve user"));
  }, []);

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
        <div className="page-content">
          <div className="d-flex flex-column">
            <div className="account-section">
              <h2>STATS</h2>
              <div className="d-flex w-75 justify-content-between">
                <h3>
                  <b>{(user.awards && user.awards.length) || 0}</b> Awards Earned
                </h3>
                <h3>
                  <b>{user.friends.length}</b> Friends
                </h3>
                <h3>
                  <b>{user.subscriptions.length}</b> Subscriptions
                </h3>
              </div>
            </div>
            <div className="account-section">
              <h2>ABOUT</h2>
              <div className="input-box">
                <textarea className="input" placeholder="About"></textarea>
              </div>
            </div>
            <div className="account-section">
              <h2>AVATAR</h2>
              <img className="w-25" alt="avatar" src="/propic.png" />
              <div>
                <Button>Change Profile Picture</Button>
              </div>
            </div>
            <div className="account-section">
              <h2>AWARDS</h2>
            </div>
            <div className="account-section">
              <h2>ACCOUNT</h2>
              <p>{user.email}</p>
              <p>{user.username}</p>
              <div>
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
