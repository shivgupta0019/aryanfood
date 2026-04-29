import React, { useState } from 'react'
import { useNavigate ,Link} from "react-router-dom"
import ProjectForm from './ProjectForm'
import "../Style/FormTable.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ProjectTable({ records, handleDelete }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false); 

  // Search
  const filteredData = records.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / entries);

  function handleDownloadAll() {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text("Project Records", 14, 20);

  // Table data
  const tableData = records.map((item) => [
    item.projectId,
    item.projectName,
    item.objective,
    item.startDate,
    item.endDate,
    item.status
  ]);

  // Table generate
  autoTable(doc, {
    startY: 30,
    head: [["ID", "Name", "Objective", "Start Date", "End Date", "Status"]],
    body: tableData,
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 102, 204] },
  });

  doc.save("Project_Records.pdf");
}
  return (
    <div className="main-content">
      <div className="container-fluid mt-3" style={{ marginTop: "100px" }}>

        <div className="card" style={{ marginTop: "30px" }}>

          {/*  ADD BUTTON TOP RIGHT */}
          <div className="d-flex justify-content-end p-3">
            <button
              className="btn btn-light">
               <Link  to="/project/projectlist" style={{textDecoration:"none", color:"black", margin:"20px"}} >+Project List</Link>
              </button>
            
              
            <button
              className="btn btn-light"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "✖ Close" : "+ Add Project"}
            </button>
          </div>

          {/* 🔥 FORM SAME PLACE */}
          {showForm && (
            <div className="px-3">
              <ProjectForm />
            </div>
          )}

          {/* HEADER */}
          <div className="card-header">
            <h5>Project List</h5>
          </div>

          <div className="card-body">

            {/* Search + Entries */}
            <div className="d-flex justify-content-between mb-3">
              <div>
                Show
                <select
                  className="mx-2 entries-select"
                  value={entries}
                  onChange={(e) => {
                    setEntries(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                </select>
                entries
              </div>

              <div>
                Search :
                <input
                  type="text"
                  className="ms-2 search-box"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* TABLE */}
            <div
              className="table-scroll"
              style={{ maxHeight: "700px", overflowY: "auto" }}
            >
              <table className="table table-bordered all-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Objective</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No Data Found
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.projectId}</td>
                        <td>{item.projectName}</td>
                        <td>{item.objective}</td>
                        <td>{item.startDate}</td>
                        <td>{item.endDate}</td>
                        <td>{item.status}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning ms-2" 
                            onClick={() =>
                              navigate(`/project/create/${index}`)
                            }
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>

                          <button
                            onClick={() => handleDelete(index)}
                            className="btn btn-sm btn-danger ms-2 "
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                           <button
                            className="btn btn-sm btn-success ms-2"
                            onClick={handleDownloadAll}
                          >
                            <i className="fa-solid fa-download"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1} to{" "}
                {Math.min(indexOfLast, filteredData.length)} of{" "}
                {filteredData.length}
              </div>

              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Prev
                  </button>
                </li>

                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
