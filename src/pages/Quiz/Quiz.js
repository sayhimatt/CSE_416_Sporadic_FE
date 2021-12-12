import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import { postStartQuiz, postSubmitQuiz, getPlatformIcon, getPlatformBanner, getAwardIcon } from "./../../API/API";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import QuestionCard from "../../components/Card/QuestionCard/QuestionCard.js";
import Timer from "../../components/Timer/Timer";
import useInterval from "../../components/Timer/Interval";
import Button from "react-bootstrap/Button";
import InfoModal from "../../components/Modals/InfoModal/InfoModal";
import "./styles.scss";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [questionsCards, setQuestionCards] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isAlreadySubmittedModalVisible, setIsAlreadySubmittedModalVisible] = useState(false);
  const [isSubmittedModalVisible, setIsSubmittedModalVisible] = useState(false);
  const [award, setAward] = useState("/award.svg");
  const [awardTitle, setAwardTitle] = useState("Trophy");
  const [awardRequirement, setAwardRequirement] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [banner, setBanner] = useState("/banner.jpg");
  const [platformIcon, setPlatformIcon] = useState("/platformIcon.png");
  const history = useHistory();
  const params = useParams();

  let hasSent = false;

  let delay = 1000;

  useEffect(() => {
    getQuestions();
    getImageMedia();
  }, [params]);

  useEffect(() => {
    renderCards();
  }, [questions]);

  useInterval(async () => {
    if (timeLeft == 0) {
      if (!hasSent) {
        await quizOver();
        hasSent = true;
      }
      delay = 0;
      return;
    } else {
      setTimeLeft(timeLeft - 1);
    }
  }, delay);

  const getImageMedia = async () => {
    await getPlatformBanner(params.platform).then((banner) => {
      //console.log(banner);
      setBanner(banner);
    });
    await getPlatformIcon(params.platform).then((icon) => {
      //console.log(icon);
      setPlatformIcon(icon);
    });
    await getAwardIcon(params.platform, params.quiz).then((icon) => {
      setAward(icon);
    })
  };

  const getQuestions = async () => {
    const platform = params.platform;
    const quiz = params.quiz;
    try {
      const response = await postStartQuiz(platform, quiz);
      setAward(response.award);
      setQuestions(response.questions);
      initAnswers(response.questions);
      setTimeLeft(response.timeLimit);
      setAwardTitle(response.awardTitle);
      setAwardRequirement(response.awardRequirement);
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) setIsAlreadySubmittedModalVisible(true);
    }
  };

  const initAnswers = (questionList) => {
    const answers = new Array(questionList.length);
    for (let index = 0; index < questionList.length; index++) {
      answers[index] = -1;
    }
    setAnswers(answers);
  };

  const assignAnswer = (questionIndex, answerIndex) => {
    const newChoices = answers;
    newChoices[questionIndex] = answerIndex;
    setAnswers(newChoices);
  };

  const renderCards = () => {
    const cards = questions.map((question, index) => {
      return (
        <QuestionCard
          key={"Question" + index}
          information={{
            question: question.body,
            questionIndex: index,
            answers: question.answers,
          }}
          correctAnswerHandler={assignAnswer}
        />
      );
    });
    setQuestionCards(cards);
  };

  const submitAnswers = () => {
    // Submit all selected answers from each question card.
    postSubmitQuiz(params.platform, params.quiz, answers);
  };

  const quizOver = async () => {
    if (isAlreadySubmittedModalVisible) return;

    try {
      await submitAnswers();
    } catch (error) {
      console.log(error);
    }

    setIsSubmittedModalVisible(true);
  };

  return (
    <div>
      <MainNav />
      <PlatformSubNav
        platformName={"Quiz: " + params.quiz}
        bannerSrc={banner}
        iconSrc={platformIcon}
      />
      <div className="content d-flex m-4 flex-row align-items-start">
        <div className="d-flex flex-column flex-md-fill w-75">{questionsCards}</div>
        <div id="quiz-sidebar">
          <Timer
            timerSeconds={String(Math.trunc(timeLeft % 60)).padStart(2, "0")}
            timerMinutes={String(Math.trunc(timeLeft / 60)).padStart(2, "0")}
          />
          <div className="award-box d-flex flex-column align-items-center">
            <div className="color-secondary fw-bold fs-3 mb-3">{awardTitle}</div>
            <img id="quiz-award-image" src={award} alt="Icon" />
            <div className="color-secondary fs-5">
              Earn with <b> {awardRequirement} </b> correct answer(s) or more
            </div>
          </div>
          <Button size="lg" className="submit-button" onClick={quizOver}>
            Submit
          </Button>
        </div>
      </div>
      <InfoModal
        title="Quiz already submitted!"
        body="You will now be redirected to the quiz completed page."
        buttonText="Take me there!"
        onButtonClicked={() => {
          history.push(`/p/${params.platform}/${params.quiz}/complete`);
        }}
        isVisible={isAlreadySubmittedModalVisible}
      />
      <InfoModal
        title="Quiz is over now!"
        body="You will now be redirected to the quiz completed page."
        buttonText="Take me there!"
        onButtonClicked={() => {
          history.push(`/p/${params.platform}/${params.quiz}/complete`);
        }}
        isVisible={isSubmittedModalVisible}
      />
    </div>
  );
};
export default Quiz;
