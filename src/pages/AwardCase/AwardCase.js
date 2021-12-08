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
      .then((res) => setAwards({ onDisplay: res.showcasedAwards, notOnDisplay: res.awards }))
      .catch((e) => console.log(error));
  }, []);

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
            <div className="displayed-awards"></div>
            <div className="shelf" />
          </div>
          <div id="award-case"></div>
        </div>
      </div>
    </div>
  );
};

export default AwardCase;
