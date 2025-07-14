import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPortal = () => {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const fetchAllUploads = async () => {
      const token = localStorage.getItem("token");
      if (!token) return alert("Not logged in");

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/files/all-uploads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploads(res.data);
      } catch (err) {
        alert("Access denied or error fetching uploads");
      }
    };
    fetchAllUploads();
  }, []);

  return (
    <div>
      <h2>Admin Portal - All Uploaded Files</h2>
      {uploads.length === 0 ? (
        <p>No uploads found.</p>
      ) : (
        uploads.map((file, idx) => (
          <div key={idx} style={{ marginBottom: "2rem" }}>
            <h4>
              {file.filename} - by {file.user.email} (Uploaded: {new Date(file.uploadedAt).toLocaleString()})
            </h4>
            <table border="1" style={{ width: "100%" }}>
              <thead>
                <tr>
                  {file.data[0] && Object.keys(file.data[0]).map((key) => <th key={key}>{key}</th>)}
                </tr>
              </thead>
              <tbody>
                {file.data.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => <td key={j}>{val}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};
export default AdminPortal;