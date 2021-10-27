import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";

import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import LargeCard from "../../components/Card/LargeCard/LargeCard";

import "./styles.scss";

const Platform = (props) => {
  const [platform, setPlatform] = useState({});
  const location = useLocation();
  const params = useParams();
  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    const name = params.platform;
    if (!name) {
      /* redirect to search for everything */
    }
    await axios
      .get(`https://cse-416-sporadic-api-prod.herokuapp.com/platforms/${name}`)
      .then((res) => {
        setPlatform(res.data.platform);
      })
      .catch((error) => {
        if (error.response.status == "") {
          /* If platform not in the DB, redirect to search for similar platforms */
        } else {
          /* Load error page */
        }
      });
  };

  return (
    <div>
      <MainNav />
      <PlatformSubNav
        heading="Movies"
        bannerSrc="/banner.svg"
        isSubsribed={true}
      />
      <div className="content d-flex flex-row align-items-start me-5 justify-content-between">
        <div className="d-flex flex-column m-5 align-items-end">
          <div className="sort"></div>
          <div className="quizzes d-flex flex-column m-10">
            <LargeCard
              cardInfo={{
                title: "title",
                description: "Description",
                subtext: "Subtext",
              }}
            ></LargeCard>
          </div>
        </div>
        <div className="information d-flex flex-column">
          <div className="searchBar searchBar--border">
            <input className="search" placeholder="Search"></input>
          </div>
          <div className="platform-text-block d-flex align-items-center justify-content-start mt-4">
            ipsum lorem est ipsum lorem estipsum lorem estipsum lorem estipsum
            lorem estipsum lorem est
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
