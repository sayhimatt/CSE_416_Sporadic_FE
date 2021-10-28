import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";

import { AuthContext } from "../../contexts/AuthContext";
import { getFeedQuizzes } from "../../API/API";
import Button from "../../components/Button/Button";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import Footer from "../../components/Footer/Footer";
import LargeCard from "../../components/Card/LargeCard/LargeCard";

const Feed = ({ children }) => {
  const { dispatch } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [quizCards, setQuizCards] = useState([]);

  useEffect(() => {
    getUsername();
    loadQuizzes();
  }, []);

  const logout = async () => {
    await Auth.signOut();
    dispatch({ type: "LOGOUT" });
  };

  const getUsername = async () => {
    const info = await Auth.currentUserInfo();
    setUsername(info.username);
  };

  const loadQuizzes = async () => {
    await getFeedQuizzes(username)
      .then((quizzes) => {
        const cards = mapQuizzesToCards(quizzes);
        setQuizCards(cards);
      })
      .catch((error) => console.log(error));
  };

  const mapQuizzesToCards = (quizzes) => {
    return quizzes.map((quiz) => {
      <LargeCard
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
    <Button buttonStyle="btn--special" onClick={logout}>
      Sign Out
    </Button>,
  ];
  return (
    <div>
      <MainNav />
      <SubNav heading={`Welcome Back ${username}!`} buttons={subNavButtons} />
      <Footer />
    </div>
  );
};

export default Feed;
