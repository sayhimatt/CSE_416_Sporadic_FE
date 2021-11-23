import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext/UserContext";
import { getFeedQuizzes } from "../../API/API";
import Button from "../../components/Button/Button";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import Footer from "../../components/Footer/Footer";
import LargeCard from "../../components/Card/LargeCard/LargeCard";

const Feed = ({ children }) => {
  const { user, dispatch } = useContext(UserContext);
  const [quizCards, setQuizCards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    getQuizzes();
  }, []);

  useEffect(() => {
    renderCards();
  }, [quizzes]);

  /*
  const getQuizzes = async () => {
    await getFeedQuizzes()
      .then((quizzes) => {
        const cards = mapQuizzesToCards(quizzes);
        setQuizCards(cards);
      })
      .catch((error) => console.log(error));
  };
*/

  const getQuizzes = async () => {
    try {
      const response = await getFeedQuizzes();
      setQuizzes(response.items);
    } catch (error) {
      console.log(error);
    }
  };

  const renderCards = () => {
    const cards = quizzes.map((quiz) => {
      return (
        <LargeCard
          key={quiz._id}
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
        />
      );
    });
    setQuizCards(cards);
  };
  const subNavButtons = [
    <Link key="nav-createPlatformB" to="/createPlatform">
      <Button>Create A Platform</Button>
    </Link>,
    <Link key="nav-notificationsB" to="/Notifications">
      <Button>Notifications</Button>
    </Link>,
  ];
  return (
    <div>
      <MainNav />
      <SubNav heading={`Welcome Back ${user.username}!`} buttons={subNavButtons} />
      <div className="content d-flex flex-row align-items-start me-5 mt-4 justify-content-between">
        <div className="d-flex flex-column m-5 align-items-end">
          <div className="sort"></div>
          <div className="quizzes d-flex flex-column m-10">{quizCards}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Feed;
