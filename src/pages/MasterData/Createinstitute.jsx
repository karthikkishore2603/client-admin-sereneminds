import React, { useState } from "react";
import "./CreateInstitute.css";

const Institute = ({ isEdit = false, initialData = {} }) => {
  const [form, setForm] = useState({
    instituteCode: initialData.instituteCode || "",
    instituteName: initialData.instituteName || "",
    address1: initialData.address1 || "",
    address2: initialData.address2 || "",
    city: initialData.city || "",
    state: initialData.state || "",
    pincode: initialData.pincode || "",
    phone: initialData.phone || "",
    telephone: initialData.telephone || "",
    email: initialData.email || "",
    website: initialData.website || "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // Add API logic here for create/update
  };

  return (
    <div className="institute-container">
      <h3 className="institute-heading">
        {isEdit ? "Edit" : "Create"} Institute
      </h3>

      <form className="institute-form" onSubmit={handleSubmit}>
        <div className="upload-section">
          <div className="avatar" />
          <div>
            <button type="button">Upload</button>
            <button type="button">Reset</button>
            <p>Allowed JPG, GIF or PNG. Max size of 800KB</p>
          </div>
        </div>

        <fieldset className="form-section">
          <legend>Institute</legend>
          {isEdit && (
            <div className="field">
              <label>Institute Code</label>
              <input type="text" value={form.instituteCode} disabled />
            </div>
          )}
          <div className="field">
            <label>Institute Name</label>
            <input
              type="text"
              value={form.instituteName}
              onChange={(e) => handleChange("instituteName", e.target.value)}
            />
          </div>
          <div className="row">
            <div className="field">
              <label>Address Line 1</label>
              <input
                type="text"
                value={form.address1}
                onChange={(e) => handleChange("address1", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Address Line 2</label>
              <input
                type="text"
                value={form.address2}
                onChange={(e) => handleChange("address2", e.target.value)}
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
              value={form.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
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
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div className="field">
              <label>Telephone Number</label>
              <input
                type="text"
                value={form.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
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
          <button type="button" className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Institute;
