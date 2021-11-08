import React from "react";

import "./styles.css";

const Question = ({
  information,
  create,
  titleHandler,
  answerTextHandler,
  correctAnswerHandler,
}) => {
  const choiceCards = information.answers.map((answer, index) => {
    return (
      <div className="choice flex-row">
        <div className="d-flex flex-grow-1">
          {create ? (
            <textarea
              className="input"
              value={answer}
              placeholder="Enter Answer"
              id={`Q${information.questionIndex}A${index}`}
              onChange={answerTextHandler}
            ></textarea>
          ) : (
            answer
          )}
        </div>
        <input
          className="form-check-input marker"
          type="radio"
          value={"Q" + information.questionIndex + "C" + index}
          checked={create ? information.choice === index : null}
          name={"answer" + information.questionIndex}
          onChange={correctAnswerHandler}
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
            value={information.question}
            placeholder="Enter Question"
            id={`Q${information.questionIndex}title`}
            onChange={titleHandler}
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
