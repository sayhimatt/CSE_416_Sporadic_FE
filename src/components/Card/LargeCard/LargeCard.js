import React, { useState } from "react";
import { Link } from "react-router-dom";

import "../styles.css";
import "./styles.css";
import DropdownMenu from "../../Dropdown/DropdownMenu/DropdownMenu";
import DropdownItem from "../../Dropdown/DropdownItem/DropdownItem";
import CustomToggle from "../../CustomToggle/CustomToggle";
import { Dropdown } from "react-bootstrap";

const LargeCard = ({ children, iconSrc, modOptions, cardInfo, cardLink, dropdownHandlers }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="cardContainer cardContainer--large link">
      <div className="card d-flex flex-column">
        <div className="topCard d-flex flex-row">
          <div>
            <img className="icon" src={iconSrc} alt="what" />
          </div>
          <div className="info flex-grow-1">
            <div className="d-flex">
              <Link className="link title" to={cardLink}>
                {cardInfo.title}
              </Link>
            </div>
            <div className="description">
              {cardInfo.description ? cardInfo.description : "No Description"}
            </div>
          </div>
          <div className="d-flex align-items-start">
            {modOptions && (
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                  <img alt="dropdown" src="/three_dot_menu.svg" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="custom-dropdown-menu" align="start">
                  <Dropdown.Item className="custom-dropdown-item">Pin Quiz</Dropdown.Item>
                  <Dropdown.Item
                    id={`delete-quiz-${cardInfo.title}`}
                    className="custom-dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      dropdownHandlers.removeQuiz(cardInfo.title);
                    }}
                  >
                    Delete Quiz
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="bottomCard d-flex flex-row justify-content-between align-items-end">
          <div className="description subtext">{cardInfo.subtext}</div>
          {cardInfo.upvotes && cardInfo.downvotes && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default LargeCard;
