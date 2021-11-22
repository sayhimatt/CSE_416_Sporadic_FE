import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";
import Tab from "../../components/Tab/Tab";

import "./styles.scss";

const SearchResults = ({ location }) => {
  const [searchType, setSearchType] = useState({ platforms: true, quizzes: false, users: false });

  const searchPlatforms = () => {
    setSearchType({ platforms: true, quizzes: false, users: false });
  };

  const searchQuizzes = () => {
    setSearchType({ platforms: false, quizzes: true, users: false });
  };

  const searchUsers = () => {
    setSearchType({ platforms: false, quizzes: false, users: true });
  };

  return (
    <div>
      <NavBar />
      <SubNav
        heading="Search Results"
        buttons={[
          <Link to="/createPlatform">
            <Button>Create A Platform</Button>
          </Link>,
          <Link to="/notifications">
            <Button>Notifications</Button>
          </Link>,
        ]}
      />
      <div className="page-content">
        <div className="results">
          <div className="tab-bar">
            <div className="d-flex flex-row ms-4">
              <Tab active={searchType.platforms} onClick={searchPlatforms}>
                Platforms
              </Tab>
              <Tab active={searchType.quizzes} onClick={searchQuizzes}>
                Quizzes
              </Tab>
              <Tab active={searchType.users} onClick={searchUsers}>
                Users
              </Tab>
            </div>
            <div className="divider" />
          </div>
          <div className="results-list"></div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
