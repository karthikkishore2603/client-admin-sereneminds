import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiFilter, FiDownload, FiMaximize2 } from "react-icons/fi";
import "./Branch.css";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const defaultForm = {
  name: "",
  email: "",
  type: "",
};

const Board = () => {
  const [boards, setBoards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch boards from API
  const fetchBoards = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/boards");
      if (!response.ok) {
        throw new Error("Failed to fetch boards");
      }
      const data = await response.json();
      setBoards(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching boards:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load boards on component mount
  useEffect(() => {
    fetchBoards();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/boards/${id}/toggle-status`,
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
      const updatedBoard = await response.json();
      setBoards((prev) =>
        prev.map((board) => (board.id === id ? updatedBoard : board))
      );
    } catch (err) {
      setError(err.message);
      console.error("Error toggling status:", err);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error("Failed to create board");
      }
      const newBoard = await response.json();
      setBoards([newBoard, ...boards]);
      setForm(defaultForm);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
      console.error("Error creating board:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(defaultForm);
    setShowForm(false);
  };

  const filteredBoards = boards.filter(
    (board) =>
      board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const total = filteredBoards.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredBoards.slice(startIdx, endIdx);

  if (showForm) {
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
            <span style={{ fontSize: 16 }}>🏠</span> Board{" "}
            <span style={{ color: "#888" }}>&gt;</span> Create
          </span>
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
              Board
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ marginBottom: 12 }}>
                  <input
                    className="search-input"
                    style={{ width: "100%" }}
                    placeholder="Board Name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <input
                    className="search-input"
                    style={{ width: "100%" }}
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ marginBottom: 12 }}>
                  <select
                    className="dropdown"
                    style={{ width: "100%" }}
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    required
                  >
                    <option value="">Select Board Type</option>
                    <option value="National">National</option>
                    <option value="CBSC">CBSC</option>
                    <option value="State">State</option>
                  </select>
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
              onClick={handleCancel}
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
          <button className="create-btn" onClick={() => setShowForm(true)}>
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
          Loading boards...
        </div>
      ) : (
        <table className="branch-table">
          <thead>
            <tr>
              <th>Board Name</th>
              <th>Board Type</th>
              <th>Email ID</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((board) => (
              <tr key={board.id}>
                <td>
                  <div className="branch-name">{board.name}</div>
                  <div className="branch-code">{board.code}</div>
                </td>
                <td>
                  <div className="branch-name">{board.type}</div>
                </td>
                <td>
                  <div className="branch-name">{board.email}</div>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={board.status}
                      onChange={() => toggleStatus(board.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/board/overview/${board.id}`)}
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

export default Board;
