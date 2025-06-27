import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Branch.css";

const mockDivision = {
  id: 1,
  divisionName: "A",
  divisionCode: "125346",
  className: "XII Std",
  classCode: "235453",
  schoolName: "Xyz Secondary School",
  schoolCode: "125346",
};

const DivisionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // In real app, fetch by id
  const [form, setForm] = useState({ ...mockDivision });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update logic here
    navigate("/division");
  };

  return (
    <div className="branch-form-container">
      <div className="breadcrumb">
        <span onClick={() => navigate('/division')}>Division</span> &gt; <span>Edit</span>
      </div>
      <div className="branch-form-card">
        <div className="branch-form-title">Class</div>
        <form onSubmit={handleSubmit} className="edit-grid">
          <div>
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
              readOnly
              className="branch-input readonly"
            />
            <input
              type="text"
              name="schoolName"
              placeholder="School Name"
              value={form.schoolName}
              readOnly
              className="branch-input readonly"
            />
          </div>
          <div>
            <input
              type="text"
              name="divisionCode"
              placeholder="Division Code"
              value={form.divisionCode}
              readOnly
              className="branch-input readonly"
            />
            <input
              type="text"
              name="classCode"
              placeholder="Class Code"
              value={form.classCode}
              readOnly
              className="branch-input readonly"
            />
            <input
              type="text"
              name="schoolCode"
              placeholder="School Code"
              value={form.schoolCode}
              readOnly
              className="branch-input readonly"
            />
          </div>
          <div className="branch-form-actions">
            <button type="submit" className="submit-btn">Update</button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/division")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DivisionEdit; 