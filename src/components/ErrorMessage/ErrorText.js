import React from "react";
import "./styles.css";

const ErrorText = ({text}) => {
  return (
      <div className= {`errorText`}>
        <p> {text} </p>
      </div>
    );
};

export default ErrorText;