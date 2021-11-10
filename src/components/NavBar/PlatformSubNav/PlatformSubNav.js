import React from "react";
import { Link } from "react-router-dom";

import SubNav from "../SubNav/SubNav";

import "./styles.css";

const PlatformSubNav = ({ children, platformName, bannerSrc }) => {
  return (
    <div className="platformSubNav">
      {bannerSrc && <div className="banner" style={{ backgroundImage: `url(${bannerSrc})` }} />}
      <SubNav
        heading={
          <Link className="link color-secondary" to={`/p/${platformName}`}>
            {platformName}
          </Link>
        }
        buttons={children}
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
