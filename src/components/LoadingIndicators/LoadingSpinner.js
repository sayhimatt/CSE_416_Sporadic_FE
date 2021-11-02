import React from "react";
import { ReactComponent as Spore } from "../../spore.svg";
import "./style.css";

/**
 * Standalone loading spinner.
 */
const LoadingSpinner = ({ isVisible, width, spinSpeed }) => {
  return (
    <>
      {isVisible && (
        <Spore
          style={{
            animation: `spin ${spinSpeed || 3}s linear infinite`,
            height: "auto",
            width: width || "10%",
          }}
        />
      )}
    </>
  );
};

export default LoadingSpinner;
