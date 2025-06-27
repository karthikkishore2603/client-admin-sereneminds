import React, { useState } from "react";
import "./Institute.css";
import { FiEdit, FiFilter, FiDownload, FiMaximize2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const initialInstitutes = Array.from({ length: 28 }, (_, i) => ({
  id: 951200 + i + 1,
  name: "Example University",
  email: "Example@gmail.com",
  phone: "9876543210",
  address: "Address Line 1, Address Line 2, City, State, Pincode",
  status: i % 2 === 0,
}));

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Institute = () => {
  const [institutes, setInstitutes] = useState(initialInstitutes);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const toggleStatus = (id) => {
    setInstitutes((insts) =>
      insts.map((inst) =>
        inst.id === id ? { ...inst, status: !inst.status } : inst
      )
    );
  };

  const filteredInstitutes = institutes.filter((inst) =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const total = filteredInstitutes.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredInstitutes.slice(startIdx, endIdx);

  return (
    <div className="institute-container">
      <div className="institute-header">
        <select
          className="dropdown"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          {PAGE_SIZE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="search-input"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <div className="actions">
          <button
            className="create-btn"
            onClick={() => navigate("/institute/create")}
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
      <table className="institute-table">
        <thead>
          <tr>
            <th>Institute Name</th>
            <th>Email ID</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((inst, idx) => (
            <tr key={inst.id}>
              <td>
                <div className="inst-name">{inst.name}</div>
                <div className="inst-id">{inst.id}</div>
              </td>
              <td>
                <div>{inst.email}</div>
                <div className="inst-id">{inst.email}</div>
              </td>
              <td>
                <div>{inst.phone}</div>
                <div className="inst-id">{inst.phone}</div>
              </td>
              <td style={{ whiteSpace: "pre-line" }}>{inst.address}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={inst.status}
                    onChange={() => toggleStatus(inst.id)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/institute/overview/${inst.id}`)}
                >
                  <FiEdit size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="institute-footer">
        <div className="footer-text">
          Showing {total === 0 ? 0 : startIdx + 1} to {endIdx} of {total}{" "}
          entries
        </div>
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Institute;
