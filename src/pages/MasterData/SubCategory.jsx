import React, { useState, useEffect } from "react";
import "./Branch.css";
import { FiMoreVertical, FiEdit, FiTrash2, FiEye } from "react-icons/fi";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create' or 'edit'
  const [modalForm, setModalForm] = useState({
    code: "",
    name: "",
    categoryId: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [overviewSubCategory, setOverviewSubCategory] = useState(null);

  // Fetch categories and subcategories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/subcategories");
      if (!response.ok) throw new Error("Failed to fetch subcategories");
      const data = await response.json();
      setSubCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/subcategories/${id}/toggle-status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to toggle status");
      const updated = await response.json();
      setSubCategories((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      setError(err.message);
    }
  };

  const openCreate = () => {
    setModalType("create");
    setModalForm({ code: "", name: "", categoryId: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (id) => {
    const sub = subCategories.find((s) => s.id === id);
    setModalType("edit");
    setModalForm({
      code: sub ? sub.code : "",
      name: sub ? sub.name : "",
      categoryId: sub ? sub.categoryId : "",
    });
    setEditingId(id);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setModalForm({ ...modalForm, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalForm.name.trim() || !modalForm.categoryId) return;
    try {
      setLoading(true);
      if (modalType === "edit" && editingId) {
        const response = await fetch(
          `http://localhost:5000/api/subcategories/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: modalForm.name,
              categoryId: Number(modalForm.categoryId),
            }),
          }
        );
        if (!response.ok) throw new Error("Failed to update subcategory");
        const updated = await response.json();
        setSubCategories((prev) =>
          prev.map((s) => (s.id === editingId ? updated : s))
        );
      } else {
        const response = await fetch(
          "http://localhost:5000/api/subcategories",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: modalForm.name,
              code: (
                Math.floor(Math.random() * 90000000) + 10000000
              ).toString(),
              categoryId: Number(modalForm.categoryId),
            }),
          }
        );
        if (!response.ok) throw new Error("Failed to create subcategory");
        const created = await response.json();
        setSubCategories([created, ...subCategories]);
      }
      setShowModal(false);
      setModalForm({ code: "", name: "", categoryId: "" });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setModalForm({ code: "", name: "", categoryId: "" });
    setEditingId(null);
  };

  const filteredSubCategories = subCategories.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filteredSubCategories.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredSubCategories.slice(startIdx, endIdx);

  // DELETE subcategory
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/subcategories/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete subcategory");
      }
      setSubCategories((prev) => prev.filter((s) => s.id !== id));
      setDeleteConfirmId(null);
      if (overviewSubCategory && overviewSubCategory.id === id)
        setOverviewSubCategory(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Overview
  const handleOverview = (sub) => {
    setOverviewSubCategory(sub);
  };

  if (overviewSubCategory) {
    const category = categories.find(
      (c) => c.id === overviewSubCategory.categoryId
    );
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
            Sub Category Overview
          </h3>
          <div style={{ marginBottom: 16 }}>
            <strong>Sub Category Name:</strong> {overviewSubCategory.name}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Sub Category Code:</strong> {overviewSubCategory.code}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Category:</strong> {category ? category.name : ""}
          </div>
          <div style={{ marginBottom: 16 }}>
            <strong>Status:</strong>{" "}
            {overviewSubCategory.status ? "Active" : "Inactive"}
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
            <button
              className="cancel-btn"
              onClick={() => setOverviewSubCategory(null)}
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
          Loading subcategories...
        </div>
      ) : (
        <table className="branch-table">
          <thead>
            <tr>
              <th>Sub Category Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((s) => {
              const category = categories.find((c) => c.id === s.categoryId);
              return (
                <tr key={s.id}>
                  <td>
                    <div className="branch-name">{s.name}</div>
                    <div className="branch-code">{s.code}</div>
                  </td>
                  <td>
                    <div className="branch-name">
                      {category ? category.name : ""}
                    </div>
                    <div className="branch-code">
                      {category ? category.code : ""}
                    </div>
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={s.status}
                        onChange={() => toggleStatus(s.id)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="edit-btn" onClick={() => openEdit(s.id)}>
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="edit-btn"
                      title="Overview"
                      onClick={() => handleOverview(s)}
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      className="edit-btn"
                      title="Delete"
                      onClick={() => setDeleteConfirmId(s.id)}
                    >
                      <FiTrash2 size={16} style={{ color: "#e74c3c" }} />
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
              {modalType === "edit" ? "Edit Sub Category" : "Add Sub Category"}
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
                    Sub Category Code
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
                  Sub Category Name
                </label>
                <input
                  className="branch-input"
                  value={modalForm.name}
                  name="name"
                  onChange={handleModalChange}
                  placeholder="Sub Category Name"
                  autoFocus
                  required
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
                  Category Name
                </label>
                <select
                  className="branch-input"
                  value={modalForm.categoryId}
                  name="categoryId"
                  onChange={handleModalChange}
                  required
                >
                  <option value="">Category Name</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
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
            <div>Are you sure you want to delete this subcategory?</div>
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

export default SubCategory;
