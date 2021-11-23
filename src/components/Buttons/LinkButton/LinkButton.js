import React from "react";
import { Link } from "react-router-dom";

import "./styles.scss";

const STYLES = ["btn--primary", "btn--secondary", "btn--special"];

const SIZES = ["btn--small", "btn--medium", "btn--large"];

const LinkButton = ({ children, to, buttonStyle, buttonSize }) => {
  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
  const checkbuttonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[1];

  return (
    <Link className={`custombtn link ${checkButtonStyle} ${checkbuttonSize}`} to={to}>
      {children}
    </Link>
  );
};

export default LinkButton;
