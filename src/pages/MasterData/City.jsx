import React, { useState } from "react";
import "./City.css";
import { FiEdit, FiDownload, FiMaximize2, FiFilter, FiTrash2 } from "react-icons/fi";

// Initial static data
const initialCities = [
  {
    id: 1,
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    status: true,
  },
  {
    id: 2,
    country: "USA",
    state: "California",
    city: "Los Angeles",
    status: true,
  },
  { id: 3, country: "UK", state: "England", city: "London", status: false },
];

const City = () => {
  const [cities, setCities] = useState(initialCities);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ country: "", state: "", city: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleCreateOrUpdate = () => {
    if (!form.city || !form.state || !form.country) {
      setError("All fields are required");
      return;
    }
    if (editingId !== null) {
      setCities((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...form } : c))
      );
    } else {
      const newId = cities.length
        ? Math.max(...cities.map((c) => c.id)) + 1
        : 1;
      setCities([...cities, { ...form, id: newId, status: true }]);
    }
    setShowModal(false);
    setForm({ country: "", state: "", city: "" });
    setEditingId(null);
    setError("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;
    setCities((prev) => prev.filter((c) => c.id !== id));
    setError("");
  };

  const toggleStatus = (id) => {
    setCities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: !c.status } : c))
    );
    setError("");
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

  const totalEntries = filteredCities.length;
  const totalPages = Math.ceil(totalEntries / pageSize);
  const paginatedCities = filteredCities.slice(
    (page - 1) * pageSize,
    page * pageSize
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
                  setError("");
                }}
              >
                Cancel
              </button>
              <button className="modal-submit" onClick={handleCreateOrUpdate}>
                {editingId !== null ? "Update" : "Submit"}
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}

      <div className="city-header">
        <select
          className="dropdown"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
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
              setError("");
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
          {paginatedCities.length > 0 ? (
            paginatedCities.map((city) => (
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
                    <FiTrash2 size={16} />
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
      <div className="pagination">
        <span>
          {`Showing ${
            totalEntries === 0 ? 0 : (page - 1) * pageSize + 1
          } to ${
            page * pageSize > totalEntries ? totalEntries : page * pageSize
          } of ${totalEntries} entries`}
        </span>
        <div className="pages">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            {"<"}
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              className={page === idx + 1 ? "active" : ""}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default City;
