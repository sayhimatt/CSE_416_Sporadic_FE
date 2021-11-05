import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { postCreatePlatform } from "../../API/API";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Button/Button";
import ErrorMessage from  "../../components/ErrorMessage/ErrorMessage";

import "./styles.scss";

const CreatePlatform = () => {
  const [platformData, setPlatformData] = useState({
    title: "",
    description: "",
    icon: "",
    banner: "",
  });
  const [showInvalidMsg, setShowInvalidMsg] = useState(false);
  const [showInUseMsg, setShowInUseMsg] = useState(false);

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
    setShowInUseMsg(false);
    if (invalidInputs()) {
      return;
    }
    await postCreatePlatform(platformData)
      .then((res) => {
        history.push(`/p/${platformData.title}`);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setShowInUseMsg(true);
        } else setShowInUseMsg(false);
      });
  };

  const invalidInputs = () => {
    setShowInvalidMsg(platformData.title.includes(" "));
    return platformData.title.includes(" ");
  };

  return (
    <div>
      <MainNav />
      <SubNav
        heading="Platform Creation"
        buttons={<Button onClick={() => history.push("/notifications")}>Notifications</Button>}
      />
      <div className="page-content d-flex flex-column justify-content-center align-items-center">
      <ErrorMessage 
        visible={showInvalidMsg} 
        errorStyle="errorBox" 
        text="Platform Title cannot contain spaces"/>
      <ErrorMessage 
        visible={showInUseMsg} 
        errorStyle="errorBox" 
        text="Platform Title already in use"/>

        <div className="create-platform-container d-flex flex-column justify-content-center">
          <div className="input-item d-flex flex-column align-items-start">
            <div className="input-title">Title</div>
            <div className="input-box title-box">
              <textarea
                className="input"
                placeholder="Platform Title"
                maxLength={30}
                onChange={setTitle}
              />
            </div>
          </div>
          <div className="input-item d-flex flex-column mt-4">
            <div className="input-title">Description</div>
            <div className="input-box description-box d-flex flex-column justify-content-between">
              <textarea
                className="input"
                placeholder="Platform Description"
                maxLength={500}
                onChange={setDescription}
              />
              <div className="character-count align-self-end">
                Characters Left: {500 - platformData.description.length}
              </div>
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
