import React, { useState, useContext, useEffect } from "react";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import LinkButton from "../../components/Buttons/LinkButton/LinkButton";
import AwardPopup from "../../components/AwardPopup/AwardPopup";
import { getUser } from "../../API/API";
import { UserContext } from "../../contexts/UserContext/UserContext";

import "./styles.scss";

const AwardCase = () => {
  const { user, dispatch } = useContext(UserContext);
  const [awards, setAwards] = useState();
  const [awardPopup, setAwardPopup] = useState({
    visible: false,
    award: null,
    displayHandler: null,
  });

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
        {awardRows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="case-row">
            <div className="cased-awards">
              {row.map((award, awardIndex) => (
                <div key={`row-${rowIndex}-award-${awardIndex}`} className="award-container">
                  <img
                    id={`${award.platform}-${award.quiz}-${award.title}`}
                    className="award-image cased-award"
                    src={award.image}
                    alt="award"
                    onClick={(e) => {
                      const fields = parseIdForAwardFields(e.target.id);
                      showNotDisplayedPopup(fields.platform, fields.quiz, fields.title);
                    }}
                  />
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

  const removeFromDisplay = (platform, quiz, awardTitle) => {
    //todo
  };

  const parseIdForAwardFields = (id) => {
    const fields = id.split("-");
    return { platform: fields[0], quiz: fields[1], title: fields[2] };
  };

  const showDisplayedPopup = (platform, quiz, awardTitle) => {
    const award = awards.onDisplay.find(
      (award) => award.platform === platform && award.quiz === quiz && award.title === awardTitle,
    );
    setAwardPopup({ award: award, visible: true, displayHandler: null });
  };

  const showNotDisplayedPopup = (platform, quiz, awardTitle) => {
    const award = awards.notOnDisplay.find(
      (award) => award.platform === platform && award.quiz === quiz && award.title === awardTitle,
    );
    setAwardPopup({ award: award, visible: true, displayHandler: removeFromDisplay });
  };

  const closePopup = () => {
    setAwardPopup((prevState) => ({ ...prevState, visible: false }));
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
              {awards.onDisplay.map((award, index) => (
                <div key={`showcased-award-${index}`} className="award-container">
                  <img
                    id={`${award.platform}-${award.quiz}-${award.title}`}
                    className="award-image displayed-award"
                    src={award.image}
                    alt="award"
                    onClick={(e) => {
                      const fields = parseIdForAwardFields(e.target.id);
                      showDisplayedPopup(fields.platform, fields.quiz, fields.title);
                    }}
                  />
                  <div className="d-flex">
                    <img
                      id={`${award.platform}-${award.quiz}-${award.title}-delete`}
                      className="delete-award"
                      src="/question_delete.svg"
                      alt="delete"
                      onClick={(e) => {
                        const fields = parseIdForAwardFields(e.target.id);
                        removeFromDisplay(fields.platform, fields.quiz, fields.title);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="shelf" />
          </div>
          {renderCase()}
        </div>
      </div>
      <AwardPopup
        visible={awardPopup.visible}
        displayHandler={awardPopup.displayHandler}
        award={awardPopup.award}
        visibilityHandler={closePopup}
      />
    </div>
  );
};

export default AwardCase;
