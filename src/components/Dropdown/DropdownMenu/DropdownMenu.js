import React from "react";

import DropdownItem from "../DropdownItem/DropdownItem";

import "./styles.css";

const DropdownMenu = ({ children, size }) => {
  return (
    <div className="custom-dropdown">
      {children.map((item) => (
        <DropdownItem size={size}>{item}</DropdownItem>
      ))}
    </div>
  );
};

export default DropdownMenu;
