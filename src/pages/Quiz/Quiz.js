import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

import { getPlatform, postStartQuiz } from "./../../API/API";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import QuestionCard from "../../components/Card/QuestionCard/QuestionCard.js";
import Timer from "../../components/Timer/Timer";
import useInterval from "../../components/Timer/Interval";
import award from "../../award.svg";
import Button from "../../components/Button/Button";
import "./styles.scss";

const Quiz = () => {
  const [platform, setPlatform] = useState({});
  const [questions, setQuestions] = useState([]);
  const [questionsCards, setQuestionCards] = useState([]);
  const [quiz, setQuiz] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const history = useHistory();
  const params = useParams();
  let delay = 1000;
  useEffect(() => {
    getCurrentPlatform();
    getQuestions();
  }, [params]);

  useEffect(() => {
    renderCards();
  }, [questions]);
  useInterval(() => {
    if (timeLeft == 0) {
      quizOver();
      delay = 0;
      return;
    } else {
      setTimeLeft(timeLeft - 1);
    }
  }, delay);
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
      const response = await postStartQuiz(platform, quiz);
      setQuestions(response.questions);
      setQuiz(response);
      setTimeLeft(response.timeLimit);
    } catch (error) {
      console.log(error);
    }
  };

  const renderCards = () => {
    const cards = questions.map((question, index) => {
      return (
        <QuestionCard
          key={question._id + index}
          information={{
            question: question.body,
            questionIndex: index,
            answers: question.answers,
          }}
        />
      );
    });
    setQuestionCards(cards);
  };
  const quizOver = () => {
    history.push("/p/movies/sporadic/complete");
    alert("Quiz is over now navigating to end of quiz page!");
  };
  return (
    <div>
      <MainNav />
      <PlatformSubNav platformName={"Quiz: " + params.quiz} />
      <div className="content d-flex m-4 flex-row align-items-start">
        <div className="d-flex flex-column flex-md-fill">{questionsCards}</div>
        <div className="information d-flex flex-column">
          <div className="searchBar searchBar--border">
            <input className="search" placeholder="Search"></input>
          </div>
          <div className="platform-text-block d-flex align-items-center justify-content-center mt-4 fs-1 color-secondary">
            {quiz.description}
          </div>
          <div className="platform-text-block iq d-flex flex-column align-items-center mt-4">
            <div className="color-special fw-bold fs-1">Time Left: </div>
            <Timer
              timerSeconds={String(Math.trunc(timeLeft % 60)).padStart(2, "0")}
              timerMinutes={String(Math.trunc(timeLeft / 60)).padStart(2, "0")}
            />
          </div>
          <div className="platform-text-block iq d-flex flex-column align-items-center mt-4">
            <div className="color-secondary fw-bold fs-1">Star Trophy</div>
            <img src={award} alt="Icon" />
            <div className="color-secondary fw-bold fs-1">
              Score Required: <br /> 100%
            </div>
          </div>
          <Button onClick={quizOver}>Submit</Button>
        </div>
      </div>
    </div>
  );
};
export default Quiz;
