import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import {
  getPlatform,
  getQuizByTitle,
  getPlatformIcon,
  getPlatformBanner,
  getAllUserIcons,
  putComment,
} from "./../../API/API";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import award from "../../award.svg";
import "./styles.scss";
import SmallCard from "../../components/Card/SmallCard/SmallCard";
import { Alert } from "react-bootstrap";

const QuizComplete = () => {
  const [platform, setPlatform] = useState({});
  const [quiz, setQuiz] = useState({});
  const [banner, setBanner] = useState("/banner.svg");
  const [platformIcon, setPlatformIcon] = useState("/platformIcon.svg");
  const [comment, setComment] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [userIcons, setUserIcons] = useState();
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    getCurrentPlatform();
    getQuiz();
    getImageMedia();
  }, [params]);

  const getImageMedia = async () => {
    await getPlatformBanner(params.platform).then((banner) => {
      console.log(banner);
      setBanner(banner);
    });
    await getPlatformIcon(params.platform).then((icon) => {
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
      console.log(response);
      const pictures = await getAllUserIcons(response.comments.map((comment) => comment.user));
      setUserIcons(pictures);
    } catch (error) {
      console.log(error);
    }
  };

  const makeComment = () => {
    putComment(params.platform, params.quiz, comment)
      .then()
      .catch((error) => {
        setShowAlert(true);
      });
  };

  const generateCommentCards = () => {
    console.log("a");
    console.log(quiz.comments);
    return quiz.comments.map((comment) => (
      <SmallCard
        profilePicture={userIcons[comment.user]}
        username={comment.user}
        rightCard={<div className="card-comment">{comment.text}</div>}
      />
    ));
  };

  return (
    <div>
      <MainNav />
      <PlatformSubNav platformName={"Quiz: " + params.quiz} iconSrc={platformIcon} />
      <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
        You can only make one comment per quiz
      </Alert>
      <div className="flex-row input-box w-75">
        <textarea
          className="input"
          placeholder="Enter a comment"
          onChange={(e) => setComment(e.target.value)}
        />
        <input
          type="submit"
          value="Post"
          className="btn btn-primary btn-block"
          onClick={makeComment}
        />
      </div>
      <div className="content d-flex m-4 flex-row">
        <div className="d-flex flex-column flex-md-fill color-secondary fw-bold fs-3">
          Your Score is: 100/100
          {quiz.comments && userIcons && generateCommentCards()}
        </div>
        <div className="information d-flex flex-column m-4">
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
