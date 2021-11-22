import React from "react";

import "./styles.scss";

const Tab = ({ children, onClick, active }) => {
  return (
    <div className={`tab ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Tab;
