import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiDownload,
  FiMaximize2,
  FiFilter,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import "./State.css";

const API_URL = "http://localhost:5000/api/states";
const COUNTRY_API_URL = "http://localhost:5000/api/countries";

const State = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", countryId: "" });
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setStates(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch states");
    }
    setLoading(false);
  };

  const fetchCountries = async () => {
    try {
      const res = await axios.get(COUNTRY_API_URL);
      setCountries(res.data);
    } catch (err) {
      setCountries([]);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  const handleCreateOrUpdate = async () => {
    if (!form.name || !form.countryId) return;
    try {
      if (editingId !== null) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      fetchStates();
      setShowModal(false);
      setForm({ name: "", countryId: "" });
      setEditingId(null);
      setError("");
    } catch (err) {
      setError("Failed to save state");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this state?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStates();
      setError("");
    } catch (err) {
      setError("Failed to delete state");
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/toggle-status`);
      fetchStates();
      setError("");
    } catch (err) {
      setError("Failed to toggle status");
    }
  };

  const startEditing = (state) => {
    setForm({
      name: state.name,
      countryId: state.countryId,
    });
    setEditingId(state.id);
    setShowModal(true);
  };

  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (state.Country &&
        state.Country.countryName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="state-container">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">
              {editingId !== null ? "Edit State" : "Add New State"}
            </h3>
            <input
              type="text"
              className="modal-input"
              placeholder="State Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <select
              className="modal-input"
              value={form.countryId}
              onChange={(e) => setForm({ ...form, countryId: e.target.value })}
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.countryName}
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => {
                  setShowModal(false);
                  setForm({ name: "", countryId: "" });
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

      <div className="state-controls">
        <select className="dropdown">
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>

        <input
          type="text"
          className="search-input"
          placeholder="Search states..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="actions">
          <button
            className="create-btn"
            onClick={() => {
              setForm({ name: "", countryId: "" });
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
        <table className="state-table">
          <thead>
            <tr>
              <th>State Name</th>
              <th>Country</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => (
                <tr key={state.id}>
                  <td className="state-name">{state.name}</td>
                  <td className="country-name">{state.Country?.countryName}</td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={state.status}
                        onChange={() => toggleStatus(state.id)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => startEditing(state)}
                      title="Edit state"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="edit-btn"
                      style={{ color: "red", marginLeft: 8 }}
                      onClick={() => handleDelete(state.id)}
                      title="Delete state"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-results">
                  {searchTerm
                    ? "No matching states found"
                    : "No states available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <span>{`Showing 1 to ${filteredStates.length} of ${filteredStates.length} entries`}</span>
        <div className="pages">
          <button>{"<"}</button>
          <button className="active">1</button>
          <button>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default State;
