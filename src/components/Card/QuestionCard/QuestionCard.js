import React from "react";
import { Link } from "react-router-dom";

import "./styles.css";
import SubNav from "../../NavBar/SubNav/SubNav";

const Question = ({ information }) => {
  return (
    <div className="cardContainer cardContainer--question flex-column align-items-center">
      <div className="question">{information.question}</div>
      <div className="choice flex-row">
        <div>{information.c1}</div>
        <input
          className="form-check-input marker"
          type="radio"
          value={information.c1}
          name="answer"
        ></input>
      </div>
      <div className="choice flex-row">
        <div>{information.c2}</div>
        <input
          className="form-check-input marker"
          type="radio"
          value={information.c2}
          name="answer"
        ></input>
      </div>
      <div className="choice flex-row">
        <div>{information.c3}</div>
        <input
          className="form-check-input marker"
          type="radio"
          value={information.c3}
          name="answer"
        ></input>
      </div>
      <div className="choice flex-row">
        <div>{information.c4}</div>
        <input
          className="form-check-input marker"
          type="radio"
          value={information.c4}
          name="answer"
        ></input>
      </div>
    </div>
  );
};

export default Question;
