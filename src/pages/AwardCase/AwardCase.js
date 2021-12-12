import React, { useState, useContext, useEffect } from "react";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import LinkButton from "../../components/Buttons/LinkButton/LinkButton";
import AwardPopup from "../../components/AwardPopup/AwardPopup";
import { getUser, putUpdateAwardDisplayStatus, getAllAwardIcons } from "../../API/API";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { Alert } from "react-bootstrap";

import "./styles.scss";

const AwardCase = () => {
  const { user } = useContext(UserContext);
  const [awards, setAwards] = useState();
  const [awardPopup, setAwardPopup] = useState({
    visible: false,
    award: null,
    displayHandler: null,
  });
  const [alerts, setAlerts] = useState({ show: false, style: "danger", message: "" });

  useEffect(() => {
    getUser(user.username)
      .then((res) => {
        const showCased = getAllAwardIcons(res.showCasedAwards ? res.showCasedAwards : []);
        const awards = getAllAwardIcons(res.awards ? res.awards : []);
        Promise.all([showCased, awards]).then(([showCased, awards]) => {
          setAwards({
            onDisplay: showCased,
            notOnDisplay: awards,
          });
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

  const updateDisplay = (platform, quiz, awardTitle, action) => {
    if (action === "remove") {
      const award = findAward(platform, quiz, awardTitle, "onDisplay");
      const body = buildRemoveRequestBody(award);
      putUpdateAwardDisplayStatus(body.displayedAwards, body.awards)
        .then((res) => removeFromAwardDisplayState(award))
        .catch((e) => showAlert(`Could not ${action} award`));
    } else {
      const award = findAward(platform, quiz, awardTitle, "notOnDisplay");
      const body = buildDisplayRequestBody(award);
      putUpdateAwardDisplayStatus(body.displayedAwards, body.awards)
        .then((res) => {
          addToAwardDisplayState(award);
          closePopup();
        })
        .catch((e) => showAlert(`Could not ${action} award`));
    }
  };

  const findAward = (platform, quiz, awardTitle, type) => {
    return awards[type].find(
      (award) => award.platform === platform && award.quiz === quiz && award.title === awardTitle,
    );
  };

  const buildRemoveRequestBody = (award) => {
    return {
      displayedAwards: awards.onDisplay
        .filter(
          (listAward) =>
            !(
              listAward.platform === award.platform &&
              listAward.quiz === award.quiz &&
              listAward.title === award.title
            ),
        )
        .map((award) => ({ platform: award.platform, quiz: award.quiz, title: award.title })),
      awards: awards.notOnDisplay
        .concat([award])
        .map((award) => ({ platform: award.platform, quiz: award.quiz, title: award.title })),
    };
  };

  const buildDisplayRequestBody = (award) => {
    return {
      awards: awards.notOnDisplay
        .filter(
          (listAward) =>
            !(
              listAward.platform === award.platform &&
              listAward.quiz === award.quiz &&
              listAward.title === award.title
            ),
        )
        .map((award) => ({ platform: award.platform, quiz: award.quiz, title: award.title })),
      displayedAwards: awards.onDisplay
        .concat([award])
        .map((award) => ({ platform: award.platform, quiz: award.quiz, title: award.title })),
    };
  };

  const addToAwardDisplayState = (award) => {
    setAwards((prevState) => ({
      onDisplay: [...prevState.onDisplay, award],
      notOnDisplay: prevState.notOnDisplay.filter(
        (listAward) =>
          !(
            listAward.platform === award.platform &&
            listAward.quiz === award.quiz &&
            listAward.title === award.title
          ),
      ),
    }));
  };

  const removeFromAwardDisplayState = (award) => {
    setAwards((prevState) => ({
      onDisplay: prevState.onDisplay.filter(
        (listAward) =>
          !(
            listAward.platform === award.platform &&
            listAward.quiz === award.quiz &&
            listAward.title === award.title
          ),
      ),
      notOnDisplay: [...prevState.notOnDisplay, award],
    }));
  };

  const showAlert = (message) => {
    setAlerts((prevState) => ({ ...prevState, show: true, message }));
  };

  const parseIdForAwardFields = (id) => {
    const fields = id.split("-");
    return { platform: fields[0], quiz: fields[1], title: fields[2] };
  };

  const showDisplayedPopup = (platform, quiz, awardTitle) => {
    const award = findAward(platform, quiz, awardTitle, "onDisplay");
    setAwardPopup({ award: award, visible: true, displayHandler: null });
  };

  const showNotDisplayedPopup = (platform, quiz, awardTitle) => {
    const award = findAward(platform, quiz, awardTitle, "notOnDisplay");
    setAwardPopup({ award: award, visible: true, displayHandler: updateDisplay });
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
      <Alert
        variant={alerts.style}
        show={alerts.show}
        onClose={() => setAlerts((prevState) => ({ ...prevState, show: false }))}
        dismissible
      >
        {alerts.message}
      </Alert>
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
                        updateDisplay(fields.platform, fields.quiz, fields.title, "remove");
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
