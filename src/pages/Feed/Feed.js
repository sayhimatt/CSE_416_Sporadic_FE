import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import { getFeedQuizzes } from "../../API/API";
import Button from "../../components/Button/Button";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import Footer from "../../components/Footer/Footer";
import LargeCard from "../../components/Card/LargeCard/LargeCard";
import QuestionCard from "../../components/Card/QuestionCard/QuestionCard";

const Feed = ({ children }) => {
  const { auth, dispatch } = useContext(AuthContext);
  const [quizCards, setQuizCards] = useState([]);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    await getFeedQuizzes(auth.username)
      .then((quizzes) => {
        const cards = mapQuizzesToCards(quizzes);
        setQuizCards(cards);
      })
      .catch((error) => console.log(error));
  };

  const mapQuizzesToCards = (quizzes) => {
    return quizzes.map((quiz) => {
      <LargeCard
        key={quiz._id}
        cardInfo={{
          title: quiz.title,
          description: quiz.description,
          subtext: (
            <Link className="link" to={`/p/${quiz.platform}`}>
              {quiz.platform}
            </Link>
          ),
        }}
      />;
    });
  };

  const subNavButtons = [
    <Link to="/createPlatform">
      <Button>Create A Platform</Button>
    </Link>,
    <Link to="/Notifications">
      <Button>Notifications</Button>
    </Link>,
  ];
  return (
    <div>
      <MainNav />
      <SubNav heading={`Welcome Back ${auth.username}!`} buttons={subNavButtons} />
      <Footer />
    </div>
  );
};

export default Feed;
