import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";

import { AuthContext } from "../../contexts/AuthContext";
import Button from "../../components/Button/Button";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import Footer from "../../components/Footer/Footer";

const Feed = ({ children }) => {
  const { dispatch } = useContext(AuthContext);
  const [username, setUsername] = useState("");

  useEffect(() => {
    getUsername();
  }, []);

  const logout = async () => {
    await Auth.signOut();
    dispatch({ type: "LOGOUT" });
  };

  const getUsername = async () => {
    const info = await Auth.currentUserInfo();
    setUsername(info.username);
  };

  const subNavButtons = [
    <Link to="/createPlatform">
      <Button>Create A Platform</Button>
    </Link>,
    <Link to="/Notifications">
      <Button>Notifications</Button>
    </Link>,
    <Button buttonStyle="btn--special" onClick={logout}>
      Sign Out
    </Button>,
  ];
  return (
    <div>
      <MainNav />
      <SubNav heading={`Welcome Back ${username}!`} buttons={subNavButtons} />
      <Footer />
    </div>
  );
};

export default Feed;
