import React from "react";
import "./styles.css";

const SubNav = ({ children, heading, buttons }) => {
  return (
    <div className="subNav">
      <div className="heading">
        <p>{heading}</p>
      </div>
      <div className="buttons">{buttons}</div>
    </div>
  );
};

export default SubNav;
