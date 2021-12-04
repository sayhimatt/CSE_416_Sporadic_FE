import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import { UserContext } from "../../contexts/UserContext/UserContext";
import { getFeedQuizzes, getQuizIcon, getUser } from "../../API/API";
import LinkButton from "../../components/Buttons/LinkButton/LinkButton";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import Footer from "../../components/Footer/Footer";
import LargeCard from "../../components/Card/LargeCard/LargeCard";
import LoadingSpinner from "../../components/LoadingIndicators/LoadingSpinner";

import "./styles.scss";

const Feed = ({ children }) => {
  const { user } = useContext(UserContext);
  const [quizzes, setQuizzes] = useState({ page: 0, hasMore: true, quizzes: [] });
  const [isGlobalAdmin, setIsGlobalAdmin] = useState(false);
  const [quizCards, setQuizCards] = useState([]);

  useEffect(() => {
    getQuizzes();
    getUser(user.username)
      .then((res) => setIsGlobalAdmin(res.isGlobalAdmin))
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    renderCards();
  }, [quizzes]);

  const getQuizzes = async () => {
    try {
      const newPage = quizzes.page + 1;
      const response = await getFeedQuizzes(newPage);
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

  const renderCards = async () => {
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
    <LinkButton key="notifications" to="/notifications">
      Notifications
    </LinkButton>,
  ];

  return (
    <div>
      <MainNav />
      <SubNav heading={`Welcome Back ${user.username}!`} buttons={subNavButtons} />
      <div className="content d-flex flex-row align-items-start me-5 mt-4 justify-content-between">
        <div className="d-flex flex-column m-5 align-items-end">
          <div className="sort"></div>
          <div id="feed-quizzes" className="quizzes d-flex flex-column mb-4">
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Feed;
