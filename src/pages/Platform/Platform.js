import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { Dropdown } from "react-bootstrap";
import { getPlatform, getQuizzesFromPlatform } from "./../../API/API";
import { UserContext } from "../../contexts/UserContext/UserContext";
import Button from "../../components/Buttons/Button/Button";
import LinkButton from "../../components/Buttons/LinkButton/LinkButton";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import LargeCard from "../../components/Card/LargeCard/LargeCard";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import {
  getPlatformIcon,
  getPlatformBanner,
  getQuizIcon,
  patchSubscribe,
  patchUnsubscribe,
  deleteQuiz,
  putUpdatePinStatus,
} from "./../../API/API";
import LoadingSpinner from "../../components/LoadingIndicators/LoadingSpinner";

import "./styles.scss";
import SortDirectionButtons from "../../components/Buttons/SortDirection/SortDirectionButtons";

const Platform = () => {
  const history = useHistory();
  const params = useParams();
  const { user, dispatch } = useContext(UserContext);
  const [platform, setPlatform] = useState();
  const [quizzes, setQuizzes] = useState();
  const [quizCards, setQuizCards] = useState([]);
  const [subscribed, setSubscribed] = useState(user.subscriptions.includes(params.platform));
  const [modView, setModView] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [banner, setBanner] = useState("/banner.svg");
  const [platformIcon, setPlatformIcon] = useState();
  const [uploadBanner, setUploadBanner] = useState(false);
  const [uploadIcon, setUploadIcon] = useState(false);
  const [sortBy, setSortBy] = useState("title");
  const [sortDirection, setSortDirection] = useState("ascending");

  useEffect(() => {
    getCurrentPlatform();
    getImageMedia();
    setModView(false);
  }, [params]);

  useEffect(() => {
    if (quizzes) {
      if (quizzes.page === 0) {
        getQuizzes();
      }
      renderCards();
    }
  }, [quizzes, modView]);

  useEffect(() => {
    if (platform) {
      setQuizzes({ page: 0, hasMore: true, quizzes: [] }); // wait before platform loads before getting quizzes
    }
  }, [platform, sortBy, sortDirection]);

  const getImageMedia = async () => {
    await getPlatformBanner(params.platform).then((banner) => {
      setBanner(banner);
    });
    await getPlatformIcon(params.platform).then((icon) => {
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
    const newPage = quizzes.page + 1;
    try {
      const response = await getQuizzesFromPlatform(name, newPage, sortBy, sortDirection);
      if (response.length === 0) {
        setQuizzes((prevState) => ({ ...prevState, page: -1, hasMore: false }));
      } else {
        const quizzesWithoutPinned = removePinnedQuizzesFromQuizzes(response);
        setQuizzes((prevState) => ({
          ...prevState,
          page: newPage,
          quizzes: prevState.quizzes.concat(quizzesWithoutPinned),
        }));
      }
    } catch (error) {
      setQuizzes((prevState) => ({ ...prevState, page: -1, hasMore: false }));
      console.log(error);
    }
  };

  const removePinnedQuizzesFromQuizzes = (quizzes) => {
    let newQuizzes = quizzes;
    platform.pinnedQuizzes.forEach((pinnedQuiz) => {
      newQuizzes = newQuizzes.filter((quiz) => quiz.title !== pinnedQuiz.title);
    });
    return newQuizzes;
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
        setQuizzes({ page: 0, hasMore: true, quizzes: [] });
      })
      .catch((error) => alert("Could not delete quiz"));
  };

  const renderCards = async () => {
    if (!quizzes || !platform) {
      return;
    }
    const allQuizzes = platform.pinnedQuizzes.concat(quizzes.quizzes);
    const cards = allQuizzes.map(async (quiz, index) => {
      const name = params.platform;
      const quizImg = await getQuizIcon(params.platform, quiz.title);
      return (
        <LargeCard
          key={index}
          iconSrc={quizImg}
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
          dropdownHandlers={{ removeQuiz, updatePinStatus }}
          cardLink={`${name}/${quiz.title}`} // Temporary fix prevents crash on redirect, use quiz page when done
          pin={platform.pinnedQuizzes.map((quiz) => quiz.title).includes(quiz.title)}
        />
      );
    });
    Promise.all(cards).then((cards) => {
      setQuizCards(cards);
    });
  };

  const updatePinStatus = (quizName, action) => {
    putUpdatePinStatus(params.platform, quizName, action)
      .then((res) => getCurrentPlatform())
      .catch((e) => console.log(e));
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

  return !platform || !quizzes ? (
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
        <div className="d-flex flex-column m-5 mt-0 align-items-end">
          <div className="d-flex flex-row sort">
            <div className="d-flex align-items-center justify-content-center pe-3">
              <Dropdown>
                <Dropdown.Toggle className="sort-dropdowns me-3">
                  {sortBy === "timeLimit" ? "Time Limit" : sortBy}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>sort by</Dropdown.Header>
                  <Dropdown.Item
                    onClick={() => {
                      setSortBy("title");
                    }}
                  >
                    Title
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSortBy("upvotes");
                    }}
                  >
                    Upvotes
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSortBy("downvotes");
                    }}
                  >
                    Downvotes
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      setSortBy("timeLimit");
                    }}
                  >
                    Time Limit
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <SortDirectionButtons
                sortDirection={sortDirection}
                onAscendingClick={() => setSortDirection("ascending")}
                onDescendingClick={() => setSortDirection("descending")}
              />
            </div>
          </div>

          <div id="platform-quizzes" className="quizzes d-flex flex-column m-10">
            <InfiniteScroll
              next={getQuizzes}
              dataLength={quizCards.length}
              hasMore={quizzes.hasMore}
              loader={
                <div className="d-flex justify-content-center mt-4">
                  <LoadingSpinner isVisible={true} />
                </div>
              }
              endMessage={
                <div className="d-flex justify-content-center mt-4">
                  <h4>No more quizzes</h4>
                </div>
              }
              className="pe-3"
              scrollThreshold={0.8}
            >
              {quizCards}
            </InfiniteScroll>
          </div>
        </div>
        <div className="information d-flex flex-column">
          {modView && (
            <div className="d-flex flex-column w-100">
              <LinkButton buttonSize="btn--large" to={`/p/${params.platform}/createQuiz`}>
                Create Quiz
              </LinkButton>
              <div className="p-1"></div>
              <LinkButton
                buttonStyle="btn--special"
                buttonSize="btn--large"
                to={`/p/${params.platform}/subscribers`}
              >
                Manage Subscribers
              </LinkButton>
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
