import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [uploads, setUploads] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/dashboard");
    }

    const token = localStorage.getItem("token");

    const fetchUploads = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/files/all-uploads`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploads(res.data);
      } catch (err) {
        alert("Error loading uploads");
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users");
      }
    };

    fetchUploads();
    fetchUsers();
  }, [navigate]);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "UserList.xlsx");
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <h2 style={{ padding: "10px" }}>Admin Panel</h2>

      {/* Upload Table */}
      <h3 style={{ padding: "10px" }}>📁 Uploaded Files</h3>
      {uploads.length > 0 ? (
        <table border="1" style={{ margin: "20px", width: "95%" }}>
          <thead>
            <tr>
              <th>User</th>
              <th>File Name</th>
              <th>Uploaded At</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr key={upload._id}>
                <td>{upload.user?.email || "Unknown"}</td>
                <td>{upload.filename}</td>
                <td>{new Date(upload.uploadedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ padding: "10px" }}>No uploads found.</p>
      )}

      {/* User Table */}
      <h3 style={{ padding: "10px" }}>👤 Registered Users</h3>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 20px 10px" }}>
        <input
          type="text"
          placeholder="Search by email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: 8, width: 250, borderRadius: 5, border: "1px solid #ccc" }}
        />
        <button onClick={downloadExcel} style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: 5 }}>
          Download Excel
        </button>
      </div>

      {filteredUsers.length > 0 ? (
        <table border="1" style={{ margin: "0 20px 20px", width: "95%" }}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u._id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ padding: "10px" }}>No users found.</p>
      )}
    </div>
  );
};

export default Admin;
