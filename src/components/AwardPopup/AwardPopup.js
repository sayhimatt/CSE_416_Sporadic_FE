import React from "react";
import Button from "../Buttons/Button/Button";
import { Link } from "react-router-dom";

import "./styles.scss";

const AwardPopup = ({ award, displayHandler, visible, visibilityHandler }) => {
  return !visible ? null : (
    <div className="award-popup">
      <div className="close-popup" onClick={visibilityHandler}>
        <img src={"/question_delete.svg"} alt="remove" />
      </div>
      <img src={award.image} alt="award" />
      <h3>{award.title}</h3>
      <h5 className="mb-3 text-center">
        {`Earned from ${award.quiz} on `}
        <Link className="link" to={`/p/${award.platform}`}>{`/p/${award.platform}`}</Link>
      </h5>
      {displayHandler && (
        <Button onClick={() => displayHandler(award.platform, award.quiz, award.title, "add")}>
          Display Trophy
        </Button>
      )}
    </div>
  );
};

export default AwardPopup;
