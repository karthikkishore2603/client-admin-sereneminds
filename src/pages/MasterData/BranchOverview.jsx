import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiChevronRight, FiEdit } from "react-icons/fi";
import "./Branch.css";

const tabs = [
  { label: "Overview" },
  { label: "Security" },
  { label: "History" },
];

const BranchOverview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div
      className="branch-container"
      style={{ background: "#f7f7f7", minHeight: "100vh" }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          fontSize: 13,
          color: "#b0b0b0",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 16 }}>🏠</span> Branch{" "}
          <FiChevronRight size={14} /> Overview
        </span>
      </div>
      {/* Header Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 28,
          display: "flex",
          alignItems: "center",
          marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "#eaeaea",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            color: "#b0b0b0",
            marginRight: 28,
          }}
        >
          <span>👤</span>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 20,
              color: "#222",
              marginBottom: 6,
            }}
          >
            Example Branch Name
          </div>
        </div>
        <button
          style={{
            background: "#f5f5f5",
            border: "none",
            borderRadius: 8,
            padding: "8px 18px",
            color: "#555",
            fontWeight: 500,
            fontSize: 15,
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
          onClick={() => navigate(`/branch/edit/${id}`)}
        >
          <FiEdit /> Edit
        </button>
      </div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            style={{
              background: idx === 0 ? "#eaeaea" : "transparent",
              color: idx === 0 ? "#555" : "#888",
              border: "none",
              borderRadius: 8,
              padding: "8px 22px",
              fontWeight: 500,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              boxShadow: idx === 0 ? "0 1px 2px rgba(0,0,0,0.03)" : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Details Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 18,
            color: "#444",
            marginBottom: 18,
          }}
        >
          Details
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              Branch Name{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>
                : Example School Name
              </span>
            </div>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              Institute Name{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>
                : Example Institute
              </span>
            </div>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              Branch Name{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>
                : Example Branch
              </span>
            </div>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              Phone Number{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>
                : 9876543210
              </span>
            </div>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              Address Line 1{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>
                : Address Line 1
              </span>
            </div>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              City{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>: Chennai</span>
            </div>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              Pin Code{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>: 600107</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              Branch Code{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>
                : client-ZQ2411009B
              </span>
            </div>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              Institute Code{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>
                : client-ZQ2411009B
              </span>
            </div>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              Branch Code{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>
                : client-ZQ2411009B
              </span>
            </div>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              Email Address{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>
                : Example@gmail.com
              </span>
            </div>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              Address Line 2{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>
                : Address Line 2
              </span>
            </div>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              State{" "}
              <span style={{ color: "#222", fontWeight: 500 }}>: Chennai</span>
            </div>
            <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
              Website{" "}
              <span style={{ color: "#b0b0b0", fontWeight: 400 }}>
                www.example.com
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchOverview;
