import React from "react";
import { Link } from "react-router-dom";

import "./styles.css";
import SubNav from "../../NavBar/SubNav/SubNav";

const Question = ({ children, Info }) => {
  return (
    <div className="cardContainer flex-column align-items-center">
      <div className="question">Question String</div>
      <div className="choice flex-row">
        <div>Answer 1</div>
        <input
          className="form-check-input marker"
          type="radio"
          value="Choice 1"
          name="answer"
        ></input>
      </div>
      <div className="choice flex-row">
        <div>Answer 2</div>
        <input
          className="form-check-input marker"
          type="radio"
          value="Choice 1"
          name="answer"
        ></input>
      </div>
      <div className="choice flex-row">
        <div>Answer 3</div>
        <input
          className="form-check-input marker"
          type="radio"
          value="Choice 1"
          name="answer"
        ></input>
      </div>
      <div className="choice flex-row">
        <div>Answer 4</div>
        <input
          className="form-check-input marker"
          type="radio"
          value="Choice 1"
          name="answer"
        ></input>
      </div>
    </div>
  );
};

export default Question;
