import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiFilter, FiDownload, FiMaximize2 } from "react-icons/fi";
import "./Branch.css";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const ClassPage = () => {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    school: "",
  });
  const navigate = useNavigate();

  // Fetch classes from API
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/classes");
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching classes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/classes/${id}/toggle-status`,
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
      const updatedClass = await response.json();
      setClasses((prev) =>
        prev.map((cls) => (cls.id === id ? updatedClass : cls))
      );
    } catch (err) {
      setError(err.message);
      console.error("Error toggling status:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // Generate a unique code for the class
      const code = Math.random().toString(36).substr(2, 8).toUpperCase();
      const schoolCode = Math.random().toString(36).substr(2, 8).toUpperCase();

      const classData = {
        name: formData.name,
        code: code,
        school: formData.school,
        schoolCode: schoolCode,
        status: true,
      };

      const response = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });

      if (!response.ok) {
        throw new Error("Failed to create class");
      }

      const newClass = await response.json();
      setClasses((prev) => [newClass, ...prev]);
      setFormData({ name: "", school: "" });
      setIsCreateMode(false);
    } catch (err) {
      setError(err.message);
      console.error("Error creating class:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", school: "" });
    setIsCreateMode(false);
    setError("");
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const total = filteredClasses.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredClasses.slice(startIdx, endIdx);

  // Create Mode View
  if (isCreateMode) {
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
            <span style={{ fontSize: 16 }}>🏠</span> Class{" "}
            <span style={{ color: "#888" }}>&gt;</span> Create
          </span>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit}>
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
              Class
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ marginBottom: 12 }}>
                  <input
                    className="search-input"
                    style={{ width: "100%" }}
                    placeholder="Class Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ marginBottom: 12 }}>
                  <input
                    className="search-input"
                    style={{ width: "100%" }}
                    placeholder="School Name"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    required
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
          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#ccc" : "#b0b0b0",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 28px",
                fontWeight: 500,
                fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
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
  }

  // List Mode View
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
          <button className="create-btn" onClick={() => setIsCreateMode(true)}>
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
          Loading classes...
        </div>
      ) : (
        <table className="branch-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>School</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((cls) => (
              <tr key={cls.id}>
                <td>
                  <div className="branch-name">{cls.name}</div>
                  <div className="branch-code">{cls.code}</div>
                </td>
                <td>
                  <div className="branch-name">{cls.school}</div>
                  <div className="branch-code">{cls.schoolCode}</div>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={cls.status}
                      onChange={() => toggleStatus(cls.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/class/overview/${cls.id}`)}
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

export default ClassPage;
