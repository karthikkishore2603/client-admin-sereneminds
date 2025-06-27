import React, { useState } from "react";
import "./Branch.css";
import { FiMoreVertical } from "react-icons/fi";

const initialCategories = [
  { id: 1, name: "Example Category", code: "57893145", status: true },
  { id: 2, name: "Example Category", code: "57893145", status: true },
  { id: 3, name: "Example Category", code: "57893145", status: true },
  { id: 4, name: "Example Category", code: "57893145", status: true },
  { id: 5, name: "Example Category", code: "57893145", status: true },
  { id: 6, name: "Example Category", code: "57893145", status: true },
  { id: 7, name: "Example Category", code: "57893145", status: true },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Category = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create' or 'edit'
  const [modalForm, setModalForm] = useState({ code: "", name: "" });
  const [editingId, setEditingId] = useState(null);

  const toggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: !c.status } : c))
    );
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

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.name.trim()) return;
    if (modalType === "edit" && editingId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingId ? { ...c, name: modalForm.name } : c
        )
      );
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: modalForm.name,
          code: (Math.floor(Math.random() * 90000000) + 10000000).toString(),
          status: true,
        },
      ]);
    }
    setShowModal(false);
    setModalForm({ code: "", name: "" });
    setEditingId(null);
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
              <td>
                <button className="edit-btn" onClick={() => openEdit(c.id)}>
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
              Add Category
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

export default Category;
