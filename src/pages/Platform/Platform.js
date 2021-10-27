import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import Auth from "@aws-amplify/auth";

import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import LargeCard from "../../components/Card/LargeCard/LargeCard";

import "./styles.scss";

const Platform = (props) => {
  const [platform, setPlatform] = useState({});
  const [quizCards, setQuizCards] = useState([]);
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    renderCards();
  }, [platform]);

  const onLoad = async () => {
    const name = params.platform;
    if (!name) {
      /* redirect to search for everything */
    }
    const session = await Auth.currentSession();
    const token = session.idToken.jwtToken;
    await axios
      .get(
        `https://cse-416-sporadic-api-prod.herokuapp.com/platforms/${name}`,
        { headers: { authorization: `Bearer: ${token}` } }
      )
      .then((res) => {
        setPlatform(res.data);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          /* If platform not in the DB, redirect to search for similar platforms */
          history.replace(`/search?=${name}`);
        } else {
          /* Load error page */
          history.replace("/error");
        }
      });
  };

  const renderCards = () => {
    if (!Object.keys(platform).length) {
      return;
    }
    const cards = platform.quizzes.map((quiz) => (
      <LargeCard
        cardInfo={{
          title: quiz,
          description: "Description",
          subtext: "Subtext",
        }}
      />
    ));
    setQuizCards(cards);
  };

  return (
    <div>
      <MainNav />
      <PlatformSubNav
        heading={platform.title}
        bannerSrc="/banner.svg"
        isSubsribed={true}
      />
      <div className="content d-flex flex-row align-items-start me-5 justify-content-between">
        <div className="d-flex flex-column m-5 align-items-end">
          <div className="sort"></div>
          <div className="quizzes d-flex flex-column m-10">{quizCards}</div>
        </div>
        <div className="information d-flex flex-column">
          <div className="searchBar searchBar--border">
            <input className="search" placeholder="Search"></input>
          </div>
          <div className="platform-text-block d-flex align-items-center justify-content-center mt-4">
            {platform.description}
          </div>
          <div className="platform-text-block iq d-flex flex-column align-items-center mt-4">
            <div>Your Platform IQ</div>
            <div className="color-special fw-bold fs-1">100</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Platform;
