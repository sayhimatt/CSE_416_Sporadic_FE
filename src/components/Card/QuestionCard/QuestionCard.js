import React from "react";

import "./styles.scss";

const Question = ({
  information,
  create,
  titleHandler,
  answerTextHandler,
  correctAnswerHandler,
}) => {
  const choiceCards = information.answers.map((answer, index) => {
    return (
      <div key={`Q${information.questionIndex}C${index}`} className="choice flex-row">
        <div className="d-flex flex-grow-1">
          {create ? (
            <textarea
              className="input me-2"
              value={answer}
              placeholder="Answer Choice"
              id={`Q${information.questionIndex}A${index}`}
              onChange={(e) =>
                answerTextHandler(
                  parseInt(e.target.id.charAt(1)),
                  parseInt(e.target.id.charAt(3)),
                  e.target.value,
                )
              }
              maxLength={500}
            ></textarea>
          ) : (
            answer
          )}
        </div>
        <label className="custom-radio-btn align-self-center">
          <input
            type="radio"
            value={"Q" + information.questionIndex + "C" + index}
            checked={create ? information.choice === index : null}
            name={"answer" + information.questionIndex}
            onChange={(e) =>
              correctAnswerHandler(
                parseInt(e.target.value.charAt(1)),
                parseInt(e.target.value.charAt(3)),
              )
            }
          />
          <span className="checkmark" />
        </label>
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
            placeholder="Question Title"
            id={`Q${information.questionIndex}title`}
            onChange={(e) => titleHandler(parseInt(e.target.id.charAt(1)), e.target.value)}
            maxLength={500}
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
