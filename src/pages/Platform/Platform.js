import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useHistory } from "react-router-dom";

import { getPlatform, getQuizzesFromPlatform } from "./../../API/API";
import { UserContext } from "../../contexts/UserContext/UserContext";
import Button from "../../components/Buttons/Button/Button";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import LargeCard from "../../components/Card/LargeCard/LargeCard";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import {
  getPlatformIcon,
  getPlatformBanner,
  patchSubscribe,
  patchUnsubscribe,
  deleteQuiz,
} from "./../../API/API";

import "./styles.scss";

const Platform = () => {
  const history = useHistory();
  const params = useParams();
  const { user, dispatch } = useContext(UserContext);
  const [platform, setPlatform] = useState();
  const [quizzes, setQuizzes] = useState([]);
  const [quizCards, setQuizCards] = useState([]);
  const [subscribed, setSubscribed] = useState(user.subscriptions.includes(params.platform));
  const [modView, setModView] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [banner, setBanner] = useState("/banner.svg");
  const [platformIcon, setPlatformIcon] = useState();
  const [uploadBanner, setUploadBanner] = useState(false);
  const [uploadIcon, setUploadIcon] = useState(false);

  useEffect(() => {
    getCurrentPlatform();
    getQuizzes();
    getImageMedia();
    setModView(false);
  }, [params]);

  useEffect(() => {
    renderCards();
  }, [quizzes, modView, platformIcon]);

  const getImageMedia = async () => {
    await getPlatformBanner(params.platform).then((banner) => {
      console.log(banner);
      setBanner(banner);
    });
    await getPlatformIcon(params.platform).then((icon) => {
      console.log(icon);
      setPlatformIcon(icon);
    });
  };

  const getCurrentPlatform = async () => {
    const name = params.platform;
    getPlatform(name)
      .then((platformData) => {
        setPlatform(platformData);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          history.replace(`/search?searchQuery=${name}`);
        } else if (error.response.status === 403) {
          setIsBanned(true);
          setPlatform({});
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

  const toggleModView = () => {
    setModView(!modView);
  };

  const showImageUploader = (type) => {
    if (type == "banner") {
      setUploadBanner(true);
    } else {
      setUploadIcon(true);
    }
  };

  const removeQuiz = (quiz) => {
    deleteQuiz(params.platform, quiz)
      .then((res) => {
        getQuizzes();
      })
      .catch((error) => alert("Could not delete quiz"));
  };

  const renderCards = () => {
    if (!platformIcon) {
      return;
    }
    const cards = quizzes.map((quiz) => {
      const name = params.platform;
      return (
        <LargeCard
          key={quiz._id}
          iconSrc={platformIcon}
          cardInfo={{
            title: quiz.title,
            description: quiz.description,
            upvotes: quiz.upvotes,
            downvotes: quiz.downvotes,
            subtext: (
              <Link className="link" to={`/p/${name}`}>
                {name}
              </Link>
            ),
          }}
          modOptions={modView}
          dropdownHandlers={{ removeQuiz }}
          cardLink={`${name}/${quiz.title}`} // Temporary fix prevents crash on redirect, use quiz page when done
        />
      );
    });
    setQuizCards(cards);
  };

  const bannedPage = () => {
    return (
      <div>
        <MainNav />
        <div className="page-content d-flex mt-5 flex-column align-items-center justify-content-center">
          <h1 className="mb-4">You are banned from this platform</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  };

  return !platform ? (
    <MainNav />
  ) : isBanned ? (
    bannedPage()
  ) : (
    <div>
      <MainNav />
      <PlatformSubNav
        platformName={params.platform}
        bannerSrc={banner}
        iconSrc={platformIcon}
        modView={modView}
        showUpload={showImageUploader}
      >
        {(platform.moderators.includes(user.username) || platform.owner === user.username) && (
          <Button buttonStyle="btn--special" onClick={toggleModView}>
            {modView ? "User View" : "Mod View"}
          </Button>
        )}
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
          {modView && (
            <div className="d-flex flex-column w-100">
              <Button buttonSize="btn--large">
                <Link
                  className="link d-flex justify-content-center"
                  to={`/p/${params.platform}/createQuiz`}
                >
                  Create Quiz
                </Link>
              </Button>
              <div className="p-1"></div>
              <Button buttonStyle="btn--special" buttonSize="btn--large">
                <Link
                  className="link d-flex justify-content-center"
                  to={`/p/${params.platform}/subscribers`}
                >
                  Manage Subscribers
                </Link>
              </Button>
            </div>
          )}
          <div className="platform-text-block d-flex align-items-center justify-content-center mt-4">
            {platform.description}
          </div>
          <div className="platform-text-block iq d-flex flex-column align-items-center mt-4">
            <div>Your Platform IQ</div>
            <div className="color-special fw-bold fs-1">100</div>
          </div>
        </div>
      </div>
      <ImageUploader
        visible={uploadBanner}
        desiredFile="platform banner"
        desiredPlatform={params.platform}
        visibilityHandler={() => setUploadBanner(false)}
      />
      <ImageUploader
        visible={uploadIcon}
        desiredFile="platform icon"
        desiredPlatform={params.platform}
        visibilityHandler={() => setUploadIcon(false)}
      />
    </div>
  );
};

export default Platform;
