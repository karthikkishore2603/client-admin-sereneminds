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

// Sample institute data
const sampleInstitutes = [
  {
    id: 1,
    name: "Anna University",
    addressLine1: "Sardar Patel Road",
    addressLine2: "Guindy",
    city: "Chennai",
    state: "Tamil Nadu",
    pinCode: "600025",
    phoneNumber: "9876543210",
    telephoneNumber: "044-22203456",
    email: "info@annauniv.edu",
    website: "https://www.annauniv.edu",
    status: true,
  },
  {
    id: 2,
    name: "IIT Madras",
    addressLine1: "IIT P.O.",
    addressLine2: "Adyar",
    city: "Chennai",
    state: "Tamil Nadu",
    pinCode: "600036",
    phoneNumber: "9123456789",
    telephoneNumber: "044-22574000",
    email: "office@iitm.ac.in",
    website: "https://www.iitm.ac.in",
    status: true,
  },
  {
    id: 3,
    name: "Madurai Kamaraj University",
    addressLine1: "Palkalaiperur",
    addressLine2: "",
    city: "Madurai",
    state: "Tamil Nadu",
    pinCode: "625021",
    phoneNumber: "9876501234",
    telephoneNumber: "0452-2458471",
    email: "registrar@mkuniversity.org",
    website: "https://www.mkuniversity.org",
    status: false,
  },
  {
    id: 4,
    name: "VIT University",
    addressLine1: "Vellore Institute of Technology",
    addressLine2: "Katpadi",
    city: "Vellore",
    state: "Tamil Nadu",
    pinCode: "632014",
    phoneNumber: "9444556677",
    telephoneNumber: "0416-2202020",
    email: "info@vit.ac.in",
    website: "https://www.vit.ac.in",
    status: true,
  },
  {
    id: 5,
    name: "Bharathiar University",
    addressLine1: "Marudhamalai Road",
    addressLine2: "",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pinCode: "641046",
    phoneNumber: "9988776655",
    telephoneNumber: "0422-2428100",
    email: "info@b-u.ac.in",
    website: "https://www.b-u.ac.in",
    status: true,
  },
];

const Institute = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [nextId, setNextId] = useState(6); // For generating new IDs

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  // Load sample data on component mount
  useEffect(() => {
    const fetchInstitutes = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/institutes");
        if (!response.ok) throw new Error("Failed to fetch institutes");
        const data = await response.json();
        setInstitutes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInstitutes();
  }, []);

  // Toggle status
  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/institutes/${id}/toggle-status`,
        { method: "PATCH" }
      );
      if (!response.ok) throw new Error("Failed to toggle status");
      const updated = await response.json();
      setInstitutes((prev) =>
        prev.map((inst) => (inst.id === id ? updated : inst))
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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    try {
      if (isEdit && editId) {
        // Update existing institute
        setInstitutes((prev) =>
          prev.map((inst) =>
            inst.id === editId
              ? {
                  ...inst,
                  name: form.name,
                  addressLine1: form.addressLine1,
                  addressLine2: form.addressLine2,
                  city: form.city,
                  state: form.state,
                  pinCode: form.pinCode,
                  phoneNumber: form.phoneNumber,
                  telephoneNumber: form.telephoneNumber,
                  email: form.email,
                  website: form.website,
                }
              : inst
          )
        );
      } else {
        // Add new institute
        const newInstitute = {
          id: nextId,
          name: form.name,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          pinCode: form.pinCode,
          phoneNumber: form.phoneNumber,
          telephoneNumber: form.telephoneNumber,
          email: form.email,
          website: form.website,
          status: true, // Default status
        };
        setInstitutes((prev) => [...prev, newInstitute]);
        setNextId((prev) => prev + 1);
      }

      // Reset form
      setShowForm(false);
      setForm(defaultForm);
      setIsEdit(false);
      setEditId(null);
    } catch (err) {
      setError("Failed to save institute");
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

  if (loading) {
    return <div className="loading">Loading institutes...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (showForm) {
    return (
      <div className="institute-form-container">
        <div className="breadcrumb">
          <span>
            <svg width="16" height="16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#E0E0E0" />
              <path
                d="M8 4v4l2.5 2.5"
                stroke="#888"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
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
