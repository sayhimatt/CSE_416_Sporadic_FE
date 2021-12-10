import React from "react";
import {
  ArrowDownSquare,
  ArrowUpSquare,
  ArrowUpSquareFill,
  ArrowDownSquareFill,
} from "react-bootstrap-icons";

import "./styles.scss";

/**
 * Two side-by-side buttons which represent changing the sort direction.
 * The `sortDirection` key should be `ascending` or `descending`.
 */
const SortDirectionButtons = ({ onAscendingClick, onDescendingClick, sortDirection }) => {
  const SIZE = 38;

  return (
    <div>
      {sortDirection === "ascending" ? (
        <ArrowUpSquareFill size={SIZE} className="sort-direction-btn" onClick={onAscendingClick} />
      ) : (
        <ArrowUpSquare size={SIZE} className="sort-direction-btn" onClick={onAscendingClick} />
      )}
      {sortDirection === "descending" ? (
        <ArrowDownSquareFill
          size={SIZE}
          className="sort-direction-btn"
          onClick={onDescendingClick}
        />
      ) : (
        <ArrowDownSquare size={SIZE} className="sort-direction-btn" onClick={onDescendingClick} />
      )}
    </div>
  );
};

export default SortDirectionButtons;
