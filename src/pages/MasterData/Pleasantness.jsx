import React, { useState } from "react";
import "./Branch.css";
import { FiMoreVertical } from "react-icons/fi";

const PLEASANTNESS_VALUES = [1, 2, 3, 4, 5];

const initialPleasantness = [
  { id: 1, value: 5, status: false },
  { id: 2, value: 5, status: true },
  { id: 3, value: 5, status: false },
  { id: 4, value: 5, status: false },
  { id: 5, value: 5, status: true },
  { id: 6, value: 5, status: false },
  { id: 7, value: 5, status: true },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Pleasantness = () => {
  const [pleasantness, setPleasantness] = useState(initialPleasantness);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create' or 'edit'
  const [modalForm, setModalForm] = useState({ value: "" });
  const [editingId, setEditingId] = useState(null);

  const toggleStatus = (id) => {
    setPleasantness((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: !p.status } : p))
    );
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

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.value) return;
    if (modalType === "edit" && editingId) {
      setPleasantness((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, value: Number(modalForm.value) } : p
        )
      );
    } else {
      setPleasantness((prev) => [
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

  const filteredPleasantness = pleasantness.filter((p) =>
    p.value.toString().includes(searchTerm)
  );
  const total = filteredPleasantness.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredPleasantness.slice(startIdx, endIdx);

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
            <th>Pleasantness Value</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="branch-name">Example Value {p.value}</div>
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
              <td>
                <button className="edit-btn" onClick={() => openEdit(p.id)}>
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
              Add Pleasantness Value
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
                >
                  <option value="">Pleasantness Value</option>
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

export default Pleasantness;
