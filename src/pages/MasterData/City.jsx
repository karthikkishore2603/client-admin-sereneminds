import React, { useState, useEffect } from 'react';
import './City.css';
import { FiEdit } from 'react-icons/fi';

const City = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ country: '', state: '', city: '' });
  const [searchTerm, setSearchTerm] = useState('');

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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cities`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setCities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCities();
  }, []);

  // Create new city
  const handleCreate = async () => {
    if (!form.city || !form.state || !form.country) {
      setError('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: form.country,
          state: form.state,
          city: form.city,
          status: false
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create city');
      
      const newCity = await response.json();
      setCities([...cities, newCity]);
      setForm({ country: '', state: '', city: '' });
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle city status
  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cities/${id}/toggle-status`, {
        method: 'PATCH',
      });
      
      if (!response.ok) throw new Error('Failed to toggle status');
      
      const updatedCity = await response.json();
      setCities(cities.map(city => 
        city.id === updatedCity.id ? updatedCity : city
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter cities based on search term
  const filteredCities = cities.filter(city =>
    city.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading cities...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="city-container">
      {showModal && (


  <div className="modal-overlay">
    <div className="city-modal">
      <h3 className="modal-title">Add New City</h3>
      <input
        type="text"
        className="modal-input"
        placeholder="Country Name"
        value={form.country}
        onChange={(e) => setForm({ ...form, country: e.target.value })}
      />
      <input
        type="text"
        className="modal-input"
        placeholder="State Name"
        value={form.state}
        onChange={(e) => setForm({ ...form, state: e.target.value })}
      />
      <input
        type="text"
        className="modal-input"
        placeholder="City Name"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
      />
      <div className="modal-actions">
        <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
        <button className="modal-submit" onClick={handleCreate}>Submit</button>
      </div>
    </div>
  </div>
)}


      <div className="city-header">
        <select className="dropdown">
          <option>10</option>
        </select>

        <input
          type="text"
          className="search-input"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="actions">
          <button className="create-btn" onClick={() => setShowModal(true)}>+ Create</button>
          <button className="icon-btn">⏬</button>
          <button className="icon-btn">⤢</button>
          <button className="icon-btn">🔍</button>
        </div>
      </div>

      <table className="city-table">
        <thead>
          <tr>
            <th>City Name</th>
            <th>State</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <tr key={city.id}>
                <td className="city-name">{city.city}</td>
                <td>{city.state}</td>
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
                  <button className="edit-btn">
                    <FiEdit size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-cities">No cities found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default City;