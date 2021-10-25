import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";

import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";

import "./styles.css";

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
    </div>
  );
};

export default Platform;
