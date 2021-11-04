import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { AuthContext } from "../../../contexts/AuthContext";
import SubNav from "../SubNav/SubNav";
import Button from "../../Button/Button";

import "./styles.css";

const PlatformSubNav = ({ name, subscriptionHandler, bannerSrc, ...props }) => {
  const { auth, dispatch } = useContext(AuthContext);
  const [subscribed, setSubscribed] = useState(auth.subscriptions.includes(name));

  const subscribe = () => {
    setSubscribed(auth.subscriptions.includes(name));
  };

  const unsubscribe = () => {
    setSubscribed(auth.subscriptions.includes(name));
  };

  const loadButtons = () => {
    let buttons = [];
    const subscription = (
      <Button onClick={subscribed ? unsubscribe : subscribe}>
        {subscribed ? "Unsubscribe" : "Subscribe"}
      </Button>
    );
    buttons.push(subscription);
    /* Handle whether mod view button appears */
    return buttons;
  };

  return (
    <div className="platformSubNav">
      {bannerSrc && <div className="banner" style={{ backgroundImage: `url(${bannerSrc})` }} />}
      <SubNav
        heading={
          <Link className="link color-secondary" to={`/p/${name}`}>
            {name}
          </Link>
        }
        buttons={loadButtons()}
      >
        <img
          className={"d-flex " + (bannerSrc ? "icon--large" : "icon--small")}
          src="/platformIcon.svg"
          alt="Icon"
        />
      </SubNav>
    </div>
  );
};

export default PlatformSubNav;
