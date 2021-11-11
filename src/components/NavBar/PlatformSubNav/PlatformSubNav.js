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
          onClick={modView ? fileUploadHandlers.uploadBanner : null}
        />
      )}
      <SubNav
        heading={
          <Link className="link color-secondary" to={`/p/${platformName}`}>
            {platformName}
          </Link>
        }
        buttons={children}
      >
        <img
          className={
            "d-flex " +
            (bannerSrc ? "icon--large" : "icon--small") +
            " " +
            (modView ? "selectable" : "")
          }
          src="/platformIcon.svg"
          alt="Icon"
          onClick={modView ? fileUploadHandlers.uploadIcon : null}
        />
      </SubNav>
    </div>
  );
};

export default PlatformSubNav;
