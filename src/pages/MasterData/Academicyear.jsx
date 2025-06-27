import React, { useState } from "react";
import "./Branch.css";
import { FiEdit } from "react-icons/fi";

const initialYears = [
  { id: 1, year: "June - April", status: false },
  { id: 2, year: "June - April", status: true },
  { id: 3, year: "June - April", status: true },
  { id: 4, year: "June - April", status: true },
  { id: 5, year: "June - April", status: false },
  { id: 6, year: "June - April", status: false },
  { id: 7, year: "June - April", status: true },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Academicyear = () => {
  const [years, setYears] = useState(initialYears);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalValue, setModalValue] = useState("");
  const [editingId, setEditingId] = useState(null);

  const toggleStatus = (id) => {
    setYears((prev) =>
      prev.map((y) => (y.id === id ? { ...y, status: !y.status } : y))
    );
  };

  const openCreate = () => {
    setEditingId(null);
    setModalValue("");
    setShowModal(true);
  };

  const openEdit = (id) => {
    const year = years.find((y) => y.id === id);
    setEditingId(id);
    setModalValue(year ? year.year : "");
    setShowModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (modalValue.trim() === "") return;
    if (editingId) {
      setYears((prev) =>
        prev.map((y) => (y.id === editingId ? { ...y, year: modalValue } : y))
      );
    } else {
      setYears((prev) => [
        ...prev,
        { id: prev.length + 1, year: modalValue, status: false },
      ]);
    }
    setShowModal(false);
    setModalValue("");
    setEditingId(null);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalValue("");
    setEditingId(null);
  };

  const filteredYears = years.filter((y) =>
    y.year.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filteredYears.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredYears.slice(startIdx, endIdx);

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
            <th>Academic Year</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((y) => (
            <tr key={y.id}>
              <td>
                <div className="branch-name">{y.year}</div>
              </td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={y.status}
                    onChange={() => toggleStatus(y.id)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td>
                <button className="edit-btn" onClick={() => openEdit(y.id)}>
                  <FiEdit size={16} />
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
              {editingId ? "Edit Academic Year" : "Add New Academic Year"}
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
                  Academic Year
                </label>
                <input
                  className="branch-input"
                  value={modalValue}
                  onChange={(e) => setModalValue(e.target.value)}
                  placeholder="e.g. June - April"
                  autoFocus
                />
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Academicyear;
