import React from "react";

const QuizReducer = (state, action) => {
  switch (action.type) {
    case "SET_QUESTION_TITLE":
      const { id, title } = action.payload;
      const questions = state.questions;
      questions[id].body = title;
      return { ...state, questions };

    case "SET_CHOICE":
      const { id, choiceNumber, text } = action.payload;
      const questions = state.questions;
      questions[id].answers[choiceNumber].text = text;
      return { ...state, questions };

    case "SET_ANSWER":
      const { id, choiceNumber } = action.payload;
      const questions = state.questions;
      questions[id].correctAnswer = choiceNumber;
      return { ...state, questions };

    case "SET_TITLE":
      const { title } = action.payload;
      return { ...state, title };

    case "SET_DESCRIPTION":
      const { description } = action.payload;
      return { ...state, description };

    case "SET_TIMER":
      const { time } = action.payload;
      return { ...state, timeLimit: time };

    case "ADD_QUESTION":
      const questions = state.questions;
      questions.push();

    case "DELETE_QUESTION":
      const { id } = action.payload;
      const questions = state.questions;
      questions.pop(id);
      return { ...state, questions };

    default:
      return state;
  }
};

export default QuizReducer;
