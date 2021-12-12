import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import Alert from "react-bootstrap/Alert";

import {
  postCreateQuiz,
  getPlatformIcon,
  getPlatformBanner,
  generateSetQuizIconURL,
  generateSetQuizAwardIconURL,
  setImage,
} from "../../API/API";
import QuestionCard from "../../components/Card/QuestionCard/QuestionCard";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import Button from "../../components/Buttons/Button/Button";
import NavBar from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import LoadingOverlay from "../../components/LoadingIndicators/LoadingOverlay";
import "./styles.scss";

const CreateQuiz = () => {
  const [questions, setQuestions] = useState([defaultQuestion()]);
  const [quizInfo, setQuizInfo] = useState(defaultQuiz());
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ show: false, messages: [] });
  const [banner, setBanner] = useState("/banner.svg");
  const [platformIcon, setPlatformIcon] = useState("/platformIcon.svg");
  const [images, setImages] = useState({ quizIcon: "/quizIcon.png", awardIcon: "/award.svg" });
  const [imageUploaders, setImageUploaders] = useState({ quizIcon: false, awardIcon: false });
  const [awardTitle, setAwardTitle] = useState("");
  const [awardRequirement, setAwardRequirement] = useState(0);
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    getImageMedia();
  }, [params]);

  useEffect(() => {
    renderCards();
  }, [questions]);

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
  const setQuizTitle = (newTitle) => {
    setQuizInfo((prevState) => ({ ...prevState, quizTitle: newTitle }));
  };

  const setDescription = (newDescription) => {
    setQuizInfo((prevState) => ({ ...prevState, description: newDescription }));
  };

  const setTimeLimit = (newTimeLimit) => {
    setQuizInfo((prevState) => ({ ...prevState, timeLimit: newTimeLimit }));
  };

  const setQuestionTitle = (questionNumber, title) => {
    setQuestions((prevState) =>
      prevState.map((question, index) =>
        index === questionNumber ? { ...question, body: title } : question,
      ),
    );
  };

  const addQuestion = () => {
    removeErrorMessage("Your quiz");
    if (questions.length >= 30) {
      setErrors((prevState) => ({
        ...prevState,
        messages: prevState.messages.concat([
          "Your quiz should be less than 30 questions keep it simple!",
        ]),
        show: true,
      }));
      return;
    }
    setQuestions((prevState) => [...prevState, defaultQuestion()]);
  };

  const deleteQuestion = (questionNumber) => {
    removeErrorMessage("Your quiz");
    if (questions.length === 1) {
      setErrors((prevState) => ({
        ...prevState,
        messages: prevState.messages.concat(["Your quiz must have at least one question"]),
        show: true,
      }));
      return;
    }
    setQuestions((prevState) => prevState.filter((question, index) => questionNumber !== index));
  };

  const addChoice = (questionNumber) => {
    removeErrorMessage("Ten is too many choices for a single question");
    removeErrorMessage("All questions");
    if (questions[questionNumber].answers.length < 10) {
      console.log(questions[questionNumber].answers.length);
      setQuestions((prevState) =>
        prevState.map((question, index) =>
          index === questionNumber
            ? {
                ...question,
                answers: [...question.answers, ""],
              }
            : question,
        ),
      );
    } else {
      // Set an error message
      setErrors((prevState) => ({
        ...prevState,
        messages: prevState.messages.concat(["Ten is too many choices for a single question"]),
        show: true,
      }));
    }
    setQuestions((prevState) => [...prevState]);
  };

  const subChoice = (questionNumber) => {
    removeErrorMessage("Ten is too many choices for a single question");
    removeErrorMessage("All questions");
    if (questions[questionNumber].answers.length > 2) {
      setQuestions((prevState) =>
        prevState.map((question, index) =>
          index === questionNumber
            ? {
                ...question,
                answers: question.answers.slice(0, question.answers.length - 1),
              }
            : question,
        ),
      );
    } else {
      // Set an error message
      setErrors((prevState) => ({
        ...prevState,
        messages: prevState.messages.concat(["All questions must have at least two choices"]),
        show: true,
      }));
    }
    setQuestions((prevState) => [...prevState]);
  };

  const setAnswerText = (questionNumber, answerNumber, text) => {
    setQuestions((prevState) =>
      prevState.map((question, index) =>
        index === questionNumber
          ? {
              ...question,
              answers: question.answers.map((answer, answerIndex) =>
                answerIndex === answerNumber ? text : answer,
              ),
            }
          : question,
      ),
    );
  };

  const setCorrectAnswer = (questionNumber, answerNumber) => {
    setQuestions((prevState) =>
      prevState.map((question, index) =>
        index === questionNumber ? { ...question, correctAnswer: answerNumber } : question,
      ),
    );
  };

  const customIconSubmit = (file) => {
    setImages((prevState) => ({ ...prevState, quizIcon: file }));
    setImageUploaders((prevState) => ({ ...prevState, quizIcon: false }));
  };

  const customAwardIconSubmit = (file) => {
    setImages((prevState) => ({ ...prevState, awardIcon: file }));
    setImageUploaders((prevState) => ({ ...prevState, awardIcon: false }));
  };

  const sendImagesToAWS = async () => {
    const promises = [];
    if (images.quizIcon !== "/quizIcon.svg") {
      promises.push(
        generateSetQuizIconURL(params.platform, quizInfo.quizTitle)
          .then((putURL) => setImage(putURL, images.quizIcon))
          .catch((e) => {
            throw `Error Uploading: ${e}`;
          }),
      );
    }
    if (images.awardIcon !== "/award.svg") {
      promises.push(
        generateSetQuizAwardIconURL(params.platform, quizInfo.quizTitle)
          .then((putURL) => setImage(putURL, images.awardIcon))
          .catch((e) => {
            throw `Error Uploading: ${e}`;
          }),
      );
    }
    return await Promise.all(promises).catch((e) => {
      throw `Error Uploading: ${e}`;
    });
  };

  const publishQuiz = () => {
    if (!checkFields()) {
      console.log("Bad check");
      return;
    }
    const correctAnswers = questions.map((question) => question.correctAnswer);
    const quizQuestions = questions.map((question) => ({
      body: question.body,
      answers: question.answers,
    }));
    const quiz = {
      ...quizInfo,
      platformTitle: params.platform,
      questions: quizQuestions,
      awardTitle: awardTitle,
      correctAnswers,
    };
    quiz.timeLimit = parseInt(quiz.timeLimit);
    quiz.awardRequirement = parseInt(awardRequirement);
    setIsLoading(true);
    postCreateQuiz(quiz)
      .then(() => {
        try {
          sendImagesToAWS();
        } catch (e) {
          alert(e);
        }
        history.push(`/p/${params.platform}`);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setErrors({ show: true, messages: ["Quiz name already taken"] });
      });
  };

  const checkFields = () => {
    setErrors({ show: false, messages: [] });
    const validQuizTitle = checkQuizTitle();
    const validDescription = checkDescription();
    const validTimer = checkTimer();
    const validQuestions = checkQuestions();
    const validAnswers = checkAnswers();
    const validAwardReq = checkAwardRequirement(awardRequirement);
    const validAwardTitle = checkAwardTitle();
    if (
      !validQuizTitle ||
      !validDescription ||
      !validTimer ||
      !validQuestions ||
      !validAnswers ||
      !validAwardReq ||
      !validAwardTitle
    ) {
      setErrors((prevState) => ({ ...prevState, show: true }));
      return false;
    }
    return true;
  };

  const checkQuizTitle = () => {
    if (quizInfo.quizTitle.length === 0) {
      addErrorMessage("Quiz title cannot be empty");
      return false;
    }
    return true;
  };

  const checkDescription = () => {
    if (quizInfo.description.length === 0) {
      addErrorMessage("Description cannot be empty");
      return false;
    }
    return true;
  };

  const checkTimer = () => {
    if (!parseInt(quizInfo.timeLimit) || quizInfo.timeLimit < 60 || quizInfo.timeLimit > 600) {
      addErrorMessage("Quiz time must a number between 60 and 600");
      return false;
    }
    return true;
  };

  const checkQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].body === "") {
        addErrorMessage("All questions must have a title");
        return false;
      }
    }
    return true;
  };

  const checkAnswers = () => {
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].answers.includes("")) {
        addErrorMessage("Answer choices cannot be left empty");
        return false;
      }
      return true;
    }
  };

  const checkAwardRequirement = (awardReq) => {
    if (awardReq < 1 || awardReq > questions.length) {
      addErrorMessage(`Award Requirement Invalid, Pick [1 - ${questions.length}]`);
      return false;
    } else {
      setAwardRequirement(awardReq);
      return true;
    }
  };
  const checkAwardTitle = () => {
    if (awardTitle.length <= 1 || awardTitle.length > 30) {
      addErrorMessage(`Award Title Invalid Size Maximum Length of 30 Characters`);
      return false;
    } else {
      return true;
    }
  };

  const addErrorMessage = (message) => {
    setErrors((prevState) => ({
      ...prevState,
      messages: prevState.messages.concat([message]),
    }));
  };

  const renderCards = () => {
    return questions.map((question, index) => {
      return (
        <div key={`Q${index}`} className="d-flex flex-row">
          <QuestionCard
            information={{
              question: question.body,
              questionIndex: index,
              answers: question.answers,
              choice: question.correctAnswer,
            }}
            create={true}
            titleHandler={setQuestionTitle}
            answerTextHandler={setAnswerText}
            correctAnswerHandler={setCorrectAnswer}
          />
          <div className="mods mt-3 d-flex flex-column">
            <a
              className="delete-question"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                deleteQuestion(parseInt(e.target.id.split("-")[2]));
              }}
            >
              <img
                id={`delete-question-${index}`}
                alt="delete question"
                src="/question_delete.svg"
              />
            </a>
            <a
              className="add-choice"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                addChoice(parseInt(e.target.id.split("-")[2]));
              }}
            >
              <img id={`add-choice-${index}`} alt="add choice" src="/addChoice.svg" />
            </a>
            <a
              className="sub-choice"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                subChoice(parseInt(e.target.id.split("-")[2]));
              }}
            >
              <img id={`sub-choice-${index}`} alt="remove choice" src="/subChoice.svg" />
            </a>
          </div>
        </div>
      );
    });
  };

  const renderErrors = () => {
    if (errors.messages.length === 0) {
      return;
    }
    return (
      <Alert
        variant="danger"
        show={errors.show}
        onClose={() => setErrors({ show: false, messages: [] })}
        dismissible
      >
        {errors.messages.map((message, index) => (
          <div key={`error-${index}`}>{message}</div>
        ))}
      </Alert>
    );
  };

  return (
    <div>
      <NavBar />
      <PlatformSubNav
        platformName={"Quiz: " + quizInfo.quizTitle}
        bannerSrc={banner}
        iconSrc={platformIcon}
      />
      <div className="quiz-alerts">{renderErrors()}</div>
      <div className="page-content d-flex flex-row justify-content-between m-4">
        <div id="quiz-controller" className="d-flex flex-column align-items-center">
          <div className="quiz-info">
            <h2 className="color-secondary">Quiz Creation</h2>
            <div className="quiz-info-section">
              <label>Title</label>
              <div id="quiz-title-input" className="input-box">
                <textarea
                  className="input"
                  placeholder="Quiz Title"
                  maxLength={75}
                  onChange={(e) => setQuizTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="quiz-info-section">
              <label>About</label>
              <div id="quiz-description-input" className="input-box">
                <textarea
                  className="input"
                  placeholder="Description"
                  maxLength={500}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex flex-fill flex-row w-100">
              <div className="d-flex flex-fill flex-column align-items-center">
                <div className="quiz-info-section quiz-info-limit align-items-center">
                  <label>Time Limit (in seconds)</label>
                  <div id="timer-input" className="input-box w-50">
                    <input
                      className="input text-center"
                      placeholder="Time Limit"
                      maxLength={3}
                      onChange={(e) => setTimeLimit(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    buttonSize="btn--large"
                    onClick={() =>
                      setImageUploaders((prevState) => ({ ...prevState, awardIcon: true }))
                    }
                  >
                    Upload Award Icon
                  </Button>
                </div>
                <div className="mt-4">
                  <Button
                    buttonSize="btn--large"
                    onClick={() =>
                      setImageUploaders((prevState) => ({ ...prevState, quizIcon: true }))
                    }
                  >
                    Upload Quiz Icon
                  </Button>
                </div>
              </div>
              <div className="d-flex flex-fill flex-column align-items-center">
                <div className="quiz-info-section align-items-center">
                  <label>Trophy Requirement</label>
                  <div id="timer-input" className="input-box w-50">
                    <input
                      className="input text-center"
                      placeholder={"Pick 1" + " - " + questions.length}
                      maxLength={2}
                      onChange={(e) => checkAwardRequirement(e.target.value)}
                    />
                  </div>
                </div>
                <div className="d-flex flex-row w-100 align-items-center">
                  <img
                    id="trophy"
                    src={
                      images.awardIcon === "/award.svg"
                        ? "/award.svg"
                        : URL.createObjectURL(images.awardIcon)
                    }
                    alt="Icon"
                  />
                  <div className="input-box m-4">
                    <input
                      className="input text-center"
                      placeholder="Trophy Title"
                      maxLength={30}
                      onChange={(e) => setAwardTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-1 d-flex flex-row w-100 align-items-center">
                  <img
                    id="quiz-icon"
                    src={
                      images.quizIcon === "/quizIcon.png"
                        ? "/quizIcon.png"
                        : URL.createObjectURL(images.quizIcon)
                    }
                    alt="Icon"
                  />
                  <div className="quiz-info-section align-items-left mx-4">
                    <label>Quiz Icon</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="prime-buttons d-flex flex-column w-50">
            <Button buttonStyle="btn--primary" buttonSize="btn--large" onClick={addQuestion}>
              Add Question
            </Button>
            <Button buttonStyle="btn--special" buttonSize="btn--large" onClick={publishQuiz}>
              Publish Quiz
            </Button>
          </div>
        </div>
        <div className="quiz-cards d-flex flex-column flex-grow-1 me-4">
          {questions && renderCards()}
        </div>
      </div>
      <div className="uploader">
        <ImageUploader
          visible={imageUploaders.quizIcon}
          desiredFile="quiz icon"
          desiredQuiz={quizInfo.quizTitle}
          desiredPlatform={params.platform}
          visibilityHandler={() =>
            setImageUploaders((prevState) => ({ ...prevState, quizIcon: false }))
          }
          customSubmit={customIconSubmit}
        />
      </div>
      <div className="uploader">
        <ImageUploader
          visible={imageUploaders.awardIcon}
          desiredFile="award icon"
          desiredQuiz={quizInfo.quizTitle}
          desiredPlatform={params.platform}
          visibilityHandler={() =>
            setImageUploaders((prevState) => ({ ...prevState, awardIcon: false }))
          }
          customSubmit={customAwardIconSubmit}
        />
      </div>
      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
};

const defaultQuestion = () => {
  return { body: "", answers: ["", "", "", ""], correctAnswer: 0 };
};

const defaultQuiz = () => {
  return { quizTitle: "", timeLimit: "", description: "" };
};

export default CreateQuiz;
