import React, { useState, useEffect } from "react";
import { FiEdit, FiFilter, FiDownload, FiMaximize2 } from "react-icons/fi";
import "./Branch.css";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Division = () => {
  const [divisions, setDivisions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    class: "",
    school: "",
  });

  // Fetch divisions from API
  const fetchDivisions = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/divisions");
      if (!response.ok) {
        throw new Error("Failed to fetch divisions");
      }
      const data = await response.json();
      setDivisions(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching divisions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load divisions on component mount
  useEffect(() => {
    fetchDivisions();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/divisions/${id}/toggle-status`,
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
      const updatedDivision = await response.json();
      setDivisions((prev) =>
        prev.map((div) => (div.id === id ? updatedDivision : div))
      );
    } catch (err) {
      setError(err.message);
      console.error("Error toggling status:", err);
    }
  };

  const filteredDivisions = divisions.filter((div) =>
    div.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const total = filteredDivisions.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredDivisions.slice(startIdx, endIdx);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/divisions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          code: Math.floor(Math.random() * 100000000).toString(),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create division");
      }
      const newDivision = await response.json();
      setDivisions([newDivision, ...divisions]);
      setForm({ name: "", class: "", school: "" });
      setShowCreate(false);
    } catch (err) {
      setError(err.message);
      console.error("Error creating division:", err);
    } finally {
      setLoading(false);
    }
  };

  if (showCreate) {
    return (
      <div className="branch-form-container">
        <div className="breadcrumb">
          <span
            onClick={() => setShowCreate(false)}
            style={{ cursor: "pointer" }}
          >
            Division
          </span>{" "}
          &gt; <span>Create</span>
        </div>
        <div className="branch-form-card">
          <div className="branch-form-title">Division</div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Division Name"
              value={form.name}
              onChange={handleChange}
              className="branch-input"
              required
            />
            <input
              type="text"
              name="class"
              placeholder="Class Name"
              value={form.class}
              onChange={handleChange}
              className="branch-input"
              required
            />
            <input
              type="text"
              name="school"
              placeholder="School Name"
              value={form.school}
              onChange={handleChange}
              className="branch-input"
              required
            />
            {error && (
              <div
                style={{ color: "red", textAlign: "center", marginBottom: 16 }}
              >
                {error}
              </div>
            )}
            <div className="branch-form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating..." : "Submit"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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
          <button className="create-btn" onClick={() => setShowCreate(true)}>
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

export default Division;
