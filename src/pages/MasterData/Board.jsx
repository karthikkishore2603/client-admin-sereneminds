import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiFilter,
  FiDownload,
  FiMaximize2,
  FiChevronRight,
  FiTrash2,
  FiEye,
} from "react-icons/fi";
import "./Branch.css";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const defaultForm = {
  name: "",
  email: "",
  type: "",
};

const tabs = [{ label: "Overview" }, { label: "History" }];

const Board = () => {
  const [boards, setBoards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState("list"); // list | create | edit | overview
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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

  // When selectedId changes, update selectedBoard
  useEffect(() => {
    if (selectedId) {
      const board = boards.find((b) => b.id === selectedId);
      setSelectedBoard(board || null);
      if (mode === "edit" && board) {
        setForm({
          name: board.name || "",
          email: board.email || "",
          type: board.type || "",
          code: board.code || "",
        });
      }
    } else {
      setSelectedBoard(null);
    }
  }, [selectedId, boards, mode]);

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

  // CREATE
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
      setMode("list");
    } catch (err) {
      setError(err.message);
      console.error("Error creating board:", err);
    } finally {
      setLoading(false);
    }
  };

  // EDIT
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/boards/${selectedId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update board");
      }
      const updatedBoard = await response.json();
      setBoards((prev) =>
        prev.map((board) => (board.id === selectedId ? updatedBoard : board))
      );
      setForm(defaultForm);
      setMode("list");
      setSelectedId(null);
    } catch (err) {
      setError(err.message);
      console.error("Error updating board:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(defaultForm);
    setMode("list");
    setSelectedId(null);
    setError("");
  };

  const filteredBoards = boards.filter(
    (board) =>
      board.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      board.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const total = filteredBoards.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredBoards.slice(startIdx, endIdx);

  // DELETE
  const handleDelete = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5000/api/boards/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete board");
      setBoards((prev) => prev.filter((board) => board.id !== id));
      setDeleteConfirmId(null);
      if (selectedBoard && selectedBoard.id === id) {
        setMode("list");
        setSelectedId(null);
        setSelectedBoard(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- UI RENDERING ---

  // CREATE MODE
  if (mode === "create") {
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

  // EDIT MODE
  if (mode === "edit" && selectedBoard) {
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
            <span style={{ color: "#888" }}>&gt;</span> Edit
          </span>
        </div>
        {/* Form */}
        <form onSubmit={handleEditSubmit}>
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
                  <input
                    className="search-input"
                    style={{ width: "100%" }}
                    placeholder="Board Code"
                    value={form.code || ""}
                    readOnly
                  />
                </div>
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
              {loading ? "Updating..." : "Update"}
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

  // OVERVIEW MODE
  if (mode === "overview" && selectedBoard) {
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
            <span style={{ fontSize: 16 }}>🏠</span> Board{" "}
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
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 20,
                color: "#222",
                marginBottom: 6,
              }}
            >
              {selectedBoard.name}
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
            onClick={() => setMode("edit")}
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
                Board Name{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {selectedBoard.name}
                </span>
              </div>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Board Type{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {selectedBoard.type}
                </span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Board Code{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {selectedBoard.code}
                </span>
              </div>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Email ID{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {selectedBoard.email}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <button
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
            Back
          </button>
        </div>
      </div>
    );
  }

  // LIST MODE
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
          <button className="create-btn" onClick={() => setMode("create")}>
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
                <td style={{ display: "flex", gap: 8 }}>
                  <button
                    className="edit-btn"
                    title="Overview"
                    onClick={() => {
                      setSelectedId(board.id);
                      setMode("overview");
                    }}
                  >
                    <FiEye size={16} />
                  </button>
                  <button
                    className="edit-btn"
                    title="Edit"
                    onClick={() => {
                      setSelectedId(board.id);
                      setMode("edit");
                    }}
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    className="edit-btn"
                    title="Delete"
                    onClick={() => setDeleteConfirmId(board.id)}
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
            <div>Are you sure you want to delete this board?</div>
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

export default Board;
