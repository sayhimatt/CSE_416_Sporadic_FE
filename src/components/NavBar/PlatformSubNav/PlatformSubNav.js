import React from "react";
import { Link } from "react-router-dom";

import SubNav from "../SubNav/SubNav";

import "./styles.css";

const PlatformSubNav = ({ children, platformName, bannerSrc, iconSrc, modView, fileUploadHandlers }) => {
  return (
    <div className="platformSubNav">
      {bannerSrc && (
        <div
          className={`banner`}
          style={{ backgroundImage: `url(${bannerSrc})` }}
        >
        </div>
      )}
      <SubNav
        heading={
          <Link className="link color-secondary" to={`/p/${platformName}`}>
            {platformName}
          </Link>
        }
        buttons={children}
      >
        <div className="icon-container">
          <img
            className={
              "d-flex " +
              (bannerSrc ? "icon--large" : "icon--small")
            }
            src={iconSrc}
            alt="Icon"
          />
        </div>
      </SubNav>
    </div>
  );
};

export default PlatformSubNav;
