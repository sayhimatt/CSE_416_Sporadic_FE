import React from "react";
import "./styles.css";

const STYLES = ["btn--primary", "btn--secondary", "btn--special"];

const SIZES = ["btn--small", "btn--medium", "btn--large"];

const Button = ({ children, type, onClick, buttonStyle, buttonSize }) => {
  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
  const checkbuttonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[1];

  return (
    <button
      className={`custombtn ${checkButtonStyle} ${checkbuttonSize}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
