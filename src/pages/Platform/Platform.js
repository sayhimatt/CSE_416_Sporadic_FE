import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

import { getPlatform, getQuizzesFromPlatform } from "./../../API/API";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";
import Button from "../../components/Button/Button";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import LargeCard from "../../components/Card/LargeCard/LargeCard";
import { patchSubscribe, patchUnsubscribe } from "./../../API/API";

import "./styles.scss";

const Platform = () => {
  const history = useHistory();
  const params = useParams();
  const { auth, dispatch } = useContext(AuthContext);
  const [platform, setPlatform] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [quizCards, setQuizCards] = useState([]);
  const [subscribed, setSubscribed] = useState(auth.subscriptions.includes(params.platform));

  useEffect(() => {
    getCurrentPlatform();
    getQuizzes();
  }, [params]);

  useEffect(() => {
    renderCards();
  }, [quizzes]);

  const getCurrentPlatform = async () => {
    const name = params.platform;
    await getPlatform(name)
      .then((platformData) => {
        setPlatform(platformData);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          history.replace(`/search?=${name}`);
        } else {
          history.replace("/error");
        }
      });
  };

  const getQuizzes = async () => {
    const name = params.platform;
    try {
      const response = await getQuizzesFromPlatform(name);
      setQuizzes(response);
    } catch (error) {
      console.log(error);
    }
  };

  const subscribe = async () => {
    await patchSubscribe(params.platform)
      .then((res) => {
        dispatch({ type: "SUBSCRIBE", payload: params.platform });
        setSubscribed(true);
      })
      .catch(() => {
        alert("could not subscribe");
      });
  };

  const unsubscribe = async () => {
    await patchUnsubscribe(params.platform)
      .then((res) => {
        dispatch({ type: "UNSUBSCRIBE", payload: params.platform });
        setSubscribed(false);
      })
      .catch(() => {
        alert("could not unsubscribe");
      });
  };

  const renderCards = () => {
    const cards = quizzes.map((quiz) => {
      const name = params.platform;
      return (
        <LargeCard
          key={quiz._id}
          cardInfo={{
            title: quiz.title,
            description: quiz.description,
            upvotes: quiz.upvotes,
            downvotes: quiz.downvotes,
            // Two nested links are not allowed
            //<Link className="link" to={`/p/${name}`}>
            //</Link>
            subtext: name,
          }}
          cardLink={`${name}/${quiz.title}`} // Temporary fix prevents crash on redirect, use quiz page when done
        />
      );
    });
    setQuizCards(cards);
  };

  return (
    <div>
      <MainNav />
      <PlatformSubNav platformName={params.platform} bannerSrc="/banner.svg">
        <Button onClick={subscribed ? unsubscribe : subscribe}>
          {subscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
      </PlatformSubNav>
      <div className="content d-flex flex-row align-items-start me-5 mt-4 justify-content-between">
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
