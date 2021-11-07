import React, { useEffect } from "react";

import "./styles.css";

const DropdownItem = ({ children, size }) => {
  const SIZES = ["small", "medium", "large"];

  const itemSize = SIZES.includes(size) ? size : SIZES[0];

  return (
    <a href="#" className={`menu-item menu-item--${itemSize}`}>
      {children}
    </a>
  );
};

export default DropdownItem;
