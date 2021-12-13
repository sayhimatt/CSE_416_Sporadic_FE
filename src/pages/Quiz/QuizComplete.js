import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import Button from "../../components/Buttons/Button/Button";
import SmallCard from "../../components/Card/SmallCard/SmallCard";
import {
  getQuizByTitle,
  getPlatformIcon,
  getAllUserIcons,
  getAwardIcon,
  putComment,
  patchVote,
  getQuizIcon,
} from "./../../API/API";
import { Alert } from "react-bootstrap";

import "./styles.scss";

const VOTE_IMAGES = {
  like: { default: "/like.png", filled: "/like_filled.png" },
  dislike: { default: "/dislike.png", filled: "/dislike_filled.png" },
};

const QuizComplete = () => {
  const [quiz, setQuiz] = useState();
  const [platformIcon, setPlatformIcon] = useState("/platformIcon.png");
  const [award, setAward] = useState("/award.svg");
  const [quizIcon, setQuizIcon] = useState("/icon.png")
  const [awardTitle, setAwardTitle] = useState("Trophy");
  const [awardWon, setAwardWon] = useState(false);
  const [comment, setComment] = useState("");
  const [showAlert, setShowAlert] = useState({ show: false, message: "" });
  const [userIcons, setUserIcons] = useState();
  const [vote, setVote] = useState("none");
  const [voteImages, setVoteImages] = useState({
    upvote: {
      src: VOTE_IMAGES.like.default,
      enter: VOTE_IMAGES.like.filled,
      leave: VOTE_IMAGES.like.default,
    },
    downvote: {
      src: VOTE_IMAGES.dislike.default,
      enter: VOTE_IMAGES.dislike.filled,
      leave: VOTE_IMAGES.dislike.default,
    },
  });
  const params = useParams();

  useEffect(() => {
    getQuiz();
    getImageMedia();
  }, [params]);

  useEffect(() => {
    setAppropriateVoteImages();
  }, [vote]);

  const getImageMedia = async () => {
    await getPlatformIcon(params.platform).then((icon) => {
      console.log(icon);
      setPlatformIcon(icon);
    });
    await getAwardIcon(params.platform, params.quiz).then((icon) => {
      setAward(icon);
    });
    await getQuizIcon(params.platform, params.quiz).then((icon) => {
      setQuizIcon(icon);
    });
  };

  const getQuiz = async () => {
    const platformName = params.platform;
    const quizName = params.quiz;
    try {
      const response = await getQuizByTitle(platformName, quizName);
      if (response.awardRequirement <= response.score.score) {
        setAwardWon(true);
      }
      console.log(response);
      setQuiz(response);
      const pictures = await getAllUserIcons(response.comments.map((comment) => comment.user));
      setUserIcons(pictures);
      setVote(response.score.vote);
      setAwardTitle(response.awardTitle);
    } catch (error) {
      console.log(error);
    }
  };

  const setAppropriateVoteImages = () => {
    if (vote === "upvote") {
      setVoteImages({
        upvote: {
          src: VOTE_IMAGES.like.filled,
          enter: VOTE_IMAGES.like.filled,
          leave: VOTE_IMAGES.like.filled,
        },
        downvote: {
          src: VOTE_IMAGES.dislike.default,
          enter: VOTE_IMAGES.dislike.filled,
          leave: VOTE_IMAGES.dislike.default,
        },
      });
    } else if (vote === "downvote") {
      setVoteImages({
        upvote: {
          src: VOTE_IMAGES.like.default,
          enter: VOTE_IMAGES.like.filled,
          leave: VOTE_IMAGES.like.default,
        },
        downvote: {
          src: VOTE_IMAGES.dislike.filled,
          enter: VOTE_IMAGES.dislike.filled,
          leave: VOTE_IMAGES.dislike.filled,
        },
      });
    } else {
      setVoteImages({
        upvote: {
          src: VOTE_IMAGES.like.default,
          enter: VOTE_IMAGES.like.filled,
          leave: VOTE_IMAGES.like.default,
        },
        downvote: {
          src: VOTE_IMAGES.dislike.default,
          enter: VOTE_IMAGES.dislike.filled,
          leave: VOTE_IMAGES.dislike.default,
        },
      });
    }
  };

  const makeComment = () => {
    putComment(params.platform, params.quiz, comment)
      .then((res) => {
        getQuiz();
      })
      .catch((error) => {
        setShowAlert({ show: true, message: "You can only make one comment per quiz" });
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

  const makeVote = (newVote) => {
    const platformName = params.platform;
    const quizName = params.quiz;
    if (vote === newVote) {
      newVote = "none";
    }
    patchVote(platformName, quizName, newVote)
      .then((res) => setVote(newVote))
      .catch((e) => setShowAlert({ show: true, message: "Could not record your vote" }));
  };

  if (!quiz) {
    return <MainNav />;
  } else if (quiz && awardWon) {
    return (
      <div>
        <MainNav />
        <PlatformSubNav platformName={params.platform} iconSrc={platformIcon}/>
        {/* <PlatformSubNav platformName={params.platform} iconSrc={quizIcon} quizName={params.quiz} /> */}
        <div className="quiz-alerts">
          <Alert
            show={showAlert.show}
            variant="danger"
            onClose={() => setShowAlert({ show: false, message: "" })}
            dismissible
          >
            {showAlert.message}
          </Alert>
        </div>
        <div className="page-content d-flex flex-column align-items-center">
          <div id="main-results">
            <div id="score-bubble">{`${Math.round(
              (quiz.score.score / quiz.totalQuestions) * 100,
            )}%`}</div>
            <img id="icon-bubble" src={quizIcon} alt="Icon" /> 
            <div id="results-breakdown">


              <div id="score-breakdown">
                <div className="d-flex flex-column align-items-center">
                  <div id="questions-right">{quiz.score.score}</div>
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
                <div className="ms-4 text-center">
                  Earned:
                  <br />
                  {awardTitle}
                </div>
              </div>
            </div>
          </div>
          <div id="results-feedback">  
          {/* <img id="icon-bubble" src={quizIcon} alt="Icon" />    */}
     
            <div id="feedback">
              <div id="quiz-title">{quiz.title}</div>
              <div className="d-flex justify-content-around w-75 mt-3">
                <img
                  id="upvote"
                  className="feedback-image"
                  src={voteImages.upvote.src}
                  alt="upvote"
                  onClick={() => makeVote("upvote")}
                  onMouseEnter={(e) => (e.target.src = voteImages.upvote.enter)}
                  onMouseLeave={(e) => (e.target.src = voteImages.upvote.leave)}
                />
                <img
                  id="downvote"
                  className="feedback-image"
                  src={voteImages.downvote.src}
                  alt="downvote"
                  onClick={() => makeVote("downvote")}
                  onMouseEnter={(e) => (e.target.src = voteImages.downvote.enter)}
                  onMouseLeave={(e) => (e.target.src = voteImages.downvote.leave)}
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
              <div id="comments-list" className="mb-5">
                {quiz.comments && userIcons && generateCommentCards()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <MainNav />
        <PlatformSubNav platformName={params.platform} iconSrc={platformIcon}/>
        <div className="quiz-alerts">
          <Alert
            show={showAlert.show}
            variant="danger"
            onClose={() => setShowAlert({ show: false, message: "" })}
            dismissible
          >
            {showAlert.message}
          </Alert>
        </div>
        <div className="page-content d-flex flex-column align-items-center">
          <div id="main-results">
            <div id="score-bubble">
              {quiz.score.score || quiz.score.score === 0 ? (
                `${Math.round((quiz.score.score / quiz.totalQuestions) * 100)}%`
              ) : (
                <div className="fs-3">Incomplete</div>
              )}
            </div>
            <div id="results-breakdown">
              <div id="score-breakdown">
                <div className="d-flex flex-column align-items-center">
                  <div id="questions-right">{quiz.score.score ? quiz.score.score : 0}</div>
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
                <div className="ms-3 fs-5 text-center">
                  Sorry! You did not score high enough to earn the award
                </div>
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
                  src={voteImages.upvote.src}
                  alt="upvote"
                  onClick={() => makeVote("upvote")}
                  onMouseEnter={(e) => (e.target.src = voteImages.upvote.enter)}
                  onMouseLeave={(e) => (e.target.src = voteImages.upvote.leave)}
                />
                <img
                  id="downvote"
                  className="feedback-image"
                  src={voteImages.downvote.src}
                  alt="downvote"
                  onClick={() => makeVote("downvote")}
                  onMouseEnter={(e) => (e.target.src = voteImages.downvote.enter)}
                  onMouseLeave={(e) => (e.target.src = voteImages.downvote.leave)}
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
              <div id="comments-list" className="mb-5">
                {quiz.comments && userIcons && generateCommentCards()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default QuizComplete;
