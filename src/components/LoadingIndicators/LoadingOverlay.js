import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import "./style.css";

/**
 * Fullscreen loading overlay.
 */
const LoadingOverlay = ({ isVisible, width, spinSpeed }) => {
  return (
    <>
      {isVisible && (
        <div className="overlay">
          <LoadingSpinner isVisible={isVisible} width={width} spinSpeed={spinSpeed} />
        </div>
      )}
    </>
  );
};

export default LoadingOverlay;
