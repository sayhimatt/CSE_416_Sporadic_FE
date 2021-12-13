import React from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingSpinner from "../LoadingIndicators/LoadingSpinner";

import "./styles.scss";

const Leaderboard = ({ scores = [], hasMore, nextResultsHandler, className, userScore }) => {
  const loadResults = () => {
    return scores.map((score, index) => (
      <div
        key={index}
        className={`d-flex ${score.username === userScore.username ? "user-row" : ""} ${
          userScore.leaderBoardPosition === scores.length ? "background-cell-corner" : ""
        }`}
      >
        <div className="board-position leaderboard-cell">{index + 1}</div>
        <div className="board-name leaderboard-cell">
          <Link className="link" to={`/user/${score.username}`}>
            {score.username}
          </Link>
        </div>
        <div className="board-score leaderboard-cell">{score.totalCorrect}</div>
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
        {userScore.username && (
          <div className="d-flex user-row">
            <div className="board-position leaderboard-cell">{userScore.leaderBoardPosition}</div>
            <div className="board-name leaderboard-cell">
              <Link className="link" to={`/user/${userScore.username}`}>
                {userScore.username}
              </Link>
            </div>
            <div className="board-score leaderboard-cell">{userScore.totalCorrect}</div>
          </div>
        )}
        {scores.length !== 0 && (
          <InfiniteScroll
            next={nextResultsHandler}
            dataLength={scores.length}
            hasMore={hasMore}
            loader={
              <div className="d-flex justify-content-center mt-2 mb-2">
                <LoadingSpinner isVisible={true} />
              </div>
            }
            scrollThreshold={0.7}
            scrollableTarget="leaderboard-user-list"
          >
            {loadResults()}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
