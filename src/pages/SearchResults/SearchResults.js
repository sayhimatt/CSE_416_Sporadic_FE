import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Buttons/Button/Button";
import Tab from "../../components/Tab/Tab";
import LargeCard from "../../components/Card/LargeCard/LargeCard";
import LoadingSpinner from "../../components/LoadingIndicators/LoadingSpinner";

import {
  getSearchResults,
  getAllUserIcons,
  getAllPlatformIcons,
  getAllQuizIcons,
} from "../../API/API";

import "./styles.scss";

const SearchResults = ({ location }) => {
  const [searchType, setSearchType] = useState({ platforms: true, quizzes: false, users: false });
  const [results, setResults] = useState();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.has("searchQuery") ? searchParams.get("searchQuery") : "";

  useEffect(() => {
    clearResults();
  }, [location]);

  useEffect(() => {
    if (
      results &&
      results.platforms.page === 0 &&
      results.quizzes.page === 0 &&
      results.users.page === 0
    ) {
      search("platforms");
      search("quizzes");
      search("users");
    }
  }, [results]);

  const clearResults = () => {
    setResults({
      platforms: { page: 0, hasMore: true, results: [], images: [] },
      quizzes: { page: 0, hasMore: true, results: [], images: [] },
      users: { page: 0, hasMore: true, results: [], images: [] },
    });
  };

  const search = (type) => {
    const newPage = results[type].page + 1;
    console.log(`Searching page ${newPage} for ${type}`);
    getSearchResults(type, query, newPage)
      .then((results) => {
        if (results.length === 0) {
          noMoreResults(type);
        } else {
          setResultsType(type, newPage, results);
          getImages(type, results).then((images) => setResultsImages(type, images));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const noMoreResults = (type) => {
    setResults((prevState) => ({
      ...prevState,
      [type]: { ...prevState[type], hasMore: false, page: -1 },
    }));
  };

  const setResultsType = (type, page, newResults) => {
    setResults((prevState) => ({
      ...prevState,
      [type]: {
        ...prevState[type],
        page,
        results: page === 1 ? newResults : prevState[type].results.concat(newResults),
      },
    }));
  };

  const setResultsImages = (type, newImages) => {
    setResults((prevState) => ({
      ...prevState,
      [type]: { ...prevState[type], images: Object.assign(prevState[type].images, newImages) },
    }));
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
      return getAllQuizIcons(data);
    } else {
      const users = data.map((user) => user.username);
      return getAllUserIcons(users);
    }
  };

  const renderResults = () => {
    if (searchType.platforms) {
      return renderPlatformScroll();
    } else if (searchType.quizzes) {
      return renderQuizScroll();
    } else {
      return renderUserScroll();
    }
  };

  const renderPlatformScroll = () => {
    return (
      <InfiniteScroll
        next={() => search("platforms")}
        dataLength={results.platforms.results.length}
        hasMore={results.platforms.hasMore}
        loader={
          <div className="d-flex justify-content-center mt-4 mb-4">
            <LoadingSpinner isVisible={true} />
          </div>
        }
        endMessage={
          <div className="d-flex justify-content-center mt-4 mb-4">
            <h4>No more platforms</h4>
          </div>
        }
        className="pe-3"
        scrollableTarget="results-list"
      >
        {renderPlatformCards()}
      </InfiniteScroll>
    );
  };

  const renderQuizScroll = () => {
    console.log("rendering quiz scroll");
    return (
      <InfiniteScroll
        next={() => search("quizzes")}
        dataLength={results.quizzes.results.length}
        hasMore={results.quizzes.hasMore}
        loader={
          <div className="d-flex justify-content-center mt-4 mb-4">
            <LoadingSpinner isVisible={true} />
          </div>
        }
        endMessage={
          <div className="d-flex justify-content-center mt-4 mb-4">
            <h4>No more quizzes</h4>
          </div>
        }
        className="pe-3"
        scrollableTarget="results-list"
      >
        {renderQuizCards()}
      </InfiniteScroll>
    );
  };

  const renderUserScroll = () => {
    return (
      <InfiniteScroll
        next={() => search("users")}
        dataLength={results.users.results.length}
        hasMore={results.users.hasMore}
        loader={
          <div className="d-flex justify-content-center mt-4 mb-4">
            <LoadingSpinner isVisible={true} />
          </div>
        }
        endMessage={
          <div className="d-flex justify-content-center mt-4 mb-4">
            <h4>No more users</h4>
          </div>
        }
        className="pe-3"
        scrollableTarget="results-list"
      >
        {renderUserCards()}
      </InfiniteScroll>
    );
  };

  const renderPlatformCards = () => {
    const platforms = results.platforms.results;
    const images = results.platforms.images;
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

  const renderQuizCards = () => {
    const quizzes = results.quizzes.results;
    const images = results.quizzes.images;
    return quizzes.map((quiz, index) => (
      <LargeCard
        key={index}
        iconSrc={images[quiz.title]}
        cardInfo={{
          title: quiz.title,
          description: quiz.description,
          time: quiz.timeLimit,
          subtext: (
            <Link to={`/p/${quiz.platform}`} className="link">
              {quiz.platform}
            </Link>
          ),
          upvotes: quiz.upvotes,
          downvotes: quiz.downvotes,
        }}
        cardLink={`/p/${quiz.platform}/${quiz.title}`}
      ></LargeCard>
    ));
  };

  const renderUserCards = () => {
    const users = results.users.results;
    const images = results.users.images;
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

  return (
    <div>
      <NavBar />
      <SubNav
        heading="Search Results"
        buttons={[
          <Link to="/createPlatform">
            <Button>Create A Platform</Button>
          </Link>,
        ]}
      />
      <div id="results-content" className="ms-5 me-5">
        <div className="tab-bar">
          <div className="d-flex flex-row ms-4">
            <Tab active={searchType.platforms} onClick={() => setActiveTab("platforms")}>
              Platforms
            </Tab>
            <Tab active={searchType.quizzes} onClick={() => setActiveTab("quizzes")}>
              Quizzes
            </Tab>
            <Tab active={searchType.users} onClick={() => setActiveTab("users")}>
              Users
            </Tab>
          </div>
          <div className="divider" />
        </div>
        <div id="results-list">{results && renderResults()}</div>
      </div>
    </div>
  );
};

export default SearchResults;
