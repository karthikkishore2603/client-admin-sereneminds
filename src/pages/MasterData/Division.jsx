import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiFilter, FiDownload, FiMaximize2 } from "react-icons/fi";
import "./Branch.css";

const initialDivisions = [
  { id: 1, name: "A Division", code: "57893145", status: false },
  { id: 2, name: "B Division", code: "57893145", status: true },
  { id: 3, name: "C Division", code: "57893145", status: true },
  { id: 4, name: "D Division", code: "57893145", status: false },
  { id: 5, name: "E Division", code: "57893145", status: false },
  { id: 6, name: "F Division", code: "57893145", status: false },
  { id: 7, name: "G Division", code: "57893145", status: true },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Division = () => {
  const [divisions, setDivisions] = useState(initialDivisions);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const toggleStatus = (id) => {
    setDivisions((prev) =>
      prev.map((div) => (div.id === id ? { ...div, status: !div.status } : div))
    );
  };

  const filteredDivisions = divisions.filter((div) =>
    div.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const total = filteredDivisions.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredDivisions.slice(startIdx, endIdx);

  return (
    <div className="branch-container">
      <div className="branch-header">
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
          placeholder="Search"
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <div className="actions">
          <button
            className="create-btn"
            onClick={() => navigate("/division/create")}
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
      <table className="branch-table">
        <thead>
          <tr>
            <th>Division Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((div) => (
            <tr key={div.id}>
              <td>
                <div className="branch-name">{div.name}</div>
                <div className="branch-code">{div.code}</div>
              </td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={div.status}
                    onChange={() => toggleStatus(div.id)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/division/overview/${div.id}`)}
                >
                  <FiEdit size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="branch-footer">
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

export default Division;
