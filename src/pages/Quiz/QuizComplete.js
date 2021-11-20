import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import { getPlatform, getQuizByTitle, getPlatformIcon, getPlatformBanner } from "./../../API/API";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import award from "../../award.svg";
import "./styles.scss";

const QuizComplete = () => {
  const [platform, setPlatform] = useState({});
  const [quiz, setQuiz] = useState({});
  const [banner, setBanner] = useState("/banner.svg");
  const [platformIcon, setPlatformIcon] = useState("/platformIcon.svg");
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    getCurrentPlatform();
    getQuiz();
    getImageMedia();
  }, [params]);

  const getImageMedia = async () => {
    await getPlatformBanner(platform).then((banner) => {
      console.log(banner);
      setBanner(banner);
    });
    await getPlatformIcon(platform).then((icon) => {
      console.log(icon);
      setPlatformIcon(icon);
    });
  };
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
      <PlatformSubNav
        platformName={"Quiz: " + params.quiz}
        bannerSrc={banner}
        iconSrc={platformIcon}
      />
      <div className="content d-flex m-4 flex-row align-items-center">
        <div className="d-flex flex-column flex-md-fill color-secondary fw-bold fs-3 center">
          Your Score is: 100/100
        </div>
        <div className="information d-flex flex-column">
          <div className="searchBar searchBar--border">
            <input className="search" placeholder="Search"></input>
          </div>
          <div className="platform-text-block d-flex align-items-center justify-content-center mt-4 color-secondary fw-bold fs-3">
            {quiz.description}
          </div>
          <div className="platform-text-block iq d-flex flex-column align-items-center mt-4">
            <div className="color-secondary fw-bold fs-3"> Congratulations! </div>
          </div>
          <img src={award} alt="Icon" />
        </div>
      </div>
    </div>
  );
};
export default QuizComplete;
