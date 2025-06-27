import React, { useState } from "react";
import "./Branch.css";
import { FiMoreVertical } from "react-icons/fi";

const CATEGORIES = [
  { id: 1, name: "Example Category", code: "951203" },
  { id: 2, name: "Another Category", code: "123456" },
];

const initialSubCategories = [
  {
    id: 1,
    name: "Example Sub Category",
    code: "57893145",
    categoryId: 1,
    status: false,
  },
  {
    id: 2,
    name: "Example Sub Category",
    code: "57893145",
    categoryId: 1,
    status: false,
  },
  {
    id: 3,
    name: "Example Sub Category",
    code: "57893145",
    categoryId: 1,
    status: false,
  },
  {
    id: 4,
    name: "Example Sub Category",
    code: "57893145",
    categoryId: 1,
    status: false,
  },
  {
    id: 5,
    name: "Example Sub Category",
    code: "57893145",
    categoryId: 1,
    status: false,
  },
  {
    id: 6,
    name: "Example Sub Category",
    code: "57893145",
    categoryId: 1,
    status: false,
  },
  {
    id: 7,
    name: "Example Sub Category",
    code: "57893145",
    categoryId: 1,
    status: false,
  },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState(initialSubCategories);
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

  const toggleStatus = (id) => {
    setSubCategories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: !s.status } : s))
    );
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

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.name.trim() || !modalForm.categoryId) return;
    if (modalType === "edit" && editingId) {
      setSubCategories((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: modalForm.name,
                categoryId: Number(modalForm.categoryId),
              }
            : s
        )
      );
    } else {
      setSubCategories((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: modalForm.name,
          code: (Math.floor(Math.random() * 90000000) + 10000000).toString(),
          categoryId: Number(modalForm.categoryId),
          status: false,
        },
      ]);
    }
    setShowModal(false);
    setModalForm({ code: "", name: "", categoryId: "" });
    setEditingId(null);
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
            <th>Category</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((s) => {
            const category = CATEGORIES.find((c) => c.id === s.categoryId);
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
                <td>
                  <button className="edit-btn" onClick={() => openEdit(s.id)}>
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
                >
                  <option value="">Category Name</option>
                  {CATEGORIES.map((c) => (
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

export default SubCategory;
