import React from "react";
import "./styles.scss";

const SubNav = ({ children, heading, buttons }) => {
  return (
    <div className="subNav">
      {children}
      <div className="d-flex justify-content-between align-items-center flex-grow-1">
        <div className="heading">{heading}</div>
        <div className="buttons d-flex">{buttons}</div>
      </div>
    </div>
  );
};

export default SubNav;
