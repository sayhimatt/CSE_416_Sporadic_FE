import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import NavBar from "../../components/NavBar/MainNav/MainNav";
import PlatformSubNav from "../../components/NavBar/PlatformSubNav/PlatformSubNav";
import Button from "../../components/Button/Button";
import SmallCard from "../../components/Card/SmallCard/SmallCard";
import { getPlatform } from "../../API/API";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";

import "./styles.scss";

const ManageSubscribers = () => {
  const { auth } = useContext(AuthContext);
  const [platform, setPlatform] = useState();
  const [search, setSearch] = useState("");
  const params = useParams();

  useEffect(() => {
    getPlatform(params.platform)
      .then((res) => setPlatform(res))
      .catch((e) => console.log("Could not get platform"));
  }, []);

  const removeSubscriber = (username) => {
    //todo
  };

  return (
    <div>
      <NavBar />
      <PlatformSubNav platformName={params.platform}>
        <Link to={`/p/${params.platform}`}>
          <Button>{`Back to ${params.platform}`}</Button>
        </Link>
      </PlatformSubNav>
      <div className="page-content d-flex flex-column align-items-center">
        <p className="fs-1">Subscriber Management</p>
        <div className="d-flex mb-3 mt-3 w-50 justify-content-center">
          <div className="searchBar searchBar--border d-flex align-items-center w-50">
            <input
              className="search"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="small-card-list w-50">
          {platform &&
            platform.subscribers
              .filter((subscriber) => subscriber.includes(search))
              .map((subscriber) => (
                <SmallCard
                  key={subscriber}
                  username={subscriber}
                  rightCard={
                    <Button onClick={(e) => removeSubscriber(subscriber)}>Ban User</Button>
                  }
                ></SmallCard>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSubscribers;
