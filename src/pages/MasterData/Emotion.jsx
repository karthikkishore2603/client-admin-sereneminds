import React, { useState } from "react";
import "./Branch.css";
import { FiMoreVertical, FiEdit } from "react-icons/fi";

const initialEmotions = [
  {
    id: 1,
    name: "Example Emotion",
    code: "57893145",
    score: 75,
    status: false,
  },
  {
    id: 2,
    name: "Example Emotion",
    code: "57893145",
    score: 75,
    status: false,
  },
  {
    id: 3,
    name: "Example Emotion",
    code: "57893145",
    score: 75,
    status: false,
  },
  {
    id: 4,
    name: "Example Emotion",
    code: "57893145",
    score: 75,
    status: false,
  },
  {
    id: 5,
    name: "Example Emotion",
    code: "57893145",
    score: 75,
    status: false,
  },
  {
    id: 6,
    name: "Example Emotion",
    code: "57893145",
    score: 75,
    status: false,
  },
  {
    id: 7,
    name: "Example Emotion",
    code: "57893145",
    score: 75,
    status: false,
  },
];

const EMOTION_SCORES = [50, 60, 70, 75, 80, 90, 100];
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Emotion = () => {
  const [emotions, setEmotions] = useState(initialEmotions);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create' or 'edit'
  const [modalForm, setModalForm] = useState({ code: "", name: "", score: "" });
  const [editingId, setEditingId] = useState(null);

  const toggleStatus = (id) => {
    setEmotions((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: !e.status } : e))
    );
  };

  const openCreate = () => {
    setModalType("create");
    setModalForm({ code: "", name: "", score: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (id) => {
    const emotion = emotions.find((e) => e.id === id);
    setModalType("edit");
    setModalForm({
      code: emotion ? emotion.code : "",
      name: emotion ? emotion.name : "",
      score: emotion ? emotion.score : "",
    });
    setEditingId(id);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setModalForm({ ...modalForm, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.name.trim() || !modalForm.score) return;
    if (modalType === "edit" && editingId) {
      setEmotions((prev) =>
        prev.map((e) =>
          e.id === editingId
            ? { ...e, name: modalForm.name, score: Number(modalForm.score) }
            : e
        )
      );
    } else {
      setEmotions((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: modalForm.name,
          code: (Math.floor(Math.random() * 90000000) + 10000000).toString(),
          score: Number(modalForm.score),
          status: false,
        },
      ]);
    }
    setShowModal(false);
    setModalForm({ code: "", name: "", score: "" });
    setEditingId(null);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalForm({ code: "", name: "", score: "" });
    setEditingId(null);
  };

  const filteredEmotions = emotions.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filteredEmotions.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredEmotions.slice(startIdx, endIdx);

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
            <th>Emotion Name</th>
            <th>Emotion Score</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((e) => (
            <tr key={e.id}>
              <td>
                <div className="branch-name">{e.name}</div>
                <div className="branch-code">{e.code}</div>
              </td>
              <td style={{ fontWeight: 600, fontSize: 15 }}>{e.score}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={e.status}
                    onChange={() => toggleStatus(e.id)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td>
                <button className="edit-btn" onClick={() => openEdit(e.id)}>
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
              {modalType === "edit" ? "Edit Emotion" : "Add New Emotion"}
            </h3>
            <form onSubmit={handleModalSubmit}>
              {modalType === "edit" && (
                <div style={{ marginBottom: 18 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 8,
                      color: "#888",
                      fontSize: 15,
                    }}
                  >
                    Emotion Code
                  </label>
                  <input
                    className="branch-input readonly"
                    value={modalForm.code}
                    name="code"
                    readOnly
                  />
                </div>
              )}
              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#888",
                    fontSize: 15,
                  }}
                >
                  Emotion Name
                </label>
                <input
                  className="branch-input"
                  value={modalForm.name}
                  name="name"
                  onChange={handleModalChange}
                  placeholder="Emotion Name"
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#888",
                    fontSize: 15,
                  }}
                >
                  Emotion Score
                </label>
                <select
                  className="branch-input"
                  value={modalForm.score}
                  name="score"
                  onChange={handleModalChange}
                >
                  <option value="">Select Emotion Score</option>
                  {EMOTION_SCORES.map((score) => (
                    <option key={score} value={score}>
                      {score}
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

export default Emotion;
