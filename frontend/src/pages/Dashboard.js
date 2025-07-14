import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";
import ChartVisualizer from "../components/ChartVisualizer";

const Dashboard = () => {
  const [excelData, setExcelData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${process.env.REACT_APP_API_URL}/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Read Excel in frontend
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        setExcelData(json);
      };
      reader.readAsBinaryString(selectedFile);

      alert("File uploaded and processed!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ fontFamily: "Segoe UI", background: "#f5f7fa", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: "30px" }}>
        <h2 style={{ fontSize: "1.8rem", color: "#333" }}>📊 Welcome to Excel Analytics Dashboard</h2>
        <p style={{ color: "#555", maxWidth: 700 }}>
          This platform enables users to analyze Excel files easily. When an Excel file is uploaded, it is automatically read using SheetJS (xlsx), converted to JSON, and shown in a structured table format. This helps in quick data insights and further visualization.
        </p>

        <div style={{ marginTop: "20px", padding: "20px", background: "white", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginBottom: "10px" }}>📥 Upload Excel File</h3>
          <input type="file" onChange={handleFileChange} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: 5, marginRight: "10px" }} />
          <button onClick={handleFileUpload} style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 5, cursor: "pointer" }}>Upload</button>
        </div>

        {excelData.length > 0 && (
          <>
            <div style={{ marginTop: "30px" }}>
              <h3>📄 Excel Data Preview:</h3>
              <table border="1" style={{ marginTop: "10px", width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f0f0f0" }}>
                    {Object.keys(excelData[0]).map((key) => (
                      <th key={key} style={{ padding: "8px", border: "1px solid #ddd" }}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {excelData.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} style={{ padding: "8px", border: "1px solid #ddd" }}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Add the ChartVisualizer component */}
            <ChartVisualizer excelData={excelData} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
