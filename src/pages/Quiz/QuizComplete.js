import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import { getPlatform, getQuizByTitle } from "./../../API/API";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import "./styles.scss";

const QuizComplete = () => {
  const [platform, setPlatform] = useState({});
  const [quiz, setQuiz] = useState({});
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    getCurrentPlatform();
    getQuiz();
  }, [params]);

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
  const getQuiz = async () => {
    const platform = params.platform;
    const quiz = params.quiz;
    try {
      const response = await getQuizByTitle(platform, quiz);
      setQuiz(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <MainNav />
      <PlatformSubNav platformName={"Quiz: " + params.quiz} />
      <div className="content d-flex m-4 flex-row align-items-start">
        <div className="d-flex flex-column flex-md-fill">Your Score is: 100/100</div>
        <div className="information d-flex flex-column">
          <div className="searchBar searchBar--border">
            <input className="search" placeholder="Search"></input>
          </div>
          <div className="platform-text-block d-flex align-items-center justify-content-center mt-4">
            {quiz.description}
          </div>
          <div className="platform-text-block iq d-flex flex-column align-items-center mt-4">
            <div className="color-special fw-bold fs-1"> Congratulations! </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuizComplete;
