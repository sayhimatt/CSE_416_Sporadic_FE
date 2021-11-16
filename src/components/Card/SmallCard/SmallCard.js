import React, { useEffect, useState } from "react";

import Button from "../../Button/Button";
import { getUserIcon } from "../../../API/API";

import "./styles.scss";

const SmallCard = ({ username, rightCard }) => {
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    getUserIcon(username).then((link) => setProfilePicture(link));
  }, []);

  return (
    <div className="cardContainer cardContainer--small">
      <div className="card d-flex flex-row align-items-center">
        <img className="profilePicture" src={profilePicture} alt="icon" />
        <div className="title">{username}</div>
        <div className="flex-grow-1 d-flex justify-content-end ps-3">{rightCard}</div>
      </div>
    </div>
  );
};

export default SmallCard;
