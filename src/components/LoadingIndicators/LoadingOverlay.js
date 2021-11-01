import React from "react";
import { ReactComponent as Spore } from "../../spore.svg";
import "./style.css";

/**
 * Fullscreen loading overlay.
 */
const LoadingOverlay = ({ isVisible, width, spinSpeed }) => {
  return (
    <>
      {isVisible && (
        <div className="overlay">
          <Spore
            style={{
              animation: `spin ${spinSpeed || 3}s linear infinite`,
              height: "auto",
              width: width || "15%",
            }}
          />
        </div>
      )}
    </>
  );
};

export default LoadingOverlay;
