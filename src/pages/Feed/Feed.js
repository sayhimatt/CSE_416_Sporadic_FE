import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { Dropdown } from "react-bootstrap";

import { UserContext } from "../../contexts/UserContext/UserContext";
import { getFeedQuizzes, getQuizIcon, getUser, getAllAwardIcons } from "../../API/API";
import LinkButton from "../../components/Buttons/LinkButton/LinkButton";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import Footer from "../../components/Footer/Footer";
import LargeCard from "../../components/Card/LargeCard/LargeCard";
import LoadingSpinner from "../../components/LoadingIndicators/LoadingSpinner";
import SortDirectionButtons from "../../components/Buttons/SortDirection/SortDirectionButtons";

import "./styles.scss";

const Feed = ({ children }) => {
  const { user } = useContext(UserContext);
  const [quizzes, setQuizzes] = useState();
  const [awards, setAwards] = useState();
  const [sortBy, setSortBy] = useState("title");
  const [sortDirection, setSortDirection] = useState("ascending");

  const [isGlobalAdmin, setIsGlobalAdmin] = useState(false);
  const [quizCards, setQuizCards] = useState([]);

  useEffect(() => {
    getUser(user.username)
      .then((res) => {
        setIsGlobalAdmin(res.isGlobalAdmin);
        const threeAwards = takeThreeAwards(res.awards.concat(res.displayedAwards));
        getAllAwardIcons(threeAwards).then((awards) => setAwards(awards));
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    setQuizzes({ page: 0, hasMore: true, quizzes: [] });
  }, [sortBy, sortDirection]);

  useEffect(() => {
    if (quizzes && quizzes.page === 0) {
      getQuizzes();
    }
    renderCards();
  }, [quizzes]);

  const getQuizzes = async () => {
    try {
      const newPage = quizzes.page + 1;
      const response = await getFeedQuizzes(newPage, 10, sortBy, sortDirection);
      if (response.items.length === 0) {
        setQuizzes((prevState) => ({ ...prevState, page: newPage, hasMore: false }));
      } else {
        setQuizzes((prevState) => ({
          ...prevState,
          page: newPage,
          quizzes: prevState.quizzes.concat(response.items),
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const takeThreeAwards = (awards) => {
    console.log(awards);
    const result = [];
    while (result.length !== 3 && awards.length !== result.length) {
      let index = getRandomIndex(awards);
      if (awards[index] !== -1) {
        result.push(awards[index]);
        awards[index] = -1;
      }
    }
    return result;
  };

  const getRandomIndex = (array) => {
    return Math.floor(Math.random() * array.length);
  };

  const renderCards = async () => {
    if (!quizzes) return;
    const cards = quizzes.quizzes.map(async (quiz) => {
      return getQuizIcon(quiz.platform, quiz.title).then((quizImg) => (
        <LargeCard
          key={quiz._id}
          iconSrc={quizImg}
          cardInfo={{
            title: quiz.title,
            description: quiz.description,
            upvotes: quiz.upvotes,
            downvotes: quiz.downvotes,
            subtext: (
              <Link className="link" to={`/p/${quiz.platform}`}>
                {quiz.platform}
              </Link>
            ),
          }}
          cardLink={`/p/${quiz.platform}/${quiz.title}`}
        />
      ));
    });
    Promise.all(cards).then((cards) => {
      setQuizCards(cards);
    });
  };

  const subNavButtons = [
    isGlobalAdmin ? (
      <LinkButton key="admin-panel" to="/adminPanel" buttonStyle="btn--special">
        Admin Panel
      </LinkButton>
    ) : null,
    <LinkButton key="create-platform" to="/createPlatform">
      Create A Platform
    </LinkButton>,
  ];

  return (
    <div>
      <MainNav />
      <SubNav heading={`Welcome Back ${user.username}!`} buttons={subNavButtons} />
      <div className="content d-flex flex-row align-items-start me-5 mt-4">
        <div id="feed-left">
          <div className="d-flex flex-column w-100">
            <div id="sort">
              <Dropdown>
                <Dropdown.Toggle className="sort-dropdowns me-3">{sortBy}</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>sort by</Dropdown.Header>
                  <Dropdown.Item
                    onClick={() => {
                      setSortBy("title");
                    }}
                  >
                    Title
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSortBy("upvotes");
                    }}
                  >
                    Upvotes
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSortBy("platform");
                    }}
                  >
                    Platform
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <SortDirectionButtons
                sortDirection={sortDirection}
                onAscendingClick={() => setSortDirection("ascending")}
                onDescendingClick={() => setSortDirection("descending")}
              />
            </div>
            <div id="feed-quizzes" className="quizzes d-flex flex-column mb-4">
              {quizzes && (
                <InfiniteScroll
                  next={getQuizzes}
                  dataLength={quizzes.quizzes.length}
                  hasMore={quizzes.hasMore}
                  loader={
                    <div className="d-flex justify-content-center mt-4">
                      <LoadingSpinner isVisible={true} />
                    </div>
                  }
                  endMessage={
                    <div className="d-flex justify-content-center mt-4">
                      <h4>No more quizzes</h4>
                    </div>
                  }
                  className="pe-3"
                  scrollThreshold={0.8}
                >
                  {quizCards}
                </InfiniteScroll>
              )}
            </div>
          </div>
        </div>
        <div id="feed-right">
          <div id="feed-sidebar">
            <h3 className="mb-4">Your Awards</h3>
            {awards &&
              awards.map((award) => (
                <div className="feed-award-container">
                  <img src={award.image} alt="award" />
                  <p>{award.title}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Feed;
