import React, { useState, useEffect } from "react";
import axios from "axios";
import "./City.css";
import { FiEdit, FiDownload, FiMaximize2, FiFilter } from "react-icons/fi";

const API_URL = "http://localhost:5000/api/cities";

const City = () => {
  const [cities, setCities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ country: "", state: "", city: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCities(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch cities");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleCreateOrUpdate = async () => {
    if (!form.city || !form.state || !form.country) return;
    try {
      if (editingId !== null) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      fetchCities();
      setShowModal(false);
      setForm({ country: "", state: "", city: "" });
      setEditingId(null);
      setError("");
    } catch (err) {
      setError("Failed to save city");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCities();
      setError("");
    } catch (err) {
      setError("Failed to delete city");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/toggle-status`);
      fetchCities();
      setError("");
    } catch (err) {
      setError("Failed to toggle status");
    }
  };

  const startEditing = (city) => {
    setForm({
      country: city.country,
      state: city.state,
      city: city.city,
    });
    setEditingId(city.id);
    setShowModal(true);
  };

  const filteredCities = cities.filter((city) =>
    city.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="city-container">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">
              {editingId !== null ? "Edit City" : "Add New City"}
            </h3>
            <input
              type="text"
              className="modal-input"
              placeholder="Country Name"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              required
            />
            <input
              type="text"
              className="modal-input"
              placeholder="State Name"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              required
            />
            <input
              type="text"
              className="modal-input"
              placeholder="City Name"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => {
                  setShowModal(false);
                  setForm({ country: "", state: "", city: "" });
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
              <button className="modal-submit" onClick={handleCreateOrUpdate}>
                {editingId !== null ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="city-header">
        <select className="dropdown">
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>
        <input
          type="text"
          className="search-input"
          placeholder="Search cities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="actions">
          <button
            className="create-btn"
            onClick={() => {
              setForm({ country: "", state: "", city: "" });
              setEditingId(null);
              setShowModal(true);
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

      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="city-table">
          <thead>
            <tr>
              <th>City Name</th>
              <th>State</th>
              <th>Country</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <tr key={city.id}>
                  <td className="city-name">{city.city}</td>
                  <td className="state-name">{city.state}</td>
                  <td className="country-name">{city.country}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={city.status}
                        onChange={() => toggleStatus(city.id)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => startEditing(city)}
                      title="Edit city"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="edit-btn"
                      style={{ color: "red", marginLeft: 8 }}
                      onClick={() => handleDelete(city.id)}
                      title="Delete city"
                    >
                      &#10006;
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">
                  {searchTerm
                    ? "No matching cities found"
                    : "No cities available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default City;
