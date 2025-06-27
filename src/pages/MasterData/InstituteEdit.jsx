import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Institute.css";

const mockInstitute = {
  id: 951201,
  name: "Example University",
  code: "client-ZQ2411009B",
  email: "Example@gmail.com",
  phone: "9876543210",
  telephone: "0442345678",
  address1: "Address Line 1",
  address2: "Address Line 2",
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "600107",
  website: "www.exampleschool.com",
};

const InstituteEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // In real app, fetch by id
  const [form, setForm] = useState({ ...mockInstitute });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update logic here
    navigate(`/institute/overview/${id}`);
  };

  return (
    <div className="institute-form-container">
      <div className="breadcrumb">
        <span onClick={() => navigate("/institute")}>Institute</span> &gt;{" "}
        <span>Edit</span>
      </div>
      <div className="institute-form-card">
        <div className="institute-form-title">Edit Institute</div>
        <form onSubmit={handleSubmit} className="edit-grid">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Institute Name"
              value={form.name}
              onChange={handleChange}
              className="institute-input"
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="institute-input"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="institute-input"
            />
            <input
              type="text"
              name="telephone"
              placeholder="Telephone Number"
              value={form.telephone}
              onChange={handleChange}
              className="institute-input"
            />
            <input
              type="text"
              name="address1"
              placeholder="Address Line 1"
              value={form.address1}
              onChange={handleChange}
              className="institute-input"
            />
            <input
              type="text"
              name="address2"
              placeholder="Address Line 2"
              value={form.address2}
              onChange={handleChange}
              className="institute-input"
            />
          </div>
          <div>
            <input
              type="text"
              name="code"
              placeholder="Institute Code"
              value={form.code}
              readOnly
              className="institute-input readonly"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="institute-input"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="institute-input"
            />
            <input
              type="text"
              name="pincode"
              placeholder="Pin Code"
              value={form.pincode}
              onChange={handleChange}
              className="institute-input"
            />
            <input
              type="text"
              name="website"
              placeholder="Website"
              value={form.website}
              onChange={handleChange}
              className="institute-input"
            />
          </div>
          <div className="institute-form-actions">
            <button type="submit" className="submit-btn">
              Update
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/institute/overview/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InstituteEdit;
