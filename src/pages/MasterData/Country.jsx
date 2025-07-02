import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Country.css";
import { FiEdit, FiDownload, FiMaximize2, FiFilter } from "react-icons/fi";

const API_URL = "http://localhost:5000/api/countries";

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ countryName: "", status: false });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setCountries(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch countries");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleCreateOrUpdate = async () => {
    if (!form.countryName) return;
    try {
      if (editingId !== null) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      fetchCountries();
      setShowModal(false);
      setForm({ countryName: "", status: false });
      setEditingId(null);
      setError("");
    } catch (err) {
      setError("Failed to save country");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this country?"))
      return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCountries();
      setError("");
    } catch (err) {
      setError("Failed to delete country");
    }
  };

  const toggleStatus = async (country) => {
    try {
      await axios.patch(`${API_URL}/${country.id}/status`, {
        status: !country.status,
      });
      fetchCountries();
      setError("");
    } catch (err) {
      setError("Failed to toggle status");
    }
  };

  const startEditing = (country) => {
    setForm({
      countryName: country.countryName,
      status: country.status,
    });
    setEditingId(country.id);
    setShowModal(true);
  };

  const filteredCountries = countries.filter((c) =>
    c.countryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="country-container">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">
              {editingId !== null ? "Edit Country" : "Add New Country"}
            </h3>
            <input
              type="text"
              className="modal-input"
              placeholder="Country Name"
              value={form.countryName}
              onChange={(e) =>
                setForm({ ...form, countryName: e.target.value })
              }
              required
            />
            <div className="status-toggle">
              <label>
                Status:
                <input
                  type="checkbox"
                  checked={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.checked })
                  }
                  className="status-checkbox"
                />
              </label>
            </div>
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => {
                  setShowModal(false);
                  setForm({ countryName: "", status: false });
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

      <div className="country-header">
        <select className="dropdown">
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>

        <input
          type="text"
          className="search-input"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="actions">
          <button
            className="create-btn"
            onClick={() => {
              setForm({ countryName: "", status: false });
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
        <table className="country-table">
          <thead>
            <tr>
              <th>Country Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <tr key={country.id}>
                  <td className="country-name">{country.countryName}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={country.status}
                        onChange={() => toggleStatus(country)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => startEditing(country)}
                      title="Edit country"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="edit-btn"
                      style={{ color: "red", marginLeft: 8 }}
                      onClick={() => handleDelete(country.id)}
                      title="Delete country"
                    >
                      &#10006;
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-results">
                  {searchTerm
                    ? "No matching countries found"
                    : "No countries available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Country;
