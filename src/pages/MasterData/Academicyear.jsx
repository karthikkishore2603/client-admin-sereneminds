import React, { useState, useEffect } from "react";
import "./Branch.css";
import { FiEdit } from "react-icons/fi";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Academicyear = () => {
  const [years, setYears] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalValue, setModalValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch academic years from API
  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/academicyears");
      if (!response.ok) {
        throw new Error("Failed to fetch academic years");
      }
      const data = await response.json();
      setYears(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching academic years:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load academic years on component mount
  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/academicyears/${id}/toggle-status`,
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
      const updatedYear = await response.json();
      setYears((prev) => prev.map((y) => (y.id === id ? updatedYear : y)));
    } catch (err) {
      setError(err.message);
      console.error("Error toggling status:", err);
    }
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

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (modalValue.trim() === "") return;

    try {
      setLoading(true);
      if (editingId) {
        // Update existing academic year
        const response = await fetch(
          `http://localhost:5000/api/academicyears/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ year: modalValue }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update academic year");
        }
        const updatedYear = await response.json();
        setYears((prev) =>
          prev.map((y) => (y.id === editingId ? updatedYear : y))
        );
      } else {
        // Create new academic year
        const response = await fetch(
          "http://localhost:5000/api/academicyears",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ year: modalValue }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to create academic year");
        }
        const newYear = await response.json();
        setYears([newYear, ...years]);
      }
      setShowModal(false);
      setModalValue("");
      setEditingId(null);
    } catch (err) {
      setError(err.message);
      console.error("Error saving academic year:", err);
    } finally {
      setLoading(false);
    }
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
      {error && (
        <div style={{ color: "red", textAlign: "center", marginBottom: 16 }}>
          {error}
        </div>
      )}
      {loading && !showModal ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading academic years...
        </div>
      ) : (
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
                  required
                />
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
                  {loading ? "Saving..." : "Submit"}
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
