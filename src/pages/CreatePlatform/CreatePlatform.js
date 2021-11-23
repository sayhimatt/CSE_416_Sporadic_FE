import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import {
  postCreatePlatform,
  generateSetPlatformBannerURL,
  generateSetPlatformIconURL,
  setImage,
} from "../../API/API";
import { UserContext } from "../../contexts/UserContext/UserContext";
import MainNav from "../../components/NavBar/MainNav/MainNav";
import SubNav from "../../components/NavBar/SubNav/SubNav";
import Button from "../../components/Buttons/Button/Button";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import LoadingOverlay from "../../components/LoadingIndicators/LoadingOverlay";

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
  const [images, setImages] = useState({ icon: "", banner: "" });
  const [imageUploaders, setImageUploaders] = useState({ icon: false, banner: false });
  const [showLoading, setShowLoading] = useState(false);
  const { dispatch } = useContext(UserContext);

  const history = useHistory();

  const setTitle = (e) => {
    setPlatformData({ ...platformData, title: e.target.value });
  };

  const setDescription = (e) => {
    setPlatformData({ ...platformData, description: e.target.value });
  };

  const createPlatform = async () => {
    setShowLoading(true);
    setShowInUseMsg(false);
    if (invalidInputs()) {
      return;
    }
    postCreatePlatform(platformData)
      .then((res) => {
        dispatch({ type: "SUBSCRIBE", payload: platformData.title });
        return sendImagesToAWS();
      })
      .then((res) => {
        history.push(`/p/${platformData.title}`);
      })
      .catch((error) => {
        setShowLoading(false);
        if (error.response.status === 400) {
          setShowInUseMsg(true);
        } else {
          history.push(`/p/${platformData.title}`);
        }
      });
  };

  const sendImagesToAWS = async () => {
    const promises = [];
    if (images.icon !== "") {
      promises.push(
        generateSetPlatformIconURL(platformData.title)
          .then((putURL) => setImage(putURL, images.icon))
          .catch((e) => console.log(e)),
      );
    }
    if (images.banner !== "") {
      promises.push(
        generateSetPlatformBannerURL(platformData.title)
          .then((putURL) => setImage(putURL, images.banner))
          .catch((e) => console.log(e)),
      );
    }
    return await Promise.all(promises).catch((e) => console.log(e));
  };

  const customIconSubmit = (file) => {
    setImages((prevState) => ({ ...prevState, icon: file }));
    setImageUploaders((prevState) => ({ ...prevState, icon: false }));
  };

  const customBannerSubmit = (file) => {
    setImages((prevState) => ({ ...prevState, banner: file }));
    setImageUploaders((prevState) => ({ ...prevState, banner: false }));
  };

  const invalidInputs = () => {
    setShowInvalidMsg(platformData.title.includes(" "));
    return platformData.title.includes(" ");
  };

  return (
    <div>
      <MainNav />
      <SubNav heading="Platform Creation" />
      <div className="page-content d-flex flex-column justify-content-center align-items-center">
        <ErrorMessage
          visible={showInvalidMsg}
          errorStyle="errorBox"
          text="Platform Title cannot contain spaces"
        />
        <ErrorMessage
          visible={showInUseMsg}
          errorStyle="errorBox"
          text="Platform Title already in use"
        />
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
              {images.icon !== "" && (
                <img id="icon-preview" alt="" src={URL.createObjectURL(images.icon)} />
              )}
              <Button
                onClick={() => setImageUploaders((prevState) => ({ ...prevState, icon: true }))}
              >
                Upload Icon
              </Button>
            </div>
            <div className="upload-container d-flex flex-column align-items-center">
              <div className="upload-title">Banner</div>
              {images.banner !== "" && (
                <img id="banner-preview" alt="" src={URL.createObjectURL(images.banner)} />
              )}
              <Button
                onClick={() => setImageUploaders((prevState) => ({ ...prevState, banner: true }))}
              >
                Upload Banner
              </Button>
            </div>
          </div>
        </div>
        <Button buttonSize="btn--large" buttonStyle="btn--special" onClick={createPlatform}>
          Create Platform
        </Button>
      </div>
      <ImageUploader
        visible={imageUploaders.icon}
        desiredFile="platform icon"
        desiredPlatform={platformData.title}
        visibilityHandler={() => setImageUploaders((prevState) => ({ ...prevState, icon: false }))}
        customSubmit={customIconSubmit}
      />
      <ImageUploader
        visible={imageUploaders.banner}
        desiredFile="platform banner"
        desiredPlatform={platformData.title}
        visibilityHandler={() =>
          setImageUploaders((prevState) => ({ ...prevState, banner: false }))
        }
        customSubmit={customBannerSubmit}
      />
      <LoadingOverlay isVisible={showLoading} />
    </div>
  );
};

export default CreatePlatform;
