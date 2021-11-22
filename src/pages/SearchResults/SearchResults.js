import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";
import Tab from "../../components/Tab/Tab";
import LargeCard from "../../components/Card/LargeCard/LargeCard";

import { getSearchResults } from "../../API/API";

import "./styles.scss";

const SearchResults = ({ location }) => {
  const [searchType, setSearchType] = useState({ platforms: true, quizzes: false, users: false });
  const [results, setResults] = useState([]);
  const query = location.search.substring(2);

  useEffect(() => {
    search(getCurrentType());
  }, [location]);

  const getCurrentType = () => {
    let type = "platforms";
    Object.keys(searchType).forEach((key) => {
      console.log(key);
      if (searchType[key]) {
        type = key;
      }
    });
    return type;
  };

  const search = (type) => {
    setActiveTab(type);
    getSearchResults(type, query)
      .then((results) => renderResults(type, results))
      .then((cards) => {
        setResults(cards);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const setActiveTab = (type) => {
    const activeTab = { platforms: false, quizzes: false, users: false };
    activeTab[type] = true;
    setSearchType(activeTab);
  };

  const renderResults = (type, results) => {
    if (results.length === 0) {
      return renderError();
    } else if (type === "platforms") {
      return renderPlatformCards(results);
    } else if (type === "quizzes") {
      return renderQuizCards(results);
    } else {
      return renderUserCards(results);
    }
  };

  const renderPlatformCards = (platforms) => {
    return platforms.map((platform, index) => (
      <LargeCard
        key={index}
        cardInfo={{
          title: platform.title,
          description: platform.description,
          subtext: `${platform.subscribers.length} Subscribers`,
        }}
        cardLink={`/p/${platform.title}`}
      ></LargeCard>
    ));
  };

  const renderQuizCards = (quizzes) => {
    return quizzes.map((quiz, index) => (
      <LargeCard
        key={index}
        cardInfo={{
          title: quiz.title,
          description: quiz.description,
          subtext: `${quiz.platform}`,
          upvotes: quiz.upvotes,
          downvotes: quiz.downvotes,
        }}
        cardLink={`/p/${quiz.platform}/${quiz.title}`}
      ></LargeCard>
    ));
  };

  const renderUserCards = (users) => {
    return users.map((user, index) => (
      <LargeCard
        key={index}
        cardInfo={{
          title: user.username,
          description: user.aboutSection,
          subtext: `${user.awards.length} Awards`,
        }}
        cardLink={`/user/${user.username}`}
      ></LargeCard>
    ));
  };

  const renderError = () => {
    return <div className="result-error">{`There are no reults for "${query}"`}</div>;
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
      <div className="page-content ms-5 me-5">
        <div className="results">
          <div className="tab-bar">
            <div className="d-flex flex-row ms-4">
              <Tab active={searchType.platforms} onClick={() => search("platforms")}>
                Platforms
              </Tab>
              <Tab active={searchType.quizzes} onClick={() => search("quizzes")}>
                Quizzes
              </Tab>
              <Tab active={searchType.users} onClick={() => search("users")}>
                Users
              </Tab>
            </div>
            <div className="divider" />
          </div>
          <div className="results-list">{results}</div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
