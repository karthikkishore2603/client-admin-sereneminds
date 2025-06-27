import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiFilter, FiDownload, FiMaximize2 } from "react-icons/fi";
import "./Branch.css";

const initialSchools = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  name: "Example School Name",
  code: "951203",
  institute: "Example Institute Name",
  instituteCode: "951203",
  branch: "Example Branch Name",
  branchCode: "951203",
  type: "Govt Aided",
  typeCode: "951203",
  status: i % 2 === 0,
}));

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const School = () => {
  const [schools, setSchools] = useState(initialSchools);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const toggleStatus = (id) => {
    setSchools((prev) =>
      prev.map((school) =>
        school.id === id ? { ...school, status: !school.status } : school
      )
    );
  };

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.institute.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const total = filteredSchools.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredSchools.slice(startIdx, endIdx);

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
            onClick={() => navigate("/school/create")}
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
            <th>School Name</th>
            <th>Institute</th>
            <th>Branch</th>
            <th>School Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((school) => (
            <tr key={school.id}>
              <td>
                <div className="branch-name">{school.name}</div>
                <div className="branch-code">{school.code}</div>
              </td>
              <td>
                <div className="institute-name">{school.institute}</div>
                <div className="institute-code">{school.instituteCode}</div>
              </td>
              <td>
                <div className="branch-name">{school.branch}</div>
                <div className="branch-code">{school.branchCode}</div>
              </td>
              <td>
                <div className="branch-name">{school.type}</div>
                <div className="branch-code">{school.typeCode}</div>
              </td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={school.status}
                    onChange={() => toggleStatus(school.id)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/school/overview/${school.id}`)}
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

export default School;
