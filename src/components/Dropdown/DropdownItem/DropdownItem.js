import React from "react";
import { Link } from "react-router-dom";

import "./styles.css";

const DropdownItem = ({ children, size, to, onClick, id }) => {
  const SIZES = ["small", "medium", "large"];

  const itemSize = SIZES.includes(size) ? size : SIZES[0];

  return (
    <Link
      href="#"
      id={id ? id : ""}
      onClick={onClick}
      to={to ? to : "#"}
      className={`menu-item menu-item--${itemSize}`}
    >
      {children}
    </Link>
  );
};

export default DropdownItem;
