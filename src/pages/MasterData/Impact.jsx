import React, { useState, useEffect } from "react";
import "./Branch.css";
import { FiMoreVertical } from "react-icons/fi";

const IMPACT_VALUES = [1, 2, 3, 4, 5];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Impact = () => {
  const [impacts, setImpacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create' or 'edit'
  const [modalForm, setModalForm] = useState({ value: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch impacts from API
  const fetchImpacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/impacts");
      if (!response.ok) {
        throw new Error("Failed to fetch impacts");
      }
      const data = await response.json();
      setImpacts(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching impacts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load impacts on component mount
  useEffect(() => {
    fetchImpacts();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/impacts/${id}/toggle-status`,
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
      const updatedImpact = await response.json();
      setImpacts((prev) =>
        prev.map((impact) => (impact.id === id ? updatedImpact : impact))
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
    const impact = impacts.find((i) => i.id === id);
    setModalType("edit");
    setModalForm({ value: impact ? impact.value : "" });
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
          `http://localhost:5000/api/impacts/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ value: Number(modalForm.value) }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update impact");
        }
        const updatedImpact = await response.json();
        setImpacts((prev) =>
          prev.map((i) => (i.id === editingId ? updatedImpact : i))
        );
      } else {
        const response = await fetch("http://localhost:5000/api/impacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: Number(modalForm.value),
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to create impact");
        }
        const newImpact = await response.json();
        setImpacts([newImpact, ...impacts]);
      }
      setShowModal(false);
      setModalForm({ value: "" });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
      console.error("Error saving impact:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalForm({ value: "" });
    setEditingId(null);
  };

  const filteredImpacts = impacts.filter((i) =>
    i.value.toString().includes(searchTerm)
  );
  const total = filteredImpacts.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredImpacts.slice(startIdx, endIdx);

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
          Loading impacts...
        </div>
      ) : (
        <table className="branch-table">
          <thead>
            <tr>
              <th>Impact Value</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((i) => (
              <tr key={i.id}>
                <td>
                  <div className="branch-name">Impact Value {i.value}</div>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={i.status}
                      onChange={() => toggleStatus(i.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => openEdit(i.id)}>
                    <FiMoreVertical size={20} />
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
              {modalType === "edit" ? "Edit Impact Value" : "Add Impact Value"}
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
                  Impact Value
                </label>
                <select
                  className="branch-input"
                  value={modalForm.value}
                  name="value"
                  onChange={handleModalChange}
                  autoFocus
                  required
                >
                  <option value="">Select Impact Value</option>
                  {IMPACT_VALUES.map((v) => (
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
    </div>
  );
};

export default Impact;
