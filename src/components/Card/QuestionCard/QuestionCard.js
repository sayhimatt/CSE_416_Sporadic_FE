import React from "react";
import { Link } from "react-router-dom";

import "./styles.css";
import SubNav from "../../NavBar/SubNav/SubNav";

const Question = ({ information }) => {
  const choiceCards = information.answers.map((answer, index) => {
    return (
      <div className="choice flex-row">
        <div>{answer}</div>
        <input
          className="form-check-input marker"
          type="radio"
          value={"Q" + information.questionIndex + "C" + index}
          name={"answer" + information.questionIndex}
        ></input>
      </div>
    )
  });

  



  return (
    <div className="cardContainer cardContainer--question flex-column align-items-center">
      <div className="question">{information.question}</div>
      <div className="d-flex flex-column flex-md-fill">{choiceCards}</div>
    </div>
  );
};

export default Question;
