import React, { useState, useContext } from "react";
import { Form } from "react-bootstrap";
import "./styles.scss";
import { UserContext } from "../../contexts/UserContext/UserContext";
import {
  generateSetUserIconURL,
  setImage,
  generateSetPlatformIconURL,
  generateSetPlatformBannerURL,
} from "../../API/API";

const ImageUploader = ({ visible, desiredFile, desiredPlatform }) => {
  const [file, setFile] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const { user, dispatch } = useContext(UserContext);
  const onChange = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0].type !== "image/png") {
      setFile("");
      setUploadStatus("File must be a png");
    } else {
      setFile(e.target.files[0]);
      setUploadStatus("Press upload!");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (file != "") {
      // Now call the generator based on what we're uploading
      // our desiredFile's possibilities = {"platform icon", "platform banner", "quiz icon", "avatar"}
      console.log(typeof desiredFile);
      const uploadType = desiredFile.toString().trim().toLowerCase();
      let putURL = ``;
      console.log(desiredPlatform);
      switch (uploadType) {
        case "platform icon":
          putURL = await generateSetPlatformIconURL(desiredPlatform);
          break;
        case "platform banner":
          putURL = await generateSetPlatformBannerURL(desiredPlatform);
          break;
        case "quiz icon":
          // TODO: See if we're implementing on API
          break;
        case "avatar":
          putURL = await generateSetUserIconURL(user.username);
          break;
        default:
          throw `Error given invalid desiredFile ${desiredFile} not correct`;
      }
      console.log(putURL);
      // Validate and send
      if (putURL != null) {
        const out = await setImage(putURL, file);
        if (out !== 1) {
          setUploadStatus(`Error uploading file`);
        } else {
          setUploadStatus(`File uploaded!`);
          if(uploadType === "avatar"){
            window.location.reload(false); // They're changing their avatar so have it reload the page.
          }
        }
      } else {
        setUploadStatus(`Error uploading file`);
      }
    } else {
      setUploadStatus("Choose a png file");
    }
  };
  if (visible) {
    return (
      <div className="image-uploader flex-row align-items-center mt-4">
        <Form.Group controlId="formFile" className="mb-3" onSubmit={onSubmit}>
          <Form.Label>Please select a {desiredFile} image</Form.Label>
          <Form.Control type="file" onChange={onChange} />
        </Form.Group>
        <div>
          <input
            type="submit"
            value="Upload"
            className="btn btn-primary btn-block upload-button"
            onClick={onSubmit}
          />
          <p>{uploadStatus}</p>
        </div>
      </div>
    );
  }else{
    return ( null );
  }
};

export default ImageUploader;
