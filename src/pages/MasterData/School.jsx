import React, { useState, useEffect } from "react";
import { FiEdit, FiFilter, FiDownload, FiMaximize2 } from "react-icons/fi";
import "./Branch.css";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const labelStyle = {
  fontSize: 13,
  color: "#888",
  marginBottom: 4,
  display: "block",
  fontWeight: 500,
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #e0e0e0",
  borderRadius: 6,
  fontSize: 15,
  marginBottom: 0,
  background: "#fafbfc",
  outline: "none",
};

const fieldWrapper = {
  marginBottom: 18,
};

const School = () => {
  const [schools, setSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [view, setView] = useState("list"); // "list" or "create"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state for create
  const [form, setForm] = useState({
    name: "",
    code: "",
    institute: "",
    instituteCode: "",
    branch: "",
    branchCode: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pin: "",
    type: "",
    phone: "",
    email: "",
    telephone: "",
    website: "",
  });

  // Fetch schools from API
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/schools");
      if (!response.ok) {
        throw new Error("Failed to fetch schools");
      }
      const data = await response.json();
      setSchools(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching schools:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load schools on component mount
  useEffect(() => {
    fetchSchools();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/schools/${id}/toggle-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to toggle status");
      }
      const updatedSchool = await response.json();
      setSchools((prev) =>
        prev.map((school) => (school.id === id ? updatedSchool : school))
      );
    } catch (err) {
      setError(err.message);
      console.error("Error toggling status:", err);
    }
  };

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.institute.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const total = filteredSchools.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredSchools.slice(startIdx, endIdx);

  // Handlers for form
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error("Failed to create school");
      }
      const newSchool = await response.json();
      setSchools([newSchool, ...schools]);
      setForm({
        name: "",
        code: "",
        institute: "",
        instituteCode: "",
        branch: "",
        branchCode: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        pin: "",
        type: "",
        phone: "",
        email: "",
        telephone: "",
        website: "",
      });
      setView("list");
    } catch (err) {
      setError(err.message);
      console.error("Error creating school:", err);
    } finally {
      setLoading(false);
    }
  };

  // Main render
  if (view === "create") {
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
            <span style={{ fontSize: 16 }}>🏠</span> School{" "}
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
              type="button"
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
              type="button"
            >
              Reset
            </button>
            <div style={{ color: "#b0b0b0", fontSize: 13, marginTop: 6 }}>
              Allowed JPG, GIF or PNG. Max size of 800kB
            </div>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleFormSubmit}>
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 32,
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              marginBottom: 24,
              maxWidth: 950,
              margin: "0 auto 24px auto",
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
              School Details
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 32,
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>School Name</label>
                  <input
                    style={inputStyle}
                    placeholder="School Name"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>Institute Code</label>
                  <input
                    style={inputStyle}
                    placeholder="Institute Code"
                    name="instituteCode"
                    value={form.instituteCode}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>Branch Code</label>
                  <input
                    style={inputStyle}
                    placeholder="Branch Code"
                    name="branchCode"
                    value={form.branchCode}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>Address Line 1</label>
                  <input
                    style={inputStyle}
                    placeholder="Address Line 1"
                    name="address1"
                    value={form.address1}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>City</label>
                  <input
                    style={inputStyle}
                    placeholder="City"
                    name="city"
                    value={form.city}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>Pin Code</label>
                  <input
                    style={inputStyle}
                    placeholder="Pin Code"
                    name="pin"
                    value={form.pin}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>School Code</label>
                  <input
                    style={inputStyle}
                    placeholder="School Code"
                    name="code"
                    value={form.code}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>Institute Name</label>
                  <input
                    style={inputStyle}
                    placeholder="Institute Name"
                    name="institute"
                    value={form.institute}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>Branch Name</label>
                  <input
                    style={inputStyle}
                    placeholder="Branch Name"
                    name="branch"
                    value={form.branch}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>Address Line 2</label>
                  <input
                    style={inputStyle}
                    placeholder="Address Line 2"
                    name="address2"
                    value={form.address2}
                    onChange={handleFormChange}
                  />
                </div>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>State</label>
                  <input
                    style={inputStyle}
                    placeholder="State"
                    name="state"
                    value={form.state}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>School Type</label>
                  <input
                    style={inputStyle}
                    placeholder="School Type"
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    required
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
              maxWidth: 950,
              margin: "0 auto 24px auto",
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
              Contact Details
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 32,
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    style={inputStyle}
                    placeholder="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>Email ID</label>
                  <input
                    style={inputStyle}
                    placeholder="Email ID"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>Telephone Number</label>
                  <input
                    style={inputStyle}
                    placeholder="Telephone Number"
                    name="telephone"
                    value={form.telephone}
                    onChange={handleFormChange}
                  />
                </div>
                <div style={fieldWrapper}>
                  <label style={labelStyle}>Website Link</label>
                  <input
                    style={inputStyle}
                    placeholder="Website Link"
                    name="website"
                    value={form.website}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>
          </div>
          {error && (
            <div
              style={{ color: "red", textAlign: "center", marginBottom: 16 }}
            >
              {error}
            </div>
          )}
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#ccc" : "#4a90e2",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "10px 36px",
                fontWeight: 600,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: 1,
              }}
            >
              {loading ? "Creating..." : "Submit"}
            </button>
            <button
              type="button"
              style={{
                background: "#f0f0f0",
                color: "#888",
                border: "none",
                borderRadius: 6,
                padding: "10px 36px",
                fontWeight: 500,
                fontSize: 16,
                cursor: "pointer",
              }}
              onClick={() => setView("list")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // List view
  return (
    <div className="branch-container">
      <div className="branch-header">
        <select
          className="dropdown"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          {PAGE_SIZE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search"
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <div className="actions">
          <button className="create-btn" onClick={() => setView("create")}>
            + Create
          </button>
          <button className="icon-btn">
            <FiDownload />
          </button>
          <button className="icon-btn">
            <FiMaximize2 />
          </button>
          <button className="icon-btn">
            <FiFilter />
          </button>
        </div>
      </div>
      {error && (
        <div style={{ color: "red", textAlign: "center", marginBottom: 16 }}>
          {error}
        </div>
      )}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading schools...
        </div>
      ) : (
        <table className="branch-table">
          <thead>
            <tr>
              <th>School Name</th>
              <th>Institute</th>
              <th>Branch</th>
              <th>School Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((school) => (
              <tr key={school.id}>
                <td>
                  <div className="branch-name">{school.name}</div>
                  <div className="branch-code">{school.code}</div>
                </td>
                <td>
                  <div className="institute-name">{school.institute}</div>
                  <div className="institute-code">{school.instituteCode}</div>
                </td>
                <td>
                  <div className="branch-name">{school.branch}</div>
                  <div className="branch-code">{school.branchCode}</div>
                </td>
                <td>
                  <div className="branch-name">{school.type}</div>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={school.status}
                      onChange={() => toggleStatus(school.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => alert("Overview/Edit not implemented")}
                  >
                    <FiEdit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="branch-footer">
        <div className="footer-text">
          Showing {total === 0 ? 0 : startIdx + 1} to {endIdx} of {total}{" "}
          entries
        </div>
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default School;
