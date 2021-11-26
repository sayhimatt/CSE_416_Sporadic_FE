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
import Button from "../../components/Buttons/Button/Button";
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
      .then((res) => {
        getQuiz();
      })
      .catch((error) => {
        setShowAlert(true);
      });
  };

  const generateCommentCards = () => {
    return quiz.comments.map((comment) => (
      <SmallCard
        key={comment.user}
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
      <div className="quiz-alerts">
        <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>
          You can only make one comment per quiz
        </Alert>
      </div>
      <div className="page-content d-flex flex-column align-items-center">
        <div id="main-results">
          <div id="score-bubble">{`${Math.round((quiz.score / quiz.totalQuestions) * 100)}%`}</div>
          <div id="results-breakdown">
            <div id="score-breakdown">
              <div className="d-flex flex-column align-items-center">
                <div id="questions-right">{quiz.score}</div>
                <div className="score-divider" />
                <div id="total-questions">{quiz.totalQuestions}</div>
              </div>
              <div className="d-flex flex-column align-items-start ms-4">
                <div>Correct</div>
                <div className="score-divider invisible" />
                <div>Questions</div>
              </div>
            </div>
            <div id="award-section">
              <img id="trophy-earned" src={award} alt="Icon" />
              <div className="ms-3">Trophy Name</div>
            </div>
          </div>
        </div>
        <div id="results-feedback">
          <div id="feedback">
            <div id="quiz-title">{quiz.title}</div>
            <div className="d-flex justify-content-around w-75 mt-3">
              <img
                id="upvote"
                className="feedback-image"
                src="/like.png"
                alt="upvote"
                onMouseEnter={(e) => (e.target.src = "/like_filled.png")}
                onMouseLeave={(e) => (e.target.src = "/like.png")}
              />
              <img
                id="downvote"
                className="feedback-image"
                src="/dislike.png"
                alt="downvote"
                onMouseEnter={(e) => (e.target.src = "/dislike_filled.png")}
                onMouseLeave={(e) => (e.target.src = "/dislike.png")}
              />
            </div>
          </div>
          <div id="comments-section">
            <div id="make-comment">
              <div className="comment-box flex-grow-1">
                <textarea
                  className="input"
                  placeholder="Enter a comment"
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="ms-3">
                <Button onClick={makeComment}>Make Comment</Button>
              </div>
            </div>
            <div id="comments-list">{quiz.comments && userIcons && generateCommentCards()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuizComplete;
