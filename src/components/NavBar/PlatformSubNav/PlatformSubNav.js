import React from "react";
import { Link, useHistory } from "react-router-dom";

import SubNav from "../SubNav/SubNav";
import Button from "../../Button/Button";

import "./styles.css";

const PlatformSubNav = ({
  heading,
  isSubscribed,
  subscriptionHandler,
  bannerSrc,
  ...props
}) => {
  const loadButtons = () => {
    let buttons = [];
    const subscription = (
      <Button onClick={subscriptionHandler}>
        {isSubscribed ? "Unsubscribe" : "Subscribe"}
      </Button>
    );
    buttons.push(subscription);
    /* Handle whether mod view button appears */
    return buttons;
  };

  return (
    <div className="platformSubNav">
      {bannerSrc ? (
        <div
          className="banner"
          style={{ backgroundImage: `url(${bannerSrc})` }}
        />
      ) : null}
      <SubNav heading={heading} buttons={loadButtons()}>
        <img
          className={
            "d-flex align-self-end me-2 " +
            (bannerSrc ? "icon--large" : "icon--small")
          }
          src="/platformIcon.svg"
          alt="Icon"
        />
      </SubNav>
    </div>
  );
};

export default PlatformSubNav;
