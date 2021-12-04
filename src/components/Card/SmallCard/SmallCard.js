import React from "react";
import { Link } from "react-router-dom";

import "./styles.scss";

const SmallCard = ({ profilePicture, username, userTag, rightCard }) => {
  return (
    <div className="cardContainer cardContainer--small">
      <div className="card d-flex flex-row align-items-center">
        <img className="profilePicture" src={profilePicture} alt="icon" />
        <div className="small-card-username">
          <Link to={`/user/${username}`} className="link">
            {`${username} `}
            {userTag}
          </Link>
        </div>
        <div className="right-card">{rightCard}</div>
      </div>
    </div>
  );
};

export default SmallCard;
