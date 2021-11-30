import React, { Fragment } from "react";
import "./style.css";

const Timer = ({ timerMinutes, timerSeconds }) => {
  return (
    <Fragment>
      <section className="d-flex flex-row align-items-center">
        <div className="timer-box">{timerMinutes}</div>
        <div className="timer-divider">:</div>
        <div className="timer-box">{timerSeconds}</div>
      </section>
    </Fragment>
  );
};

Timer.defaultProps = {
  timerMinutes: 0,
  timerSeconds: 60,
};

export default Timer;
