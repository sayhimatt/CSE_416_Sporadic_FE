import React from "react";
import { Link } from "react-router-dom";

import SubNav from "../SubNav/SubNav";

import "./styles.css";

const PlatformSubNav = ({ children, platformName, bannerSrc, modView, fileUploadHandlers }) => {
  return (
    <div className="platformSubNav">
      {bannerSrc && (
        <div
          className={`banner ${modView ? "selectable" : ""}`}
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
            src="/platformIcon.svg"
            alt="Icon"
          />
        </div>
      </SubNav>
    </div>
  );
};

export default PlatformSubNav;
