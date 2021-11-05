import React from "react";

const QuizReducer = (state, action) => {
  switch (action.type) {
    case "SET_QUESTION_TITLE":
      return setQuestionTitle(state, action.payload);

    case "SET_CHOICE":
      return setChoice(state, action.payload);

    case "SET_ANSWER":
      return setAnswer(state, action.payload);

    case "SET_TITLE":
      return { ...state, title: action.payload.title };

    case "SET_DESCRIPTION":
      return { ...state, description: action.payload.description };

    case "SET_TIMER":
      return { ...state, timeLimit: action.payload.timeLimit };

    case "ADD_QUESTION":
      let questions = state.questions;
      questions.push();

    case "DELETE_QUESTION":
      return deleteQuestion(state, action.payload);

    default:
      return state;
  }
};

const setQuestionTitle = (state, payload) => {
  let { id, title } = payload;
  let questions = state.questions;
  questions[id].body = title;
  return { ...state, questions };
};

const setChoice = (state, payload) => {
  let { id, choiceNumber, text } = payload;
  let questions = state.questions;
  questions[id].answers[choiceNumber].text = text;
  return { ...state, questions };
};

const setAnswer = (state, payload) => {
  let { id, choiceNumber } = payload;
  let questions = state.questions;
  questions[id].correctAnswer = choiceNumber;
  return { ...state, questions };
};

const deleteQuestion = (state, payload) => {
  let { id } = payload;
  let questions = state.questions;
  questions.pop(id);
  return { ...state, questions };
};

export default QuizReducer;
