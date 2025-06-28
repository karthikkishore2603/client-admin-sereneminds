import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiDownload, FiMaximize2, FiFilter, FiEdit } from "react-icons/fi";
import "./State.css";

const State = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", countryId: "" });
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch states and countries on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statesRes, countriesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/states`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/countries`),
        ]);
        setStates(statesRes.data);
        setCountries(countriesRes.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      if (editingId !== null) {
        // Update existing state
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/states/${editingId}`,
          form
        );
        const updated = states.map((s) =>
          s.id === editingId
            ? { ...s, name: form.name, countryId: form.countryId }
            : s
        );
        setStates(updated);
      } else {
        // Create new state
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/states`,
          form
        );
        setStates([...states, response.data]);
      }
      setForm({ name: "", countryId: "" });
      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const stateToUpdate = states.find((s) => s.id === id);
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/states/${id}/status`,
        {
          status: !stateToUpdate.status,
        }
      );
      const updated = states.map((s) =>
        s.id === id ? { ...s, status: !s.status } : s
      );
      setStates(updated);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

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
