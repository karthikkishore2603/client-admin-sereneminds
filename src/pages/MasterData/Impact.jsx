import React, { useState } from "react";
import "./Branch.css";
import { FiMoreVertical } from "react-icons/fi";

const IMPACT_VALUES = [1, 2, 3, 4, 5];

const initialImpacts = [
  { id: 1, value: 5, status: false },
  { id: 2, value: 5, status: true },
  { id: 3, value: 5, status: false },
  { id: 4, value: 5, status: false },
  { id: 5, value: 5, status: true },
  { id: 6, value: 5, status: false },
  { id: 7, value: 5, status: true },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Impact = () => {
  const [impacts, setImpacts] = useState(initialImpacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create' or 'edit'
  const [modalForm, setModalForm] = useState({ value: "" });
  const [editingId, setEditingId] = useState(null);

  const toggleStatus = (id) => {
    setImpacts((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: !i.status } : i))
    );
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

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.value) return;
    if (modalType === "edit" && editingId) {
      setImpacts((prev) =>
        prev.map((i) =>
          i.id === editingId ? { ...i, value: Number(modalForm.value) } : i
        )
      );
    } else {
      setImpacts((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          value: Number(modalForm.value),
          status: false,
        },
      ]);
    }
    setShowModal(false);
    setModalForm({ value: "" });
    setEditingId(null);
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
                <div className="branch-name">Example Value {i.value}</div>
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
              Add Impact Value
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
                >
                  <option value="">Impact Value</option>
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
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {modalType === "edit" ? "Update" : "Submit"}
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
