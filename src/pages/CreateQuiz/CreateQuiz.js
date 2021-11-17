import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";

import { postCreateQuiz } from "../../API/API";
import QuestionCard from "../../components/Card/QuestionCard/QuestionCard";
import Button from "../../components/Button/Button";
import NavBar from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import LoadingOverlay from "../../components/LoadingIndicators/LoadingOverlay";

import "./styles.css";

const CreateQuiz = () => {
  const [questions, setQuestions] = useState([defaultQuestion()]);
  const [quizInfo, setQuizInfo] = useState(defaultQuiz());
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const history = useHistory();

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
    setQuestions((prevState) => [...prevState, defaultQuestion()]);
  };

  const deleteQuestion = (questionNumber) => {
    setQuestions((prevState) => prevState.filter((question, index) => questionNumber !== index));
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

  const publishQuiz = () => {
    if (!checkFields()) {
      alert("Fields are incomplete");
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
      correctAnswers,
    };
    quiz.timeLimit = parseInt(quiz.timeLimit);
    setIsLoading(true);
    postCreateQuiz(quiz)
      .then((res) => history.push(`/p/${params.platform}`))
      .catch((error) => {
        setIsLoading(false);
        alert("could not publish quiz");
      });
  };

  const checkFields = () => {
    return checkQuizTitle() && checkDescription() && checkTimer();
  };

  const checkQuizTitle = () => {
    return 1 <= quizInfo.quizTitle.length;
  };

  const checkDescription = () => {
    return 1 <= quizInfo.description.length;
  };

  const checkTimer = () => {
    const timeLimit = parseInt(quizInfo.timeLimit);
    return timeLimit && 0 < timeLimit;
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
          <a
            className="delete-question"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              deleteQuestion(parseInt(e.target.id.charAt(e.target.id.length - 1)));
            }}
          >
            <img id={`delete-question-${index}`} alt="delete question" src="/question_delete.svg" />
          </a>
        </div>
      );
    });
  };

  return (
    <div>
      <NavBar />
      <PlatformSubNav platformName={params.platform} />
      <div className="page-content d-flex flex-row justify-content-between m-4">
        <div id="quiz-controller" className="d-flex flex-column align-items-center">
          <div className="quiz-info d-flex flex-column align-items-center mb-5">
            <h2 className="color-secondary">Quiz Creation</h2>
            <div id="quiz-title-input" className="input-box">
              <textarea
                className="input"
                placeholder="Quiz Title"
                maxLength={75}
                onChange={(e) => setQuizTitle(e.target.value)}
              ></textarea>
            </div>
            <div id="quiz-description-input" className="input-box">
              <textarea
                className="input"
                placeholder="Description"
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div id="timer-input" className="input-box">
              <input
                className="input text-center"
                placeholder="Time Limit (seconds)"
                maxLength={3}
                onChange={(e) => setTimeLimit(e.target.value)}
              />
            </div>
            <Button onClick={addQuestion}>Add Question</Button>
          </div>
          <Button buttonStyle="btn--special" buttonSize="btn--large" onClick={publishQuiz}>
            Publish Quiz
          </Button>
        </div>
        <div className="quiz-cards d-flex flex-column flex-grow-1 me-4">
          {questions && renderCards()}
        </div>
      </div>
      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
};

const defaultQuestion = () => {
  return { body: "", answers: ["", "", "", ""], correctAnswer: 0 };
};

const defaultQuiz = () => {
  return { quizTitle: "", timeLimit: 60, description: "" };
};

export default CreateQuiz;
