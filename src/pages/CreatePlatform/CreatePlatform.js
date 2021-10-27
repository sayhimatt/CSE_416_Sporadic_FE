import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import MainNav from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";

import "./styles.css";

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

  return (
    <div>
      <MainNav />
      <SubNav
        heading="Platform Creation"
        buttons={
          <Button onClick={history.push("/notifications")}>
            Notifications
          </Button>
        }
      />
      <div className="content d-flex justify-content-center align-items-center">
        <div className="create-platform-container d-flex flex-column justify-content-center">
          <div className="input-item d-flex flex-column">
            <div className="input-title">Title</div>
            <div className="input-box">
              <input
                className="input"
                placeholder="Platform Title"
                onChange={setTitle}
              />
            </div>
          </div>
          <div className="input-item d-flex flex-column mt-4">
            <div className="input-title">Description</div>
            <div className="input-box description-box">
              <input
                className="input"
                placeholder="Platform Title"
                onChange={setDescription}
              />
            </div>
          </div>
          <div className="image-upload d-flex flex-row justify-content-around">
            <div className="upload-container d-flex flex-column">
              <div className="upload-title">Icon</div>
              <img alt="" src="" />
              <Button>Upload Icon</Button>
            </div>
            <div className="upload-container d-flex flex-column">
              <div className="upload-title">Banner</div>
              <img alt="" src="" />
              <Button>Upload Banner</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlatform;
