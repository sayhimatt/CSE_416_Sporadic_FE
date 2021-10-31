import React from "react";
import { ReactComponent as Spore } from "../../spore.svg";
import "./style.css";

const LoadingOverlay = ({ isVisible }) => {
  const SPIN_SPEED = 3;

  return (
    <>
      {isVisible && (
        <div className="overlay">
          <Spore
            style={{
              animation: `spin ${SPIN_SPEED}s linear infinite`,
            }}
          />
        </div>
      )}
    </>
  );
};

export default LoadingOverlay;
