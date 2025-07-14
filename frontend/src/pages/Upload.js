// 📁 frontend/src/pages/Upload.js
import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const Upload = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file); // 'file' is the key backend expects

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // send token
          },
        }
      );
      alert(res.data.msg);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("File upload failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>📤 Upload Excel File</h2>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "15px" }}
        />
        <br />
        <button
          onClick={handleUpload}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default Upload;
