import React, { createContext, useReducer } from "react";

import QuizReducer from "./QuizReducer";

export const QuizContext = createContext();

export const QuizContextProvider = (props) => {
  const [quiz, dispatch] = useReducer(QuizReducer, {
    title: "",
    platform: "",
    timeLimit: 60,
    description: "",
    questions: [],
  });
  return <QuizContext.Provider value={{ quiz, dispatch }}>{props.children}</QuizContext.Provider>;
};

export default QuizContextProvider;
