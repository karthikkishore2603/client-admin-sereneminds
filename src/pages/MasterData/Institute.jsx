import React, { useState } from "react";
import "./Institute.css";
import {
  FiEdit,
  FiFilter,
  FiDownload,
  FiMaximize2,
  FiTrash2,
  FiEye,
} from "react-icons/fi";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const defaultForm = {
  name: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pinCode: "",
  phoneNumber: "",
  telephoneNumber: "",
  email: "",
  website: "",
  image: null,
  status: true,
};

const initialInstitutes = [
  {
    id: "INST001",
    name: "SerenMinds Institute",
    addressLine1: "123 Main St",
    addressLine2: "Suite 101",
    city: "Chennai",
    state: "Tamil Nadu",
    pinCode: "600001",
    phoneNumber: "9876543210",
    telephoneNumber: "044-1234567",
    email: "info@serenminds.com",
    website: "https://serenminds.com",
    status: true,
    image: null,
    code: "SMI001",
  },
  {
    id: "INST002",
    name: "Mindful Academy",
    addressLine1: "456 Park Ave",
    addressLine2: "",
    city: "Madurai",
    state: "Tamil Nadu",
    pinCode: "625001",
    phoneNumber: "9123456780",
    telephoneNumber: "0452-7654321",
    email: "contact@mindfulacademy.com",
    website: "https://mindfulacademy.com",
    status: false,
    image: null,
    code: "MA002",
  },
];

