import React from "react";


//import "../styles.css";
import "./styles.css";

const ErrorText = ({visible, text}) => {

  if (visible) {
    return (
        <div className= {`errorText`}>
          <p> {text} </p>
        </div>
      );
  } else return (null);  
};

export default ErrorText;