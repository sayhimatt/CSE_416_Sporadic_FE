import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { AuthContext } from "../../../contexts/AuthContext/AuthContext";
import { patchSubscribe, patchUnsubscribe } from "../../../API/API";
import SubNav from "../SubNav/SubNav";
import Button from "../../Button/Button";

import "./styles.css";

const PlatformSubNav = ({ platformName, bannerSrc }) => {
  const { auth, dispatch } = useContext(AuthContext);
  const [subscribed, setSubscribed] = useState(auth.subscriptions.includes(platformName));

  const subscribe = async () => {
    await patchSubscribe(platformName)
      .then((res) => {
        dispatch({ type: "SUBSCRIBE", payload: platformName });
        setSubscribed(true);
      })
      .catch(() => {
        alert("could not subscribe");
      });
  };

  const unsubscribe = async () => {
    await patchUnsubscribe(platformName)
      .then((res) => {
        dispatch({ type: "UNSUBSCRIBE", payload: platformName });
        setSubscribed(false);
      })
      .catch(() => {
        alert("could not unsubscribe");
      });
  };

  const loadButtons = () => {
    let buttons = [];
    let keyMe = 0;
    const subscription = (
      <Button key={String(keyMe++) + "button"} onClick={subscribed ? unsubscribe : subscribe}>
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
          <Link className="link color-secondary" to={`/p/${platformName}`}>
            {platformName}
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