const Institute = () => {
  const [institutes, setInstitutes] = useState(initialInstitutes);
  const [loading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // View state: 'list', 'form', 'overview'
  const [viewMode, setViewMode] = useState("list");
  const [form, setForm] = useState(defaultForm);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Toggle status
  const toggleStatus = (id) => {
    setInstitutes((prev) =>
      prev.map((inst) =>
        inst.id === id ? { ...inst, status: !inst.status } : inst
      )
    );
  };

  // Form handlers
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name) {
      setError("Institute name is required");
      return;
    }
    if (isEdit && editId) {
      setInstitutes((prev) =>
        prev.map((inst) =>
          inst.id === editId ? { ...inst, ...form, id: editId } : inst
        )
      );
    } else {
      // Generate a new ID
      const newId = `INST${String(institutes.length + 1).padStart(3, "0")}`;
      setInstitutes((prev) => [
        {
          ...form,
          id: newId,
          code: `CODE${institutes.length + 1}`,
        },
        ...prev,
      ]);
    }
    setViewMode("list");
    setForm(defaultForm);
    setIsEdit(false);
    setEditId(null);
  };

  const handleEdit = (inst) => {
    setForm({
      name: inst.name || "",
      addressLine1: inst.addressLine1 || "",
      addressLine2: inst.addressLine2 || "",
      city: inst.city || "",
      state: inst.state || "",
      pinCode: inst.pinCode || "",
      phoneNumber: inst.phoneNumber || "",
      telephoneNumber: inst.telephoneNumber || "",
      email: inst.email || "",
      website: inst.website || "",
      image: null,
      status: inst.status,
    });
    setIsEdit(true);
    setEditId(inst.id);
    setViewMode("form");
  };

  const handleCancel = () => {
    setViewMode("list");
    setForm(defaultForm);
    setIsEdit(false);
    setEditId(null);
    setSelectedInstitute(null);
  };

  // Delete
  const handleDelete = (id) => {
    setInstitutes((prev) => prev.filter((inst) => inst.id !== id));
    setDeleteConfirmId(null);
    if (selectedInstitute && selectedInstitute.id === id) {
      setViewMode("list");
      setSelectedInstitute(null);
    }
  };

  // Overview
  const handleOverview = (inst) => {
    setSelectedInstitute(inst);
    setViewMode("overview");
  };

  // Filter and paginate
  const filteredInstitutes = institutes.filter((inst) =>
    inst.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filteredInstitutes.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredInstitutes.slice(startIdx, endIdx);

  if (loading) {
    return <div className="loading">Loading institutes...</div>;
  }
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // --- FORM VIEW ---
  if (viewMode === "form") {
    return (
      <div className="institute-form-container">
        <div className="breadcrumb">
          <span>Institute</span>
          <span style={{ color: "#888" }}>&gt;</span>
          <span>{isEdit ? "Edit" : "Create"}</span>
        </div>
        <div className="institute-form-card">
          <form className="institute-form" onSubmit={handleFormSubmit}>
            <div className="upload-section">
              <div className="avatar-preview">
                {form.image ? (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Institute"
                    className="avatar-img"
                  />
                ) : (
                  <span className="avatar-icon">
                    <svg width="48" height="48" fill="none">
                      <circle cx="24" cy="24" r="24" fill="#e0e0e0" />
                      <path
                        d="M24 26c3.314 0 6-2.239 6-5s-2.686-5-6-5-6 2.239-6 5 2.686 5 6 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                        fill="#bdbdbd"
                      />
                    </svg>
                  </span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    Upload
                  </button>
                </label>
                <button
                  type="button"
                  className="reset-btn"
                  onClick={() => setForm((prev) => ({ ...prev, image: null }))}
                  disabled={!form.image}
                >
                  Reset
                </button>
                <p className="upload-hint">
                  Allowed JPG, GIF or PNG. Max size of 800kB
                </p>
              </div>
            </div>
            <fieldset className="form-section">
              <legend>Institute</legend>
              <div className="edit-grid">
                <div className="field">
                  <label>Institute Name</label>
                  <input
                    type="text"
                    className="institute-input"
                    placeholder="Institute Name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Pin Code</label>
                  <input
                    type="text"
                    className="institute-input"
                    placeholder="Pin Code"
                    value={form.pinCode}
                    onChange={(e) => handleChange("pinCode", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Address Line 1</label>
                  <input
                    type="text"
                    className="institute-input"
                    placeholder="Address Line 1"
                    value={form.addressLine1}
                    onChange={(e) =>
                      handleChange("addressLine1", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    className="institute-input"
                    placeholder="Address Line 2"
                    value={form.addressLine2}
                    onChange={(e) =>
                      handleChange("addressLine2", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>City</label>
                  <select
                    className="institute-input"
                    value={form.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  >
                    <option value="">City</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Madurai">Madurai</option>
                    <option value="Coimbatore">Coimbatore</option>
                    <option value="Vellore">Vellore</option>
                  </select>
                </div>
                <div className="field">
                  <label>State</label>
                  <select
                    className="institute-input"
                    value={form.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Karnataka">Karnataka</option>
                  </select>
                </div>
              </div>
            </fieldset>
            <fieldset className="form-section">
              <legend>Contact</legend>
              <div className="edit-grid">
                <div className="field">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="institute-input"
                    placeholder="Phone Number"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      handleChange("phoneNumber", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Telephone Number</label>
                  <input
                    type="text"
                    className="institute-input"
                    placeholder="Telephone Number"
                    value={form.telephoneNumber}
                    onChange={(e) =>
                      handleChange("telephoneNumber", e.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label>Email ID</label>
                  <input
                    type="email"
                    className="institute-input"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Website Link</label>
                  <input
                    type="text"
                    className="institute-input"
                    placeholder="Website Link"
                    value={form.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                </div>
              </div>
            </fieldset>
            <div className="form-buttons institute-form-actions">
              <button type="submit" className="submit-btn">
                {isEdit ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- OVERVIEW VIEW ---
  if (viewMode === "overview" && selectedInstitute) {
    const inst = selectedInstitute;
    return (
      <div
        className="institute-container"
        style={{ background: "#f7f7f7", minHeight: "100vh" }}
      >
        <div className="breadcrumb">
          <span>Institute</span>
          <span style={{ color: "#888" }}>&gt;</span>
          <span>Overview</span>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: 28,
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "#eaeaea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              color: "#b0b0b0",
              marginRight: 28,
            }}
          >
            <span>👤</span>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 20,
                color: "#222",
                marginBottom: 6,
              }}
            >
              {inst.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                color: "#888",
                fontSize: 15,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FiEdit /> {inst.email}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FiEdit /> {inst.phoneNumber || inst.phone}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <FiEdit /> {inst.website}
              </span>
            </div>
          </div>
          <button
            style={{
              background: "#f5f5f5",
              border: "none",
              borderRadius: 8,
              padding: "8px 18px",
              color: "#555",
              fontWeight: 500,
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
            }}
            onClick={() => handleEdit(inst)}
          >
            <FiEdit /> Edit
          </button>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 32,
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 18,
              color: "#444",
              marginBottom: 18,
            }}
          >
            Details
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Institute Name{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {inst.name}
                </span>
              </div>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Phone Number{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {inst.phoneNumber || inst.phone}
                </span>
              </div>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Address Line 1{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {inst.addressLine1}
                </span>
              </div>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                City{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {inst.city}
                </span>
              </div>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Pin Code{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {inst.pinCode}
                </span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Institute Code{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {inst.code || inst.id}
                </span>
              </div>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Telephone Number{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {inst.telephoneNumber || inst.telephone}
                </span>
              </div>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                Address Line 2{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {inst.addressLine2}
                </span>
              </div>
              <div style={{ marginBottom: 12, color: "#888", fontSize: 15 }}>
                State{" "}
                <span style={{ color: "#222", fontWeight: 500 }}>
                  : {inst.state}
                </span>
              </div>
            </div>
          </div>
          <div className="institute-form-actions" style={{ marginTop: 32 }}>
            <button className="cancel-btn" onClick={handleCancel}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="institute-container">
      <div className="institute-header">
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
          className="search-input"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <div className="actions">
          <button
            className="create-btn"
            onClick={() => {
              setViewMode("form");
              setIsEdit(false);
              setForm(defaultForm);
              setEditId(null);
            }}
          >
            + Create
          </button>
          <button className="icon-btn">
            <FiDownload />
          </button>
          <button className="icon-btn">
            <FiMaximize2 />
          </button>
          <button className="icon-btn">
            <FiFilter />
          </button>
        </div>
      </div>
      <table className="institute-table">
        <thead>
          <tr>
            <th>Institute Name</th>
            <th>Email ID</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((inst) => (
            <tr key={inst.id}>
              <td>
                <div className="inst-name">{inst.name}</div>
                <div className="inst-id">{inst.id}</div>
              </td>
              <td>
                <div>{inst.email}</div>
                <div className="inst-id">{inst.email}</div>
              </td>
              <td>
                <div>{inst.phoneNumber || inst.phone}</div>
                <div className="inst-id">{inst.phoneNumber || inst.phone}</div>
              </td>
              <td style={{ whiteSpace: "pre-line" }}>
                {[
                  inst.addressLine1,
                  inst.addressLine2,
                  inst.city,
                  inst.state,
                  inst.pinCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={inst.status}
                    onChange={() => toggleStatus(inst.id)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td style={{ display: "flex", gap: 8 }}>
                <button
                  className="edit-btn"
                  title="Edit"
                  onClick={() => handleEdit(inst)}
                >
                  <FiEdit size={16} />
                </button>
                <button
                  className="edit-btn"
                  title="Overview"
                  onClick={() => handleOverview(inst)}
                >
                  <FiEye size={16} />
                </button>
                <button
                  className="edit-btn"
                  title="Delete"
                  onClick={() => setDeleteConfirmId(inst.id)}
                >
                  <FiTrash2 size={16} style={{ color: "#e74c3c" }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="institute-footer">
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
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal">
            <div>Are you sure you want to delete this institute?</div>
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

export default Institute;
