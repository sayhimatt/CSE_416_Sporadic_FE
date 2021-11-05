import React from "react";
import { Link } from "react-router-dom";

import "../styles.css";
import "./styles.css";
import SubNav from "../../NavBar/SubNav/SubNav";

const TYPES = ["card--user", "card--quiz", "card--platform"];

const LargeCard = ({ children, cardType, cardInfo, cardLink }) => {
  return (
    <Link className="cardContainer cardContainer--large link" to={cardLink}>
      <div className="card d-flex flex-column">
        <div className="topCard d-flex flex-row">
          <div>
            <img className="icon" src="/platformIcon.png" alt="icon" />
          </div>
          <div className="info flex-grow-1">
            <div className="title">{cardInfo.title}</div>
            <div className="description">{cardInfo.description}</div>
          </div>
        </div>
        <div className="bottomCard d-flex flex-row justify-content-between align-items-end">
          <div className="description subtext">{cardInfo.subtext}</div>
          <div className="feedback d-flex flex-row">
            <div className="feedbackItem d-flex flex-row align-items-center">
              <img className="feedbackImage" src="/like.png" alt="like" />
              <div className="count">1000</div>
            </div>
            <div className="feedbackItem d-flex flex-row align-items-center">
              <img className="feedbackImage" src="/dislike.png" alt="dislike" />
              <div className="count">1000</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LargeCard;
