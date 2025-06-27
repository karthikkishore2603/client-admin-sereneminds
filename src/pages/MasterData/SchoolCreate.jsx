import React from "react";
import "./Branch.css";

const SchoolCreate = () => {
  return (
    <div
      className="branch-container"
      style={{ background: "#fafbfc", minHeight: "100vh" }}
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
          <span style={{ fontSize: 16 }}>🏠</span> State{" "}
          <span style={{ color: "#888" }}>&gt;</span> Create
        </span>
      </div>
      {/* Avatar Upload */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginBottom: 18,
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
          }}
        >
          <span>👤</span>
        </div>
        <div>
          <button
            style={{
              background: "#eaeaea",
              border: "none",
              borderRadius: 6,
              padding: "6px 18px",
              color: "#555",
              fontWeight: 500,
              fontSize: 14,
              marginRight: 8,
            }}
          >
            Upload
          </button>
          <button
            style={{
              background: "#f5f5f5",
              border: "none",
              borderRadius: 6,
              padding: "6px 18px",
              color: "#888",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            Reset
          </button>
          <div style={{ color: "#b0b0b0", fontSize: 13, marginTop: 6 }}>
            Allowed JPG, GIF or PNG. Max size of 800kB
          </div>
        </div>
      </div>
      {/* Form */}
      <form>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 32,
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            marginBottom: 24,
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
            School
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="School Name"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="Institute Code"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="Branch Code"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="Address Line 1"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="City"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="Pin Code"
                />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="School Code"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="Institute Name"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="Branch Name"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="Address Line 2"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="State"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="School Type"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 32,
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
            marginBottom: 24,
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
            Contact
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="Phone Number"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="Email ID"
                />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="Telephone Number"
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input
                  className="search-input"
                  style={{ width: "100%" }}
                  placeholder="Website Link"
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            style={{
              background: "#b0b0b0",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 28px",
              fontWeight: 500,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Submit
          </button>
          <button
            type="button"
            style={{
              background: "#f0f0f0",
              color: "#888",
              border: "none",
              borderRadius: 6,
              padding: "8px 28px",
              fontWeight: 500,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchoolCreate;
