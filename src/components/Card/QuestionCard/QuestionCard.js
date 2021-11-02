import React from "react";
import { Link } from "react-router-dom";

import "../styles.css";
import "./styles.css";
import SubNav from "../../NavBar/SubNav/SubNav";

const QuestionCard = ({ children, cardInfo }) => {
  return (
    <div className="flex-column">
      <div>Testerino</div>
      <div>Choice 1</div>
      <div>Choice 2</div>
      <div>Choice 3</div>
      <div>Choice 4</div>
    </div>
  );
};

export default QuestionCard;
