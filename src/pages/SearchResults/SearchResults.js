import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";
import Tab from "../../components/Tab/Tab";
import LargeCard from "../../components/Card/LargeCard/LargeCard";
import LoadingSpinner from "../../components/LoadingIndicators/LoadingSpinner";

import { getSearchResults, getAllUserIcons, getAllPlatformIcons } from "../../API/API";

import "./styles.scss";

const SearchResults = ({ location }) => {
  const [searchType, setSearchType] = useState({ platforms: true, quizzes: false, users: false });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = location.search.substring(2);

  useEffect(() => {
    search(getCurrentType());
  }, [location]);

  const getCurrentType = () => {
    let type = "platforms";
    Object.keys(searchType).forEach((key) => {
      if (searchType[key]) {
        type = key;
      }
    });
    return type;
  };

  const search = (type) => {
    setActiveTab(type);
    setLoading(true);
    getSearchResults(type, query)
      .then((results) =>
        getImages(type, results).then((images) => renderResults(type, results, images)),
      )
      .then((cards) => {
        setResults(cards);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  const setActiveTab = (type) => {
    const activeTab = { platforms: false, quizzes: false, users: false };
    activeTab[type] = true;
    setSearchType(activeTab);
  };

  const getImages = async (type, data) => {
    if (type === "platforms") {
      const platforms = data.map((platform) => platform.title);
      return getAllPlatformIcons(platforms);
    } else if (type === "quizzes") {
      const quizzes = data.map((quiz) => quiz.platform);
      return getAllPlatformIcons(quizzes);
    } else {
      const users = data.map((user) => user.username);
      return getAllUserIcons(users);
    }
  };

  const renderResults = (type, results, images) => {
    if (results.length === 0) {
      return renderError();
    } else if (type === "platforms") {
      return renderPlatformCards(results, images);
    } else if (type === "quizzes") {
      return renderQuizCards(results, images);
    } else {
      return renderUserCards(results, images);
    }
  };

  const renderPlatformCards = (platforms, images) => {
    return platforms.map((platform, index) => (
      <LargeCard
        key={index}
        iconSrc={images[platform.title]}
        cardInfo={{
          title: platform.title,
          description: platform.description,
          subtext: `${platform.subscribers.length} Subscribers`,
        }}
        cardLink={`/p/${platform.title}`}
      ></LargeCard>
    ));
  };

  const renderQuizCards = (quizzes, images) => {
    return quizzes.map((quiz, index) => (
      <LargeCard
        key={index}
        iconSrc={images[quiz.platform]}
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

  const renderUserCards = (users, images) => {
    return users.map((user, index) => (
      <LargeCard
        key={index}
        iconSrc={images[user.username]}
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
          {!loading ? (
            <div className="results-list">{results}</div>
          ) : (
            <div className="results-loading">
              <LoadingSpinner isVisible={loading} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
