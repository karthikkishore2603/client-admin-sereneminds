import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiFilter, FiDownload, FiMaximize2 } from "react-icons/fi";
import "./Branch.css";

const initialClasses = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  name: "XII th Std",
  code: "57893145",
  school: "Example School",
  schoolCode: "57893145",
  status: i % 2 === 0,
}));

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const ClassPage = () => {
  const [classes, setClasses] = useState(initialClasses);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const toggleStatus = (id) => {
    setClasses((prev) =>
      prev.map((cls) => (cls.id === id ? { ...cls, status: !cls.status } : cls))
    );
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const total = filteredClasses.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIdx = (page - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paginated = filteredClasses.slice(startIdx, endIdx);

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
            onClick={() => navigate("/class/create")}
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
            <th>Class</th>
            <th>School</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((cls) => (
            <tr key={cls.id}>
              <td>
                <div className="branch-name">{cls.name}</div>
                <div className="branch-code">{cls.code}</div>
              </td>
              <td>
                <div className="branch-name">{cls.school}</div>
                <div className="branch-code">{cls.schoolCode}</div>
              </td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={cls.status}
                    onChange={() => toggleStatus(cls.id)}
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/class/overview/${cls.id}`)}
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

export default ClassPage;
