import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./styles.css";

const ImageUploader = (desiredFile) => {
  const [file, setFile] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const onChange = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0].type !== "image/png") {
      setUploadStatus("File must be a png");
    } else {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Call API method to retrieve URL
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
