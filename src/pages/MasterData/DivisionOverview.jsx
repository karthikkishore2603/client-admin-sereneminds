import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Branch.css";

const mockDivision = {
  id: 1,
  name: "A",
  code: "125346",
  schoolName: "Xyz Secondary School",
  schoolCode: "125346",
  className: "XII Std",
  classCode: "235453",
};

const DivisionOverview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // In real app, fetch by id
  const division = mockDivision;

  return (
    <div className="branch-overview-container">
      <div className="breadcrumb">
        <span onClick={() => navigate("/division")}>Division</span> &gt;{" "}
        <span>Overview</span>
      </div>
      <div className="overview-tabs">
        <button className="tab active">Overview</button>
        <button className="tab">History</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div style={{ flex: 1 }}></div>
        <button
          className="submit-btn"
          style={{ marginBottom: 0 }}
          onClick={() => navigate(`/division/edit/${id}`)}
        >
          Edit
        </button>
      </div>
      <div className="overview-card">
        <div className="overview-title">Details</div>
        <div className="overview-details-grid">
          <div>
            <div className="detail-label">Division Name</div>
            <div className="detail-value">{division.name}</div>
          </div>
          <div>
            <div className="detail-label">Division Code</div>
            <div className="detail-value">: {division.code}</div>
          </div>
          <div>
            <div className="detail-label">School Name</div>
            <div className="detail-value">: {division.schoolName}</div>
          </div>
          <div>
            <div className="detail-label">School Code</div>
            <div className="detail-value">: {division.schoolCode}</div>
          </div>
          <div>
            <div className="detail-label">Class Name</div>
            <div className="detail-value">: {division.className}</div>
          </div>
          <div>
            <div className="detail-label">Class Code</div>
            <div className="detail-value">: {division.classCode}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DivisionOverview;
