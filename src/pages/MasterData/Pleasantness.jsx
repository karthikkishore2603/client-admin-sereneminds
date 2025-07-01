import React, { useState, useEffect } from "react";
import "./Branch.css";
import { FiMoreVertical, FiEdit, FiTrash2, FiEye } from "react-icons/fi";

const PLEASANTNESS_VALUES = [1, 2, 3, 4, 5];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Pleasantness = () => {
  const [pleasantness, setPleasantness] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create' or 'edit'
  const [modalForm, setModalForm] = useState({ value: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [overviewPleasantness, setOverviewPleasantness] = useState(null);

  // Fetch pleasantness from API
  const fetchPleasantness = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/pleasantnesses");
      if (!response.ok) {
        throw new Error("Failed to fetch pleasantness data");
      }
      const data = await response.json();
      setPleasantness(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching pleasantness:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load pleasantness on component mount
  useEffect(() => {
    fetchPleasantness();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/pleasantnesses/${id}/toggle-status`,
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
      const updatedPleasantness = await response.json();
      setPleasantness((prev) =>
        prev.map((p) => (p.id === id ? updatedPleasantness : p))
      );
    } catch (err) {
      setError(err.message);
      console.error("Error toggling status:", err);
    }
  };

  const openCreate = () => {
    setModalType("create");
    setModalForm({ value: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (id) => {
    const item = pleasantness.find((p) => p.id === id);
    setModalType("edit");
    setModalForm({ value: item ? item.value : "" });
    setEditingId(id);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setModalForm({ ...modalForm, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalForm.value) return;

    try {
      setLoading(true);
      if (modalType === "edit" && editingId) {
        const response = await fetch(
          `http://localhost:5000/api/pleasantnesses/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ value: Number(modalForm.value) }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update pleasantness");
        }
        const updatedPleasantness = await response.json();
        setPleasantness((prev) =>
          prev.map((p) => (p.id === editingId ? updatedPleasantness : p))
        );
      } else {
        const response = await fetch(
          "http://localhost:5000/api/pleasantnesses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              value: Number(modalForm.value),
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to create pleasantness");
        }
        const newPleasantness = await response.json();
        setPleasantness([newPleasantness, ...pleasantness]);
      }
      setShowModal(false);
      setModalForm({ value: "" });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
      console.error("Error saving pleasantness:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalForm({ value: "" });
    setEditingId(null);
  };

  const filteredPleasantness = pleasantness.filter((p) =>
    p.value.toString().includes(searchTerm)
  );
  const total = filteredPleasantness.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredPleasantness.slice(startIdx, endIdx);

  // DELETE pleasantness
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/pleasantnesses/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete pleasantness");
      }
      setPleasantness((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
      if (overviewPleasantness && overviewPleasantness.id === id)
        setOverviewPleasantness(null);
    } catch (err) {
      setError(err.message);
      console.error("Error deleting pleasantness:", err);
    } finally {
      setLoading(false);
    }
  };

  // Overview
  const handleOverview = (p) => {
    setOverviewPleasantness(p);
  };

  if (overviewPleasantness) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3
            style={{
              marginBottom: 24,
              fontWeight: 600,
              fontSize: 20,
              color: "#222",
            }}
          >
            Pleasantness Overview
          </h3>
          <div style={{ marginBottom: 16 }}>
            <strong>Pleasantness Value:</strong> {overviewPleasantness.value}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Status:</strong>{" "}
            {overviewPleasantness.status ? "Active" : "Inactive"}
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
            <button
              className="cancel-btn"
              onClick={() => setOverviewPleasantness(null)}
            >
              Close
            </button>
          </div>
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
          <button className="create-btn" onClick={openCreate}>
            + Create
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
          Loading pleasantness data...
        </div>
      ) : (
        <table className="branch-table">
          <thead>
            <tr>
              <th>Pleasantness Value</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="branch-name">Value {p.value}</div>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={p.status}
                      onChange={() => toggleStatus(p.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="edit-btn" onClick={() => openEdit(p.id)}>
                    <FiEdit size={16} />
                  </button>
                  <button
                    className="edit-btn"
                    title="Overview"
                    onClick={() => handleOverview(p)}
                  >
                    <FiEye size={16} />
                  </button>
                  <button
                    className="edit-btn"
                    title="Delete"
                    onClick={() => setDeleteConfirmId(p.id)}
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
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3
              style={{
                marginBottom: 24,
                fontWeight: 600,
                fontSize: 20,
                color: "#222",
              }}
            >
              {modalType === "edit" ? "Edit Pleasantness" : "Add Pleasantness"}
            </h3>
            <form onSubmit={handleModalSubmit}>
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#888",
                    fontSize: 15,
                  }}
                >
                  Pleasantness Value
                </label>
                <select
                  className="branch-input"
                  value={modalForm.value}
                  name="value"
                  onChange={handleModalChange}
                  autoFocus
                  required
                >
                  <option value="">Select Pleasantness Value</option>
                  {PLEASANTNESS_VALUES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}
              >
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleModalCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : modalType === "edit"
                    ? "Update"
                    : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal">
            <div>Are you sure you want to delete this pleasantness?</div>
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

export default Pleasantness;
