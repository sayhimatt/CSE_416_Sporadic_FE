import React from "react";


//import "../styles.css";
import "./styles.css";

const STYLES = ["errorBox", "errorText"];

const ErrorMessage = ({visible, errorStyle, text}) => {
  const checkErrorStyle = STYLES.includes(errorStyle) ? errorStyle : STYLES[0];

  if (visible) {
    return (
        <div className= {`${checkErrorStyle}`}>
          <p> {text} </p>
        </div>
      );
  } else return (null);  
};

export default ErrorMessage;