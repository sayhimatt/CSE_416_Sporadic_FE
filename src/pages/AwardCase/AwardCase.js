import React, { useState, useContext, useEffect } from "react";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import LinkButton from "../../components/Buttons/LinkButton/LinkButton";
import { getUser } from "../../API/API";
import { UserContext } from "../../contexts/UserContext/UserContext";

import "./styles.scss";

const AwardCase = () => {
  const { user, dispatch } = useContext(UserContext);
  const [awards, setAwards] = useState();

  useEffect(() => {
    getUser(user.username)
      .then((res) => {
        const showCased = res.showCasedAwards ? res.showCasedAwards : [];
        const awards = res.awards ? res.awards : [];
        setAwards({
          onDisplay: showCased,
          notOnDisplay: awards,
        });
      })
      .catch((e) => console.log(e));
  }, []);

  const renderCase = () => {
    const awardRows = splitAwardsIntoRows();
    return (
      <div id="award-case">
        {awardRows.map((row) => (
          <div className="case-row">
            <div className="cased-awards">
              {row.map((award) => (
                <div className="award-container">
                  <img className="award-image cased-award" src={award.image} alt="award" />
                </div>
              ))}
            </div>
            <div className="shelf" />
          </div>
        ))}
      </div>
    );
  };

  const splitAwardsIntoRows = () => {
    const awardsPerRow = 8;
    const rows = Math.ceil(awards.notOnDisplay.length / awardsPerRow);
    const awardRows = [];
    for (let i = 0; i < rows; i++) {
      awardRows.push(awards.notOnDisplay.slice(i * awardsPerRow, i * awardsPerRow + awardsPerRow));
    }
    return awardRows;
  };

  return !awards ? (
    <NavBar />
  ) : (
    <div>
      <NavBar />
      <SubNav
        heading="Award Case"
        buttons={[<LinkButton to="/myAccount">Back to My Account</LinkButton>]}
      />
      <div className="page-content">
        <div className="d-flex flex-column align-items-center">
          <div id="display-shelf">
            <div id="displayed-awards">
              {awards.onDisplay.map((award) => (
                <div className="award-container">
                  <img className="award-image displayed-award" src={award.image} alt="award" />
                  <div className="d-flex">
                    <img className="delete-award" src="/question_delete.svg" alt="delete" />
                  </div>
                </div>
              ))}
            </div>
            <div className="shelf" />
          </div>
          {renderCase()}
        </div>
      </div>
    </div>
  );
};

export default AwardCase;
