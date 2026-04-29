// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../Style/FormTable.css"
// import InstrumentForm from "./InstrumentForm";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export default function InstrumentTable({ records, handleDelete }) {
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showForm, setShowForm] = useState(false);

//   //  Search filter
//   const filteredData = records.filter((item) =>
//     Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase()),
//   );

//   //  Pagination
//   const indexOfLast = currentPage * entries;
//   const indexOfFirst = indexOfLast - entries;
//   const currentData = filteredData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredData.length / entries);

//   function handleDownloadAll() {
//       const doc = new jsPDF();
  
//       // Title
//       doc.setFontSize(16);
//       doc.text("Central Lab Records", 14, 20);
  
//       // records props se data lo
//       const tableData = records.map((item) => [
//         item.instrumentId,
//         item.instrumentName,
//         item.labId,
//         item.model,
//         item.calibrationDate,
//         item.status
//       ]);
  
//       autoTable(doc, {
//         startY: 30,
//         head: [["instrumentId", "instrumentName", "labId", "model","calibrationDate","status"]],
//         body: tableData,
//         theme: "grid",
//         styles: { fontSize: 10 },
//         headStyles: { fillColor: [0, 102, 204] },
//       });
  
//       doc.save("Instrument_Lab_Records.pdf");
//     }
//   return (
//     <div className="main-content">
//       {/* form + table */}

//       <div className="container-fluid mt-3 " style={{ marginTop: "100px" }}>

//         <div className="card" style={{ marginTop: "30px" }}>
//           <div className="d-flex justify-content-end p-3">
//             <button
//               className="btn btn-light"
//               onClick={() => setShowForm(!showForm)}
//             >
//               {showForm ? "✖ Close" : "+ Add Instrument"}
//             </button>
//           </div>

//           {/* 🔥 FORM */}
//           {showForm && (
//             <div className="px-3">
//               <InstrumentForm />
//             </div>
//           )}

//           {/* 🔥 HEADER (NOW MOVES DOWN) */}
//           <div className="card-header">
//             <h5>Instrument List</h5>
//           </div>

//           <div className="card-body">
//             {/* {showForm && (
//   <div className="mb-3">
//     <InstrumentForm/>
//   </div>
// )} */}

//             {/* Search + Entries */}
//             <div className="d-flex justify-content-between mb-3">
//               <div>
//                 Show
//                 <select
//                   className="mx-2 entries-select"
//                   value={entries}
//                   onChange={(e) => {
//                     setEntries(Number(e.target.value));
//                     setCurrentPage(1);
//                   }}
//                 >
//                   <option value={5}>5</option>
//                   <option value={10}>10</option>
//                   <option value={25}>25</option>
//                 </select>
//                 entries
//               </div>

//               <div>
//                 Search :
//                 <input
//                   type="text"
//                   className="ms-2 search-box"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* Table */}
//             <div
//               className="table-scroll"
//               style={{
//                 overflowX: "auto",
//                 maxHeight: "700px",
//                 overflowY: "auto",
//               }}
//             >
//               <table className="table table-bordered all-table">
//                 <thead>
//                   <tr>
//                     <th>Instrument ID</th>
//                     <th>Name</th>
//                     <th>Lab</th>
//                     <th>Model</th>
//                     <th>Date</th>
//                     <th>Status</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {currentData.length === 0 ? (
//                     <tr>
//                       <td colSpan="7" className="text-center">
//                         No Data Found
//                       </td>
//                     </tr>
//                   ) : (
//                     currentData.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.instrumentId}</td>
//                         <td>{item.instrumentName}</td>
//                         <td>{item.labId}</td>
//                         <td>{item.model}</td>
//                         <td>{item.calibrationDate}</td>
//                         <td>{item.status}</td>
//                         <td>
//                           <button
//                             className="btn btn-sm btn-warning me-2"
//                             onClick={() =>
//                                navigate(`/instrument/create/${index}`)
//                             }
//                           >
//                             <i className="fa-solid fa-pen"></i>
//                           </button>

//                           <button
//                             onClick={() => handleDelete(index)}
//                             className="btn btn-sm btn-danger"
//                           >
//                             <i className="fa-solid fa-trash"></i>
//                           </button>
//                            <button
//                             className="btn btn-sm btn-success ms-2"
//                             onClick={handleDownloadAll}
//                           >
//                             <i className="fa-solid fa-download"></i>
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="d-flex justify-content-between align-items-center mt-3">
//               <div>
//                 Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1} to{" "}
//                 {Math.min(indexOfLast, filteredData.length)} of{" "}
//                 {filteredData.length}
//               </div>

//               <ul className="pagination mb-0">
//                 <li
//                   className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => setCurrentPage(currentPage - 1)}
//                   >
//                     Prev
//                   </button>
//                 </li>

//                 {[...Array(totalPages)].map((_, i) => (
//                   <li
//                     key={i}
//                     className={`page-item ${
//                       currentPage === i + 1 ? "active" : ""
//                     }`}
//                   >
//                     <button
//                       className="page-link"
//                       onClick={() => setCurrentPage(i + 1)}
//                     >
//                       {i + 1}
//                     </button>
//                   </li>
//                 ))}

//                 <li
//                   className={`page-item ${
//                     currentPage === totalPages ? "disabled" : ""
//                   }`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => setCurrentPage(currentPage + 1)}
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }