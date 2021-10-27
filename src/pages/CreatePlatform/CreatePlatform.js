import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import axios from "axios";

import MainNav from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";

import "./styles.scss";

const CreatePlatform = () => {
  const [platformData, setPlatformData] = useState({
    title: "",
    description: "",
    icon: "",
    banner: "",
  });

  const history = useHistory();

  const setTitle = (e) => {
    setPlatformData({ ...platformData, title: e.target.value });
  };

  const setDescription = (e) => {
    setPlatformData({ ...platformData, description: e.target.value });
  };

  const uploadIcon = (e) => {
    return;
  };

  const uploadBanner = (e) => {
    return;
  };

  const createPlatform = async () => {
    if (!checkValidInputs()) {
      alert("Invalid inputs");
      return;
    }
    const session = await Auth.currentSession();
    const token = session.getIdToken().getJwtToken();
    await axios
      .post(
        "https://cse-416-sporadic-api-prod.herokuapp.com/platforms/",
        { title: platformData.title, description: platformData.description },
        { headers: { authorization: `Bearer: ${token}` } }
      )
      .then((res) => {
        history.push(`/p/${platformData.title}`);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          alert("Platform title already in use");
        }
      });
  };

  const checkValidInputs = () => {
    return (
      0 < platformData.title.length &&
      platformData.title.length <= 100 &&
      0 < platformData.description.length &&
      platformData.description.length <= 500
    );
  };

  return (
    <div>
      <MainNav />
      <SubNav
        heading="Platform Creation"
        buttons={
          <Button onClick={() => history.push("/notifications")}>
            Notifications
          </Button>
        }
      />
      <div className="page-content d-flex flex-column justify-content-center align-items-center">
        <div className="create-platform-container d-flex flex-column justify-content-center">
          <div className="input-item d-flex flex-column align-items-start">
            <div className="input-title">Title</div>
            <div className="input-box title-box">
              <textarea
                className="input"
                placeholder="Platform Title"
                onChange={setTitle}
              />
            </div>
          </div>
          <div className="input-item d-flex flex-column mt-4">
            <div className="input-title">Description</div>
            <div className="input-box description-box">
              <textarea
                className="input"
                placeholder="Platform Description"
                onChange={setDescription}
              />
            </div>
          </div>
          <div className="image-upload d-flex flex-row justify-content-around mt-4">
            <div className="upload-container d-flex flex-column align-items-center">
              <div className="upload-title">Icon</div>
              <img alt="" src="" />
              <Button onClick={uploadIcon}>Upload Icon</Button>
            </div>
            <div className="upload-container d-flex flex-column align-items-center">
              <div className="upload-title">Banner</div>
              <img alt="" src="" />
              <Button onClick={uploadBanner}>Upload Banner</Button>
            </div>
          </div>
        </div>
        <Button buttonStyle="btn--special" onClick={createPlatform}>
          Create Platform
        </Button>
      </div>
    </div>
  );
};

export default CreatePlatform;
