import React, { useRef } from "react";

const ImageUploader = ({ onFileSelect }) => {
  const imgInput = useRef(null);

  const handleFileInput = (e) => {
    // handle check to see if .png
    const file = e.target.files[0];
    console.log(file.type);
    console.log(file.size);
    onFileSelect(file);
  };
  return (
    <div className="image-uploader">
      <input type="file" onChange={handleFileInput}></input>
      <button
        onClick={(e) => imgInput.current && imgInput.current.click()}
        className="btn btn-primary"
      ></button>
    </div>
  );
};

export default ImageUploader;
