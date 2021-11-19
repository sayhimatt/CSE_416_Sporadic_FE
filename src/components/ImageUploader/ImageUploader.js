import React, { useState, useContext } from "react";
import { Form } from "react-bootstrap";
import "./styles.css";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { generateSetUserIconURL, setUserIcon } from "../../API/API";

const ImageUploader = (desiredFile) => {
  const [file, setFile] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const { user } = useContext(UserContext);
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
    if(file != ""){
      // Now call the generator based on what we're uploading
      console.log("hello there");
      console.log(user.username);
      const putURL = await generateSetUserIconURL(user.username);
      console.log(putURL);
      setUserIcon(putURL, file);      
    }else{
      setUploadStatus("Choose a png file");
    }
    // Validate and send
  };
  return (
    <div className="imageUploader flex-row align-items-center mt-4">
      <Form.Group controlId="formFile" className="mb-1" onSubmit={onSubmit}>
        <Form.Label>Please select a {desiredFile.desiredFile} image</Form.Label>
        <Form.Control type="file" onChange={onChange} />
      </Form.Group>
      <div>
        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block"
          onClick={onSubmit}
        />
        <p>{uploadStatus}</p>
      </div>
    </div>
  );
};

export default ImageUploader;
