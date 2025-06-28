import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiFilter, FiDownload, FiMaximize2 } from "react-icons/fi";
import "./Branch.css";
import "./BranchForm.css";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const defaultForm = {
  name: "",
  code: "",
  institute: "",
  instituteCode: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  telephone: "",
  email: "",
  website: "",
  status: true,
};

const BranchForm = ({ onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState(defaultForm);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="branch-form-container">
      <h3 className="branch-form-title">Create Branch</h3>
      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="form-section">
          <legend>Institute Details</legend>
          <div className="branch-form-grid">
            <div className="branch-form-input">
              <label>Institute Code</label>
              <input
                type="text"
                value={form.instituteCode}
                onChange={(e) => handleChange("instituteCode", e.target.value)}
                required
              />
            </div>
            <div className="branch-form-input">
              <label>Institute Name</label>
              <input
                type="text"
                value={form.institute}
                onChange={(e) => handleChange("institute", e.target.value)}
                required
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Branch Details</legend>
          <div className="branch-form-grid">
            <div className="branch-form-input">
              <label>Branch Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div className="branch-form-input">
              <label>Branch Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => handleChange("code", e.target.value)}
                required
              />
            </div>
            <div className="branch-form-input">
              <label>Address Line 1</label>
              <input
                type="text"
                value={form.address1}
                onChange={(e) => handleChange("address1", e.target.value)}
                required
              />
            </div>
            <div className="branch-form-input">
              <label>Address Line 2</label>
              <input
                type="text"
                value={form.address2}
                onChange={(e) => handleChange("address2", e.target.value)}
              />
            </div>
            <div className="branch-form-input">
              <label>City</label>
              <select
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select City
                </option>
                <option>Chennai</option>
                <option>Coimbatore</option>
              </select>
            </div>
            <div className="branch-form-input">
              <label>State</label>
              <select
                value={form.state}
                onChange={(e) => handleChange("state", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select State
                </option>
                <option>Tamil Nadu</option>
                <option>Kerala</option>
              </select>
            </div>
            <div className="branch-form-input">
              <label>Pin Code</label>
              <input
                type="text"
                pattern="\d{6}"
                value={form.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
                required
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Contact Details</legend>
          <div className="branch-form-grid">
            <div className="branch-form-input">
              <label>Phone Number</label>
              <input
                type="tel"
                pattern="\d{10}"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </div>
            <div className="branch-form-input">
              <label>Telephone Number</label>
              <input
                type="tel"
                value={form.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
              />
            </div>
            <div className="branch-form-input">
              <label>Email ID</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            <div className="branch-form-input">
              <label>Website Link</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => handleChange("website", e.target.value)}
              />
            </div>
          </div>
        </fieldset>
        <div className="branch-form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  // Fetch branches from backend
  useEffect(() => {
    fetchBranches();
    // eslint-disable-next-line
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/branches`
      );
      if (!response.ok) throw new Error("Failed to fetch branches");
      const data = await response.json();
      setBranches(data);
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
        `${process.env.REACT_APP_API_BASE_URL}/branches/${id}/toggle-status`,
        { method: "PATCH" }
      );
      if (!response.ok) throw new Error("Failed to toggle status");
      const updatedBranch = await response.json();
      setBranches((prev) =>
        prev.map((branch) =>
          branch.id === updatedBranch.id ? updatedBranch : branch
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Create branch
  const handleCreateBranch = async (form) => {
    setFormLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/branches`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to create branch");
      setShowCreate(false);
      // Optimistically add the new branch to the list
      setBranches((prev) => [result, ...prev]);
      // Optionally, fetch again to ensure sync with backend
      // await fetchBranches();
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Filter and paginate
  const filteredBranches = branches.filter(
    (branch) =>
      branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.institute?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const total = filteredBranches.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredBranches.slice(startIdx, endIdx);

  if (showCreate) {
    return (
      <div className="branch-container">
        <BranchForm
          onSubmit={handleCreateBranch}
          onCancel={() => setShowCreate(false)}
          loading={formLoading}
        />
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
          placeholder="Search by branch or institute..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <div className="actions">
          <button className="create-btn" onClick={() => setShowCreate(true)}>
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
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <>
          <table className="branch-table">
            <thead>
              <tr>
                <th>Branch Name</th>
                <th>Institute</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((branch) => (
                <tr key={branch.id}>
                  <td>
                    <div className="branch-name">{branch.name}</div>
                    <div className="branch-code">{branch.code}</div>
                  </td>
                  <td>
                    <div className="institute-name">{branch.institute}</div>
                    <div className="institute-code">{branch.instituteCode}</div>
                  </td>
                  <td>
                    <div>{branch.phone}</div>
                    <div className="branch-code">{branch.phone}</div>
                  </td>
                  <td style={{ whiteSpace: "pre-line" }}>
                    {[
                      branch.address1,
                      branch.address2,
                      branch.city,
                      branch.state,
                      branch.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={branch.status}
                        onChange={() => toggleStatus(branch.id)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/branch/overview/${branch.id}`)}
                    >
                      <FiEdit size={16} />
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
        </>
      )}
    </div>
  );
};

export default Branch;
