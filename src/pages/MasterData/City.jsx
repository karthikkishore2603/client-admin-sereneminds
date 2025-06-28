import React, { useState, useEffect } from "react";
import "./City.css";
import { FiEdit, FiDownload, FiMaximize2, FiFilter } from "react-icons/fi";
import axios from "axios";

const City = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ country: "", state: "", city: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch cities from backend
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/cities`
        );
        setCities(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Create or update city
  const handleCreateOrUpdate = async () => {
    if (!form.city || !form.state || !form.country) {
      setError("Please fill all fields");
      return;
    }

    try {
      if (editingId !== null) {
        // Update existing city
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/cities/${editingId}`,
          {
            country: form.country,
            state: form.state,
            city: form.city,
          }
        );
        const updated = cities.map((c) =>
          c.id === editingId
            ? {
                ...c,
                country: form.country,
                state: form.state,
                city: form.city,
              }
            : c
        );
        setCities(updated);
      } else {
        // Create new city
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/cities`,
          {
            country: form.country,
            state: form.state,
            city: form.city,
            status: false,
          }
        );
        setCities([...cities, response.data]);
      }
      setForm({ country: "", state: "", city: "" });
      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Toggle city status
  const toggleStatus = async (id) => {
    try {
      const cityToUpdate = cities.find((c) => c.id === id);
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/cities/${id}/status`,
        {
          status: !cityToUpdate.status,
        }
      );
      const updated = cities.map((c) =>
        c.id === id ? { ...c, status: !c.status } : c
      );
      setCities(updated);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Start editing a city
  const startEditing = (city) => {
    setForm({
      country: city.country,
      state: city.state,
      city: city.city,
    });
    setEditingId(city.id);
    setShowModal(true);
  };

  // Filter cities based on search term
  const filteredCities = cities.filter((city) =>
    city.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading cities...</div>;
  if (error) return <div className="error">Error: {error}</div>;

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
    </div>
  );
};

export default City;
