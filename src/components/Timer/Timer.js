import React, { Fragment } from "react";
import "./style.css";

const Timer = ({ timerMinutes, timerSeconds }) => {
  return (
    <Fragment>
      <section>
        <div className="color-special fw-bold fs-1">
          {timerMinutes}:{timerSeconds}
        </div>
      </section>
    </Fragment>
  );
};

Timer.defaultProps = {
  timerMinutes: 0,
  timerSeconds: 60,
};

export default Timer;
