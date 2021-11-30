import React from "react";
import { Link } from "react-router-dom";

import "./styles.scss";

const SmallCard = ({ profilePicture, username, userTag, rightCard }) => {
  return (
    <div className="cardContainer cardContainer--small">
      <div className="card d-flex flex-row align-items-center">
        <img className="profilePicture" src={profilePicture} alt="icon" />
        <Link to={`/user/${username}`} className="link fs-6">
          {`${username} `}
          {userTag}
        </Link>
        <div className="flex-grow-1 d-flex justify-content-end ps-3">{rightCard}</div>
      </div>
    </div>
  );
};

export default SmallCard;
