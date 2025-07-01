import React, { useState, useEffect } from "react";
import "./Branch.css";
import { FiMoreVertical, FiEdit, FiTrash2, FiEye } from "react-icons/fi";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create' or 'edit'
  const [modalForm, setModalForm] = useState({ code: "", name: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [overviewCategory, setOverviewCategory] = useState(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/categories/${id}/toggle-status`,
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
      const updatedCategory = await response.json();
      setCategories((prev) =>
        prev.map((category) =>
          category.id === id ? updatedCategory : category
        )
      );
    } catch (err) {
      setError(err.message);
      console.error("Error toggling status:", err);
    }
  };

  const openCreate = () => {
    setModalType("create");
    setModalForm({ code: "", name: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (id) => {
    const category = categories.find((c) => c.id === id);
    setModalType("edit");
    setModalForm({
      code: category ? category.code : "",
      name: category ? category.name : "",
    });
    setEditingId(id);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setModalForm({ ...modalForm, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalForm.name.trim()) return;

    try {
      setLoading(true);
      if (modalType === "edit" && editingId) {
        const response = await fetch(
          `http://localhost:5000/api/categories/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: modalForm.name }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to update category");
        }
        const updatedCategory = await response.json();
        setCategories((prev) =>
          prev.map((c) => (c.id === editingId ? updatedCategory : c))
        );
      } else {
        const response = await fetch("http://localhost:5000/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: modalForm.name,
            code: (Math.floor(Math.random() * 90000000) + 10000000).toString(),
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to create category");
        }
        const newCategory = await response.json();
        setCategories([newCategory, ...categories]);
      }
      setShowModal(false);
      setModalForm({ code: "", name: "" });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
      console.error("Error saving category:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalForm({ code: "", name: "" });
    setEditingId(null);
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filteredCategories.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredCategories.slice(startIdx, endIdx);

  // DELETE category
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/categories/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeleteConfirmId(null);
      if (overviewCategory && overviewCategory.id === id)
        setOverviewCategory(null);
    } catch (err) {
      setError(err.message);
      console.error("Error deleting category:", err);
    } finally {
      setLoading(false);
    }
  };

  // Overview
  const handleOverview = (category) => {
    setOverviewCategory(category);
  };

  if (overviewCategory) {
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
            Category Overview
          </h3>
          <div style={{ marginBottom: 16 }}>
            <strong>Category Name:</strong> {overviewCategory.name}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Category Code:</strong> {overviewCategory.code}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Status:</strong>{" "}
            {overviewCategory.status ? "Active" : "Inactive"}
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
            <button
              className="cancel-btn"
              onClick={() => setOverviewCategory(null)}
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
          Loading categories...
        </div>
      ) : (
        <table className="branch-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className="branch-name">{c.name}</div>
                  <div className="branch-code">{c.code}</div>
                </td>
                <td>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={c.status}
                      onChange={() => toggleStatus(c.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="edit-btn" onClick={() => openEdit(c.id)}>
                    <FiEdit size={16} />
                  </button>
                  <button
                    className="edit-btn"
                    title="Overview"
                    onClick={() => handleOverview(c)}
                  >
                    <FiEye size={16} />
                  </button>
                  <button
                    className="edit-btn"
                    title="Delete"
                    onClick={() => setDeleteConfirmId(c.id)}
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
              {modalType === "edit" ? "Edit Category" : "Add Category"}
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
                    Category Code
                  </label>
                  <input
                    className="branch-input readonly"
                    value={modalForm.code}
                    name="code"
                    readOnly
                  />
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#888",
                    fontSize: 15,
                  }}
                >
                  Category Name
                </label>
                <input
                  className="branch-input"
                  value={modalForm.name}
                  name="name"
                  onChange={handleModalChange}
                  placeholder="Category Name"
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
            <div>Are you sure you want to delete this category?</div>
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

export default Category;
