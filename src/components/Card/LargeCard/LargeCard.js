import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../styles.css";
import "./styles.css";
import DropdownMenu from "../../Dropdown/DropdownMenu/DropdownMenu";
import img from "../../../movie.svg";
const TYPES = ["card--user", "card--quiz", "card--platform"];

const LargeCard = ({ children, modOptions, cardInfo, cardLink }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="cardContainer cardContainer--large link">
      <div className="card d-flex flex-column">
        <div className="topCard d-flex flex-row">
          <div>
            <img className="icon" src={img} alt="what" />
          </div>
          <div className="info flex-grow-1">
            <Link className="link" to={cardLink}>
              <div className="title">{cardInfo.title}</div>
            </Link>
            <div className="description">{cardInfo.description}</div>
          </div>
          {modOptions && (
            <a className="mod-options" onClick={toggleDropdown}>
              <img alt="dropdown" src="/three_dot_menu.svg" />
              {showDropdown && (
                <DropdownMenu>
                  <div>Pin quiz</div>
                  <div>Delete quiz</div>
                </DropdownMenu>
              )}
            </a>
          )}
        </div>
        <div className="bottomCard d-flex flex-row justify-content-between align-items-end">
          <div className="description subtext">{cardInfo.subtext}</div>
          <div className="feedback d-flex flex-row">
            <div className="feedbackItem d-flex flex-row align-items-center">
              <img className="feedbackImage" src="/like.png" alt="like" />
              <div className="count">{cardInfo.upvotes}</div>
            </div>
            <div className="feedbackItem d-flex flex-row align-items-center">
              <img className="feedbackImage" src="/dislike.png" alt="dislike" />
              <div className="count">{cardInfo.downvotes}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LargeCard;
