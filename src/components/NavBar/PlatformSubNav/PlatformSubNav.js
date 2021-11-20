import React from "react";
import { Link } from "react-router-dom";

import SubNav from "../SubNav/SubNav";

import "./styles.css";

const PlatformSubNav = ({ children, platformName, bannerSrc, iconSrc, modView, showUpload }) => {
  return (
    <div className="platformSubNav">
      {bannerSrc && (
        <div
          className={`banner ${modView ? "selectable" : ""}`}
          style={{ backgroundImage: `url(${bannerSrc})` }}
          onClick={() => (modView ? showUpload("banner") : null)}
        ></div>
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
            className={"d-flex " + (bannerSrc ? "icon--large" : "icon--small")}
            src={iconSrc}
            alt="Icon"
          />
          <div
            className={`image-overlay ${modView ? "selectable" : ""}`}
            onClick={() => (modView ? showUpload("icon") : null)}
          />
        </div>
      </SubNav>
    </div>
  );
};

export default PlatformSubNav;
