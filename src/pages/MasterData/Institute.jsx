import React, { useState, useEffect } from "react";
import "./Institute.css";
import { FiEdit, FiFilter, FiDownload, FiMaximize2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

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
};

const Institute = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  // Fetch institutes from backend
  useEffect(() => {
    fetchInstitutes();
    // eslint-disable-next-line
  }, []);

  const fetchInstitutes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/institutes`
      );
      if (!response.ok) throw new Error("Failed to fetch institutes");
      const data = await response.json();
      setInstitutes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle status
  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/institutes/${id}/toggle-status`,
        { method: "PATCH" }
      );
      if (!response.ok) throw new Error("Failed to toggle status");
      const updatedInstitute = await response.json();
      setInstitutes((prev) =>
        prev.map((inst) =>
          inst.id === updatedInstitute.id ? updatedInstitute : inst
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Form handlers
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      let url = `${process.env.REACT_APP_API_BASE_URL}/institutes`;
      let method = "POST";
      if (isEdit && editId) {
        url = `${url}/${editId}`;
        method = "PUT";
      }
      const response = await fetch(url, {
        method,
        body: formData,
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to save institute");
      setShowForm(false);
      setForm(defaultForm);
      setIsEdit(false);
      setEditId(null);
      fetchInstitutes();
    } catch (err) {
      setError(err.message);
    }
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
    });
    setIsEdit(true);
    setEditId(inst.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(defaultForm);
    setIsEdit(false);
    setEditId(null);
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

  if (showForm) {
    return (
      <div className="institute-container">
        <h3 className="institute-heading">
          {isEdit ? "Edit" : "Create"} Institute
        </h3>
        <form className="institute-form" onSubmit={handleFormSubmit}>
          <div className="upload-section">
            <div className="avatar" />
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
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  Upload
                </button>
              </label>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, image: null }))}
              >
                Reset
              </button>
              <p>Allowed JPG, GIF or PNG. Max size of 800KB</p>
            </div>
          </div>
          <fieldset className="form-section">
            <legend>Institute</legend>
            {isEdit && (
              <div className="field">
                <label>Institute Code</label>
                <input type="text" value={editId} disabled />
              </div>
            )}
            <div className="field">
              <label>Institute Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="row">
              <div className="field">
                <label>Address Line 1</label>
                <input
                  type="text"
                  value={form.addressLine1}
                  onChange={(e) => handleChange("addressLine1", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Address Line 2</label>
                <input
                  type="text"
                  value={form.addressLine2}
                  onChange={(e) => handleChange("addressLine2", e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label>City</label>
                <select
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                >
                  <option>City</option>
                  <option>Chennai</option>
                  <option>Madurai</option>
                </select>
              </div>
              <div className="field">
                <label>State</label>
                <select
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                >
                  <option>Select</option>
                  <option>Tamil Nadu</option>
                  <option>Kerala</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Pin Code</label>
              <input
                type="text"
                value={form.pinCode}
                onChange={(e) => handleChange("pinCode", e.target.value)}
              />
            </div>
          </fieldset>
          <fieldset className="form-section">
            <legend>Contact</legend>
            <div className="row">
              <div className="field">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Telephone Number</label>
                <input
                  type="text"
                  value={form.telephoneNumber}
                  onChange={(e) =>
                    handleChange("telephoneNumber", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label>Email ID</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="field">
                <label>Website Link</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                />
              </div>
            </div>
          </fieldset>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              {isEdit ? "Update" : "Submit"}
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

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
              setShowForm(true);
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
                {inst.addressLine1 || ""} {inst.addressLine2 || ""}{" "}
                {inst.city || ""} {inst.state || ""} {inst.pinCode || ""}
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
              <td>
                <button className="edit-btn" onClick={() => handleEdit(inst)}>
                  <FiEdit size={16} />
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
    </div>
  );
};

export default Institute;
