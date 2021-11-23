import React from "react";

import DropdownItem from "../DropdownItem/DropdownItem";

import "./styles.css";

const DropdownMenu = ({ children, proximity }) => {
  const proximities = ["close", "navbar"];
  const checkProximity = proximities.includes(proximity) ? proximity : proximities[0];

  return <div className={`custom-dropdown custom-dropdown-${checkProximity}`}>{children}</div>;
};

export default DropdownMenu;
