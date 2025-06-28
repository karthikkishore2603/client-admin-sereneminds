import React, { useState, useEffect } from "react";
import "./Branch.css";
import { FiMoreVertical } from "react-icons/fi";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Zone = () => {
  const [zones, setZones] = useState([]);
  const [emotions, setEmotions] = useState([]);
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch zones from API
  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/zones");
      if (!response.ok) {
        throw new Error("Failed to fetch zones");
      }
      const data = await response.json();
      setZones(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching zones:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch emotions from API
  const fetchEmotions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/emotions");
      if (!response.ok) {
        throw new Error("Failed to fetch emotions");
      }
      const data = await response.json();
      setEmotions(data);
    } catch (err) {
      console.error("Error fetching emotions:", err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchZones();
    fetchEmotions();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/zones/${id}/toggle-status`,
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
      const updatedZone = await response.json();
      setZones((prev) =>
        prev.map((zone) => (zone.id === id ? updatedZone : zone))
      );
    } catch (err) {
      setError(err.message);
      console.error("Error toggling status:", err);
    }
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

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalForm.name.trim() || !modalForm.emotionId) return;

    try {
      setLoading(true);
      const url =
        modalType === "edit"
          ? `http://localhost:5000/api/zones/${editingId}`
          : "http://localhost:5000/api/zones";

      const method = modalType === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: modalForm.name,
          description: modalForm.description,
          emotionId: Number(modalForm.emotionId),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${modalType} zone`);
      }

      const result = await response.json();

      if (modalType === "edit") {
        setZones((prev) => prev.map((z) => (z.id === editingId ? result : z)));
      } else {
        setZones([result, ...zones]);
      }

      setShowModal(false);
      setModalForm({ code: "", name: "", description: "", emotionId: "" });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
      console.error(`Error ${modalType}ing zone:`, err);
    } finally {
      setLoading(false);
    }
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
      {error && (
        <div style={{ color: "red", textAlign: "center", marginBottom: 16 }}>
          {error}
        </div>
      )}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading zones...
        </div>
      ) : (
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
              const emotion = z.emotion; // Emotion data comes from API
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
              {modalType === "edit" ? "Edit Zone" : "Add New Zone"}
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
                  {emotions.map((e) => (
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
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading
                    ? "Processing..."
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

export default Zone;
