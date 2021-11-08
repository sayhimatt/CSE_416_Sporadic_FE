import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";

import { postCreateQuiz } from "../../API/API";
import QuestionCard from "../../components/Card/QuestionCard/QuestionCard";
import Button from "../../components/Button/Button";
import NavBar from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";

import "./styles.css";

const CreateQuiz = () => {
  const [questions, setQuestions] = useState([defaultQuestion()]);
  const [quizInfo, setQuizInfo] = useState(defaultQuiz());
  const [cards, setCards] = useState([]);
  const params = useParams();
  const history = useHistory();

  useEffect(() => {
    renderCards();
  }, [questions]);

  const setQuizTitle = (e) => {
    setQuizInfo((prevState) => ({ ...prevState, quizTitle: e.target.value }));
  };

  const setDescription = (e) => {
    setQuizInfo((prevState) => ({ ...prevState, description: e.target.value }));
  };

  const setQuestionTitle = (e) => {
    const id = parseInt(e.target.id.charAt(1));
    setQuestions((prevState) =>
      prevState.map((question, index) =>
        index === id ? { ...question, body: e.target.value } : question,
      ),
    );
  };

  const addQuestion = () => {
    setQuestions((prevState) => [...prevState, defaultQuestion()]);
  };

  const deleteQuestion = (e) => {
    e.preventDefault();
    const id = parseInt(e.target.id.charAt(e.target.id.length - 1));
    setQuestions((prevState) => prevState.filter((question, index) => id !== index));
  };

  const setAnswerText = (e) => {
    const questionNumber = parseInt(e.target.id.charAt(1));
    const answerNumber = parseInt(e.target.id.charAt(3));
    setQuestions((prevState) =>
      prevState.map((question, index) =>
        index === questionNumber
          ? {
              ...question,
              answers: question.answers.map((answer, answerIndex) =>
                answerIndex === answerNumber ? e.target.value : answer,
              ),
            }
          : question,
      ),
    );
  };

  const setCorrectAnswer = (e) => {
    const questionNumber = parseInt(e.target.value.charAt(1));
    const answerNumber = parseInt(e.target.value.charAt(3));
    setQuestions((prevState) =>
      prevState.map((question, index) =>
        index === questionNumber ? { ...question, correctAnswer: answerNumber } : question,
      ),
    );
  };

  const publishQuiz = () => {
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
    postCreateQuiz(quiz)
      .then((res) => history.push(`/p/${params.platform}`))
      .catch((error) => {
        alert("could not publish quiz");
      });
  };

  const renderCards = () => {
    if (!questions) {
      return;
    }
    const cards = questions.map((question, index) => {
      return (
        <div className="d-flex flex-row">
          <QuestionCard
            key={index}
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
          <a className="delete-question" href="#" onClick={deleteQuestion}>
            <img id={`delete-question-${index}`} alt="delete question" src="/question_delete.svg" />
          </a>
        </div>
      );
    });
    setCards(cards);
  };

  return (
    <div>
      <NavBar />
      <PlatformSubNav platformName={params.platform} />
      <div className="page-content d-flex flex-row justify-content-between m-4">
        <div className="quiz-cards d-flex flex-column flex-grow-1">{cards}</div>
        <div className="d-flex flex-column align-items-center position-sticky">
          <div className="quiz-info d-flex flex-column align-items-center mb-5">
            <div className="input-box">
              <textarea
                className="input"
                placeholder="Quiz Title"
                maxLength={100}
                onChange={setQuizTitle}
              ></textarea>
            </div>
            <div className="input-box">
              <textarea
                className="input"
                placeholder="Description"
                maxLength={500}
                onChange={setDescription}
              ></textarea>
            </div>
            <Button onClick={addQuestion}>Add Question</Button>
          </div>
          <Button buttonStyle="btn--special" onClick={publishQuiz}>
            Publish Quiz
          </Button>
        </div>
      </div>
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
