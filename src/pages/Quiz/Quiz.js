import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

import { getPlatform, getQuizByTitle } from "./../../API/API";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import QuestionCard from "../../components/Card/QuestionCard/QuestionCard.js";

import "./styles.scss";

const Quiz = () => {
  const [platform, setPlatform] = useState({});
  const [questions, setQuestions] = useState([]);
  const [questionsCards, setQuestionCards] = useState([]);
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    getCurrentPlatform();
    getQuestions();
  }, [params]);

  useEffect(() => {
    renderCards();
  }, [questions]);

  const getCurrentPlatform = async () => {
    const name = params.platform;
    await getPlatform(name)
      .then((platformData) => {
        setPlatform(platformData);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          history.replace(`/search?=${name}`);
        } else {
          history.replace("/error");
        }
      });
  };

  const getQuestions = async () => {
    const platform = params.platform;
    const quiz = params.quiz;
    try {
      const response = await getQuizByTitle(platform, quiz);
      setQuestions(response.questions);
    } catch (error) {
      console.log(error);
    }
  };

  const renderCards = () => {
    const cards = questions.map((question, index) => {
      console.log("MATTHEW");
      console.log(questions);
      return (
        <QuestionCard
          key={question._id + index}
          information={{
            question: question.body,
            c1: question.answers[0],
            c2: question.answers[1],
            c3: question.answers[2],
            c4: question.answers[3],
          }}
        />
      );
    });
    setQuestionCards(cards);
  };

  return (
    <div>
      <MainNav />
      <PlatformSubNav heading={params.platform} />
      <div className="content d-flex m-4 flex-row align-items-start">
        <div className="d-flex flex-column flex-md-fill">{questionsCards}</div>
        <div className="information d-flex flex-column">
          <div className="searchBar searchBar--border">
            <input className="search" placeholder="Search"></input>
          </div>
          <div className="platform-text-block d-flex align-items-center justify-content-center mt-4">
            {platform.description}
          </div>
          <div className="platform-text-block iq d-flex flex-column align-items-center mt-4">
            <div>Your Platform IQ</div>
            <div className="color-special fw-bold fs-1">0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
