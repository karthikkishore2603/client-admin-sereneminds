import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Branch.css";

const DivisionCreate = () => {
  const [form, setForm] = useState({
    divisionName: "",
    className: "",
    schoolName: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    navigate("/division");
  };

  return (
    <div className="branch-form-container">
      <div className="breadcrumb">
        <span onClick={() => navigate('/division')}>Division</span> &gt; <span>Create</span>
      </div>
      <div className="branch-form-card">
        <div className="branch-form-title">Class</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="divisionName"
            placeholder="Division Name"
            value={form.divisionName}
            onChange={handleChange}
            className="branch-input"
          />
          <input
            type="text"
            name="className"
            placeholder="Class Name"
            value={form.className}
            onChange={handleChange}
            className="branch-input"
          />
          <input
            type="text"
            name="schoolName"
            placeholder="School Name"
            value={form.schoolName}
            onChange={handleChange}
            className="branch-input"
          />
          <div className="branch-form-actions">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/division")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DivisionCreate; 