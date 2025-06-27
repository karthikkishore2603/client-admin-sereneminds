import React, { useState, useEffect } from "react";
import "./Country.css";
import { FiEdit, FiDownload, FiMaximize2, FiFilter } from "react-icons/fi";
import axios from "axios";

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ countryName: "", status: false });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch countries from backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/countries`
        );
        setCountries(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      if (editingId !== null) {
        // Update existing country
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/countries/${editingId}`,
          {
            countryName: form.countryName,
            status: form.status,
          }
        );
        const updated = countries.map((c) =>
          c.id === editingId
            ? { ...c, countryName: form.countryName, status: form.status }
            : c
        );
        setCountries(updated);
      } else {
        // Create new country
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/countries`,
          {
            countryName: form.countryName,
            status: form.status,
          }
        );
        setCountries([...countries, response.data]);
      }
      setForm({ countryName: "", status: false });
      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const countryToUpdate = countries.find((c) => c.id === id);
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/countries/${id}/status`,
        {
          status: !countryToUpdate.status,
        }
      );
      const updated = countries.map((c) =>
        c.id === id ? { ...c, status: !c.status } : c
      );
      setCountries(updated);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

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
                      onChange={() => toggleStatus(country.id)}
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
    </div>
  );
};

export default Country;
