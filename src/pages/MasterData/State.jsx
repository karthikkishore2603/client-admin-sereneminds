import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiDownload, FiMaximize2, FiFilter } from "react-icons/fi";
import "./State.css";

const State = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", countryId: "" });
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/states`,
        form
      );
      setStates([...states, response.data]);
      setForm({ name: "", countryId: "" });
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/states/${id}/toggle-status`
      );
      setStates(
        states.map((state) =>
          state.id === id ? { ...state, status: !state.status } : state
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
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
            <h3 className="modal-title">Add New State</h3>
            <input
              type="text"
              className="modal-input"
              placeholder="State Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              className="modal-input"
              value={form.countryId}
              onChange={(e) => setForm({ ...form, countryId: e.target.value })}
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
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="modal-submit" onClick={handleCreate}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="state-controls">
        <select>
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="actions">
          <button className="create-btn" onClick={() => setShowModal(true)}>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStates.map((state) => (
            <tr key={state.id}>
              <td>{state.name}</td>
              <td>{state.Country?.countryName}</td>
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
                <button className="edit-btn">i</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <span>{`Showing 1 to ${filteredStates.length} of ${filteredStates.length} entries`}</span>
        <div className="pages">
          <button>{"<"}</button>
          <button>1</button>
          <button>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default State;
