import React from "react";

import MainNav from "../../components/NavBar/MainNav/MainNav";

import "./styles.css";

const NotFound = () => {
  return (
    <div>
      <MainNav />
      <div className="page-block d-flex align-items-center justify-content-center">
        <h1 className="fw-bold">This page was not found :(</h1>
      </div>
    </div>
  );
};

export default NotFound;
