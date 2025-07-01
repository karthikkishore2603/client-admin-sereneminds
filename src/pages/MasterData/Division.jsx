import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiFilter,
  FiDownload,
  FiMaximize2,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import "./Branch.css";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const defaultForm = { name: "", class: "", school: "", code: "", status: true };

const Division = () => {
  const [divisions, setDivisions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // UI mode: "list" | "form" | "overview"
  const [mode, setMode] = useState("list");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [form, setForm] = useState(defaultForm);

  // Fetch divisions from API
  const fetchDivisions = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/divisions");
      if (!response.ok) throw new Error("Failed to fetch divisions");
      const data = await response.json();
      setDivisions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  // Helpers
  const getDivisionById = (id) => divisions.find((d) => d.id === id);

  // Status toggle
  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/divisions/${id}/toggle-status`,
        { method: "PATCH", headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error("Failed to toggle status");
      const updatedDivision = await response.json();
      setDivisions((prev) =>
        prev.map((div) => (div.id === id ? updatedDivision : div))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Filtered and paginated data
  const filteredDivisions = divisions.filter((div) =>
    div.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filteredDivisions.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredDivisions.slice(startIdx, endIdx);

  // Form handlers
  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const handleCancel = () => {
    setMode("list");
    setForm(defaultForm);
    setIsEdit(false);
    setEditId(null);
    setSelectedDivision(null);
    setError("");
  };

  // Create or Edit submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name) {
      setError("Division name is required");
      return;
    }
    try {
      setLoading(true);
      if (isEdit && editId) {
        // Edit
        const response = await fetch(
          `http://localhost:5000/api/divisions/${editId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          }
        );
        if (!response.ok) throw new Error("Failed to update division");
        const updatedDivision = await response.json();
        setDivisions((prev) =>
          prev.map((div) => (div.id === editId ? updatedDivision : div))
        );
      } else {
        // Create
        const response = await fetch("http://localhost:5000/api/divisions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            code: Math.floor(Math.random() * 100000000).toString(),
          }),
        });
        if (!response.ok) throw new Error("Failed to create division");
        const newDivision = await response.json();
        setDivisions((prev) => [newDivision, ...prev]);
      }
      setMode("list");
      setForm(defaultForm);
      setIsEdit(false);
      setEditId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit handler
  const handleEdit = (div) => {
    setForm({
      name: div.name || "",
      class: div.class || "",
      school: div.school || "",
      code: div.code || "",
      status: div.status,
    });
    setIsEdit(true);
    setEditId(div.id);
    setMode("form");
  };

  // Overview handler
  const handleOverview = (div) => {
    setSelectedDivision(div);
    setMode("overview");
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/divisions/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete division");
      setDivisions((prev) => prev.filter((div) => div.id !== id));
      setDeleteConfirmId(null);
      if (selectedDivision && selectedDivision.id === id) {
        setMode("list");
        setSelectedDivision(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- FORM VIEW ---
  if (mode === "form") {
    return (
      <div className="branch-form-container">
        <div className="breadcrumb">
          <span>Division</span>
          <span style={{ color: "#888" }}>&gt;</span>
          <span>{isEdit ? "Edit" : "Create"}</span>
        </div>
        <div className="branch-form-card">
          <form onSubmit={handleFormSubmit} className="edit-grid">
            <div className="field">
              <label>Division Name</label>
              <input
                type="text"
                className="branch-input"
                placeholder="Division Name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Class Name</label>
              <input
                type="text"
                className="branch-input"
                placeholder="Class Name"
                value={form.class}
                onChange={(e) => handleChange("class", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>School Name</label>
              <input
                type="text"
                className="branch-input"
                placeholder="School Name"
                value={form.school}
                onChange={(e) => handleChange("school", e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Status</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={form.status}
                  onChange={() => handleChange("status", !form.status)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            {error && (
              <div
                style={{ color: "red", textAlign: "center", marginBottom: 16 }}
              >
                {error}
              </div>
            )}
            <div className="branch-form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {isEdit
                  ? loading
                    ? "Updating..."
                    : "Update"
                  : loading
                  ? "Creating..."
                  : "Submit"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- OVERVIEW VIEW ---
  if (mode === "overview" && selectedDivision) {
    const div = selectedDivision;
    return (
      <div className="branch-overview-container">
        <div className="breadcrumb">
          <span>Division</span>
          <span style={{ color: "#888" }}>&gt;</span>
          <span>Overview</span>
        </div>
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
            <span>🏫</span>
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
              {div.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                color: "#888",
                fontSize: 15,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FiEdit /> {div.class}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FiEdit /> {div.school}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FiEdit /> {div.code}
              </span>
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
            onClick={() => handleEdit(div)}
          >
            <FiEdit /> Edit
          </button>
        </div>
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
                Division Name{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {div.name}
                </span>
              </div>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Class Name{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {div.class}
                </span>
              </div>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                School Name{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {div.school}
                </span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Division Code{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {div.code}
                </span>
              </div>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Status{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {div.status ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <div className="branch-form-actions" style={{ marginTop: 32 }}>
            <button className="cancel-btn" onClick={handleCancel}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
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
          <button
            className="create-btn"
            onClick={() => {
              setMode("form");
              setIsEdit(false);
              setForm(defaultForm);
              setEditId(null);
            }}
          >
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
          Loading divisions...
        </div>
      ) : (
        <table className="branch-table">
          <thead>
            <tr>
              <th>Division Name</th>
              <th>Class</th>
              <th>School</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((div) => (
              <tr key={div.id}>
                <td>
                  <div className="branch-name">{div.name}</div>
                  <div className="branch-code">{div.code}</div>
                </td>
                <td>
                  <div className="branch-name">{div.class}</div>
                </td>
                <td>
                  <div className="branch-name">{div.school}</div>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={div.status}
                      onChange={() => toggleStatus(div.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button
                    className="edit-btn"
                    title="Edit"
                    onClick={() => handleEdit(div)}
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    className="edit-btn"
                    title="Overview"
                    onClick={() => handleOverview(div)}
                  >
                    <FiEye size={16} />
                  </button>
                  <button
                    className="edit-btn"
                    title="Delete"
                    onClick={() => setDeleteConfirmId(div.id)}
                  >
                    <FiTrash2 size={16} style={{ color: "#e74c3c" }} />
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
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal">
            <div>Are you sure you want to delete this division?</div>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={() => handleDelete(deleteConfirmId)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Division;
