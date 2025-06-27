import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./BranchForm.css";

// Mock data fetch, in a real app this would be an API call.
const branches = [
  {
    id: 1,
    name: "Example Branch Name",
    code: "951203",
    institute: "Example Institute Name",
    instituteCode: "951203",
    address1: "Ashok Nagar",
    address2: "1st Avenue",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600106",
    phone: "9876543210",
    telephone: "0442345678",
    email: "branch@example.com",
    website: "www.branch.com",
  },
];

const getBranchById = (id) => branches.find((b) => b.id === parseInt(id));

const BranchForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    instituteCode: "INS001", // Mocked
    instituteName: "Example Institute Name", // Mocked
    branchCode: "",
    branchName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    telephone: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    if (isEdit && id) {
      const branchData = getBranchById(id);
      if (branchData) {
        setForm({
          instituteCode: branchData.instituteCode,
          instituteName: branchData.institute,
          branchCode: branchData.code,
          branchName: branchData.name,
          address1: branchData.address1,
          address2: branchData.address2,
          city: branchData.city,
          state: branchData.state,
          pincode: branchData.pincode,
          phone: branchData.phone,
          telephone: branchData.telephone,
          email: branchData.email,
          website: branchData.website,
        });
      }
    }
  }, [isEdit, id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // In a real app, you'd have API logic here.
    navigate("/branch"); // Navigate back to list after submit
  };

  const handleCancel = () => {
    navigate("/branch"); // Navigate back to the branch list
  };

  return (
    <div className="branch-form-container">
      <h3 className="branch-form-title">{isEdit ? "Edit" : "Create"} Branch</h3>

      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="form-section">
          <legend>Institute Details</legend>
          <div className="branch-form-grid">
            <div className="branch-form-input">
              <label>Institute Code</label>
              <input type="text" value={form.instituteCode} disabled />
            </div>
            <div className="branch-form-input">
              <label>Institute Name</label>
              <input type="text" value={form.instituteName} disabled />
            </div>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Branch Details</legend>
          <div className="branch-form-grid">
            {isEdit && (
              <div className="branch-form-input">
                <label>Branch Code</label>
                <input type="text" value={form.branchCode} disabled />
              </div>
            )}
            <div className="branch-form-input">
              <label>Branch Name</label>
              <input
                type="text"
                value={form.branchName}
                onChange={(e) => handleChange("branchName", e.target.value)}
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
};

export default BranchForm;
