import React from "react";

import DropdownItem from "../DropdownItem/DropdownItem";

import "./styles.css";

const DropdownMenu = ({ children, size, proximity }) => {
  const proximities = ["close", "navbar"];
  const checkProximity = proximities.includes(proximity) ? proximity : proximities[0];

  return (
    <div className={`custom-dropdown custom-dropdown-${checkProximity}`}>
      {children && children.map((item) => <DropdownItem size={size}>{item}</DropdownItem>)}
    </div>
  );
};

export default DropdownMenu;
