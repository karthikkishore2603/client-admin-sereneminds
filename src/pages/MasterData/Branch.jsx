import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiFilter, FiDownload, FiMaximize2 } from "react-icons/fi";
import "./Branch.css";

const initialBranches = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  name: "Example Branch Name",
  code: "951203",
  institute: "Example Institute Name",
  instituteCode: "951203",
  phone: "9876543210",
  address: "Address Line 1, Address Line 2, City, State, Pincode",
  status: i % 2 === 0,
}));

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const Branch = () => {
  const [branches, setBranches] = useState(initialBranches);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const toggleStatus = (id) => {
    setBranches((prev) =>
      prev.map((branch) =>
        branch.id === id ? { ...branch, status: !branch.status } : branch
      )
    );
  };

  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.institute.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const total = filteredBranches.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredBranches.slice(startIdx, endIdx);

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
          placeholder="Search by branch or institute..."
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
            onClick={() => navigate("/branch/create")}
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
            <th>Branch Name</th>
            <th>Institute</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((branch) => (
            <tr key={branch.id}>
              <td>
                <div className="branch-name">{branch.name}</div>
                <div className="branch-code">{branch.code}</div>
              </td>
              <td>
                <div className="institute-name">{branch.institute}</div>
                <div className="institute-code">{branch.instituteCode}</div>
              </td>
              <td>
                <div>{branch.phone}</div>
                <div className="branch-code">{branch.phone}</div>
              </td>
              <td style={{ whiteSpace: "pre-line" }}>{branch.address}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={branch.status}
                    onChange={() => toggleStatus(branch.id)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/branch/overview/${branch.id}`)}
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

export default Branch;
