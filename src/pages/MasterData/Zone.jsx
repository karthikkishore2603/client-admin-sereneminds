import React, { useState } from "react";
import "./Branch.css";
import { FiMoreVertical } from "react-icons/fi";

const EMOTIONS = [
  { id: 1, name: "Example Emotion", code: "57893145" },
  { id: 2, name: "Happy", code: "12345678" },
  { id: 3, name: "Sad", code: "87654321" },
];

const initialZones = [
  {
    id: 1,
    name: "Example Zone",
    code: "57893145",
    emotionId: 1,
    description: "Zone Description",
    status: false,
  },
  {
    id: 2,
    name: "Example Zone",
    code: "57893145",
    emotionId: 1,
    description: "Zone Description",
    status: false,
  },
  {
    id: 3,
    name: "Example Zone",
    code: "57893145",
    emotionId: 1,
    description: "Zone Description",
    status: false,
  },
  {
    id: 4,
    name: "Example Zone",
    code: "57893145",
    emotionId: 1,
    description: "Zone Description",
    status: false,
  },
  {
    id: 5,
    name: "Example Zone",
    code: "57893145",
    emotionId: 1,
    description: "Zone Description",
    status: false,
  },
  {
    id: 6,
    name: "Example Zone",
    code: "57893145",
    emotionId: 1,
    description: "Zone Description",
    status: false,
  },
  {
    id: 7,
    name: "Example Zone",
    code: "57893145",
    emotionId: 1,
    description: "Zone Description",
    status: false,
  },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Zone = () => {
  const [zones, setZones] = useState(initialZones);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create' or 'edit'
  const [modalForm, setModalForm] = useState({
    code: "",
    name: "",
    description: "",
    emotionId: "",
  });
  const [editingId, setEditingId] = useState(null);

  const toggleStatus = (id) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, status: !z.status } : z))
    );
  };

  const openCreate = () => {
    setModalType("create");
    setModalForm({ code: "", name: "", description: "", emotionId: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (id) => {
    const zone = zones.find((z) => z.id === id);
    setModalType("edit");
    setModalForm({
      code: zone ? zone.code : "",
      name: zone ? zone.name : "",
      description: zone ? zone.description : "",
      emotionId: zone ? zone.emotionId : "",
    });
    setEditingId(id);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setModalForm({ ...modalForm, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.name.trim() || !modalForm.emotionId) return;
    if (modalType === "edit" && editingId) {
      setZones((prev) =>
        prev.map((z) =>
          z.id === editingId
            ? {
                ...z,
                name: modalForm.name,
                description: modalForm.description,
                emotionId: Number(modalForm.emotionId),
              }
            : z
        )
      );
    } else {
      setZones((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: modalForm.name,
          code: (Math.floor(Math.random() * 90000000) + 10000000).toString(),
          description: modalForm.description,
          emotionId: Number(modalForm.emotionId),
          status: false,
        },
      ]);
    }
    setShowModal(false);
    setModalForm({ code: "", name: "", description: "", emotionId: "" });
    setEditingId(null);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalForm({ code: "", name: "", description: "", emotionId: "" });
    setEditingId(null);
  };

  const filteredZones = zones.filter((z) =>
    z.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filteredZones.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredZones.slice(startIdx, endIdx);

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
            <th>Zone Name</th>
            <th>Emotion</th>
            <th>Zone Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((z) => {
            const emotion = EMOTIONS.find((e) => e.id === z.emotionId);
            return (
              <tr key={z.id}>
                <td>
                  <div className="branch-name">{z.name}</div>
                  <div className="branch-code">{z.code}</div>
                </td>
                <td>
                  <div className="branch-name">
                    {emotion ? emotion.name : ""}
                  </div>
                  <div className="branch-code">
                    {emotion ? emotion.code : ""}
                  </div>
                </td>
                <td style={{ fontWeight: 500, fontSize: 15 }}>
                  {z.description}
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={z.status}
                      onChange={() => toggleStatus(z.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => openEdit(z.id)}>
                    <FiMoreVertical size={20} />
                  </button>
                </td>
              </tr>
            );
          })}
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
              {modalType === "edit" ? "Edit Zone" : "Add New Emotion"}
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
                    Zone Code
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
                  Zone Name
                </label>
                <input
                  className="branch-input"
                  value={modalForm.name}
                  name="name"
                  onChange={handleModalChange}
                  placeholder="Zone Name"
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#888",
                    fontSize: 15,
                  }}
                >
                  Zone Description
                </label>
                <input
                  className="branch-input"
                  value={modalForm.description}
                  name="description"
                  onChange={handleModalChange}
                  placeholder="Zone Description"
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
                  Emotion Name
                </label>
                <select
                  className="branch-input"
                  value={modalForm.emotionId}
                  name="emotionId"
                  onChange={handleModalChange}
                >
                  <option value="">Emotion Name</option>
                  {EMOTIONS.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}
              >
                {modalType === "edit" && (
                  <button
                    type="button"
                    className="cancel-btn"
                    style={{
                      background: "#f5f5f5",
                      color: "#aaa",
                      cursor: "not-allowed",
                    }}
                    disabled
                  >
                    Description
                  </button>
                )}
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

export default Zone;
