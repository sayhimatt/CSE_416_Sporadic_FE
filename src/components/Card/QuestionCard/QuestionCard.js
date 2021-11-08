import React from "react";

import "./styles.css";

const Question = ({ information, create }) => {
  const choiceCards = information.answers.map((answer, index) => {
    return (
      <div className="choice flex-row">
        <div className="d-flex flex-grow-1">
          {create ? <textarea className="input" placeholder="Enter Answer"></textarea> : answer}
        </div>
        <input
          className="form-check-input marker"
          type="radio"
          value={"Q" + information.questionIndex + "C" + index}
          name={"answer" + information.questionIndex}
        ></input>
      </div>
    );
  });

  return (
    <div className="cardContainer cardContainer--question flex-column align-items-center">
      <div className="question">
        {create ? (
          <textarea
            className="input text-center bg-transparent"
            placeholder="Enter Question"
          ></textarea>
        ) : (
          information.question
        )}
      </div>
      <div className="d-flex flex-column flex-md-fill">{choiceCards}</div>
    </div>
  );
};

export default Question;
