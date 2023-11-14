import React, { useState } from "react";
import "./ImageGenarator.css";
import Api from "../api.jsx";
import { AiOutlineDownload } from "react-icons/ai";

const ImageGenerator = () => {
  const [text, setText] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateImage = () => {
    setLoading(true);
    fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Autorazation: `Bearer ${Api}`,
        },
        body: JSON.stringify({ inputs: text }),
      }
    )
      .then((res) => res.blob())
      .then((blob) => {
        const imageUrl = window.URL.createObjectURL(blob);
        setImageURL(imageUrl);
        setLoading(false);
      });
  };

  const handleDownloadImage = () => {
    if (imageURL) {
      const a = document.createElement("a");
      a.href = imageURL;
      a.download = "generated_image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGenerateImage();
    }
  };

  return (
    <div className="container">
      <h1 className="container-header">
        Image<span className="container-header-text">Generator</span>
      </h1>
      <form className="container-from">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your promt here..."
          onKeyDown={handleKeyDown}
        />

        <button type="button" onClick={handleGenerateImage}>
          Generate
        </button>
        {imageURL && (
          <button type="button" onClick={handleDownloadImage}>
            <AiOutlineDownload style={{ width: "30px", height: "30px" }} />
          </button>
        )}
      </form>
      {imageURL && (
        <div className="image-display">
          <img src={imageURL} alt={imageURL} />
          <div className="loading">
            <div className={loading ? "loading-bar-full" : "loading-bar"}>
              <div className={loading ? "loading-text" : "display-none"}>
                Loading...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
