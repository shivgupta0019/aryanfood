// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../Style/FormTable.css";
// import StudyForm from "./StudyForm";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export default function StudyTable({ records, handleDelete }) {
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showForm, setShowForm] = useState(false);

//   // 🔍 Search
//   const filteredData = records.filter((item) =>
//     Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
//   );

//   // 📄 Pagination
//   const indexOfLast = currentPage * entries;
//   const indexOfFirst = indexOfLast - entries;
//   const currentData = filteredData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredData.length / entries);

//   // 📥 PDF Download
//   function handleDownloadAll() {
//     const doc = new jsPDF();

//     doc.setFontSize(16);
//     doc.text("Study Records", 14, 20);

//     const tableData = records.map((item) => [
//       item.studyId,
//       item.project,
//       item.labcode,
//       item.storage,
//       item.interval,
//       item.results,
//     ]);

//     autoTable(doc, {
//       startY: 30,
//       head: [["Study ID", "Project", "Labcode", "Storage", "Interval", "Results"]],
//       body: tableData,
//       theme: "grid",
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [0, 102, 204] },
//     });

//     doc.save("Study_Records.pdf");
//   }

//   return (
//     <div className="main-content">
//       <div className="container-fluid mt-3" style={{ marginTop: "100px" }}>

//         <div className="card" style={{ marginTop: "30px" }}>
          
//           {/* ➕ Add Button */}
//           <div className="d-flex justify-content-end p-3">
//             <button
//               className="btn btn-light"
//               onClick={() => setShowForm(!showForm)}
//             >
//               {showForm ? "✖ Close" : "+ Add Study"}
//             </button>
//           </div>

//           {/* 🔥 FORM */}
//           {showForm && (
//             <div className="px-3">
//               <StudyForm />
//             </div>
//           )}

//           {/* 📌 Header */}
//           <div className="card-header">
//             <h5>Study List</h5>
//           </div>

//           <div className="card-body">

//             {/* 🔍 Search + Entries */}
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

//             {/* 📊 Table */}
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
//                     <th>Study ID</th>
//                     <th>Project</th>
//                     <th>Labcode</th>
//                     <th>Storage</th>
//                     <th>Interval</th>
//                     <th>Results</th>
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
//                         <td>{item.studyId}</td>
//                         <td>{item.project}</td>
//                         <td>{item.labcode}</td>
//                         <td>{item.storage}</td>
//                         <td>{item.interval}</td>
//                         <td>{item.results}</td>

//                         <td>
//                           {/* ✏️ EDIT */}
//                           <button
//                             className="btn btn-sm btn-warning me-2"
//                             onClick={() =>
//                               navigate(`/study/create/${index}`)
//                             }
//                           >
//                             <i className="fa-solid fa-pen"></i>
//                           </button>

//                           {/* 🗑 DELETE */}
//                           <button
//                             onClick={() => handleDelete(index)}
//                             className="btn btn-sm btn-danger"
//                           >
//                             <i className="fa-solid fa-trash"></i>
//                           </button>

//                           {/* 📥 DOWNLOAD */}
//                           <button
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

//             {/* 📄 Pagination */}
//             <div className="d-flex justify-content-between align-items-center mt-3">
//               <div>
//                 Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1} to{" "}
//                 {Math.min(indexOfLast, filteredData.length)} of{" "}
//                 {filteredData.length}
//               </div>

//               <ul className="pagination mb-0">
//                 <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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
//                     className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
//                   >
//                     <button
//                       className="page-link"
//                       onClick={() => setCurrentPage(i + 1)}
//                     >
//                       {i + 1}
//                     </button>
//                   </li>
//                 ))}

//                 <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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