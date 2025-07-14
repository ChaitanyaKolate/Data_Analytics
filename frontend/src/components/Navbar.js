import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", background: "#333", color: "white" }}>
      <div>
        <strong>📊 Excel Dashboard</strong>
      </div>
      <div>
        <Link to="/register" style={{ color: "white", marginRight: 20 }}>Register</Link>
        <button onClick={handleLogout} style={{ background: "green", color: "white", padding: "5px 10px" }}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
