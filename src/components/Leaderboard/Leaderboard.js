import React from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from "../LoadingIndicators/LoadingSpinner";

import "./styles.scss";

const Leaderboard = ({ scores = [], hasMore, nextResultsHandler, className }) => {
  const loadResults = () => {
    return scores.map((score, index) => (
      <div key={index} className="d-flex">
        <div className="board-position leaderboard-cell">{score.position}</div>
        <div className="board-name leaderboard-cell">
          <Link className="link" to={`/user/${score.username}`}>
            {score.username}
          </Link>
        </div>
        <div className="board-score leaderboard-cell">{score.score}</div>
      </div>
    ));
  };

  return (
    <div id="leaderboard" className={className}>
      <div id="leaderboard-heading">Leaderboard</div>
      <div id="leaderboard-user-list">
        <div className="d-flex">
          <div className="board-position leaderboard-cell">
            <b>#</b>
          </div>
          <div className="board-name leaderboard-cell">
            <b>Username</b>
          </div>
          <div className="board-score leaderboard-cell">
            <b>Score</b>
          </div>
        </div>
        <InfiniteScroll
          next={nextResultsHandler}
          dataLength={scores.length}
          hasMore={hasMore}
          loader={
            <div className="d-flex justify-content-center mt-4">
              <LoadingSpinner isVisible={true} />
            </div>
          }
          scrollThreshold={0.7}
        >
          {loadResults()}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Leaderboard;
