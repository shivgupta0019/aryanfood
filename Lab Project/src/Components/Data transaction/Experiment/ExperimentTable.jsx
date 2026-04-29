// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../Style/FormTable.css";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import ExperimentForm from "./ExperimentForm";

// export default function ExperimentTable({ records, handleDelete }) {
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showForm, setShowForm] = useState(false);

//   // 🔍 Search filter (same)
//   const filteredData = records.filter((item) =>
//     Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
//   );

//   // 📄 Pagination (same)
//   const indexOfLast = currentPage * entries;
//   const indexOfFirst = indexOfLast - entries;
//   const currentData = filteredData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredData.length / entries);

//   // 📥 PDF Download (same logic)
//   function handleDownloadAll() {
//     const doc = new jsPDF();

//     doc.setFontSize(16);
//     doc.text("Experiment Records", 14, 20);

//     const tableData = records.map((item) => [
//       item.experimentId,
//       item.labCode,
//       item.project,
//       item.scientist,
//       item.method,
//       item.instrumentResult,
//       item.reagent,
//       item.procedure,
//       item.observation,
//       item.conclusion,
//     ]);

//     autoTable(doc, {
//       startY: 30,
//       head: [
//         [
//           "Experiment ID",
//           "Lab Code",
//           "Project",
//           "Scientist",
//           "Method",
//           "Result",
//           "Reagent",
//           "Procedure",
//           "Observation",
//           "Conclusion",
//         ],
//       ],
//       body: tableData,
//       theme: "grid",
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [0, 102, 204] },
//     });

//     doc.save("Experiment_Records.pdf");
//   }

//   return (
//     <div className="main-content">
//       <div className="container-fluid mt-3" style={{ marginTop: "100px" }}>

//         <div className="card" style={{ marginTop: "30px" }}>

//           {/* ➕ ADD BUTTON (same toggle) */}
//           <div className="d-flex justify-content-end p-3">
//             <button
//               className="btn btn-light"
//               onClick={() => setShowForm(!showForm)}
//             >
//               {showForm ? "✖ Close" : "+ Add Experiment"}
//             </button>
//           </div>

//           {/* 🔥 FORM (same position) */}
//           {showForm && (
//             <div className="px-3">
//               <ExperimentForm />
//             </div>
//           )}

//           {/* 🔥 HEADER */}
//           <div className="card-header">
//             <h5>Experiment List</h5>
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

//             {/* 📊 TABLE */}
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
//                     <th>ID</th>
//                     <th>Lab</th>
//                     <th>Project</th>
//                     <th>Scientist</th>
//                     <th>Method</th>
//                     <th>Result</th>
//                     <th>Reagent</th>
//                     <th>Procedure</th>
//                     <th>Observation</th>
//                     <th>Conclusion</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {currentData.length === 0 ? (
//                     <tr>
//                       <td colSpan="11" className="text-center">
//                         No Data Found
//                       </td>
//                     </tr>
//                   ) : (
//                     currentData.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.experimentId}</td>
//                         <td>{item.labCode}</td>
//                         <td>{item.project}</td>
//                         <td>{item.scientist}</td>
//                         <td>{item.method}</td>
//                         <td>{item.instrumentResult}</td>
//                         <td>{item.reagent}</td>
//                         <td>{item.procedure}</td>
//                         <td>{item.observation}</td>
//                         <td>{item.conclusion}</td>

//                         <td>
//                           {/* ✏️ EDIT (FIXED SAME AS INSTRUMENT) */}
//                           <button
//                             className="btn btn-sm btn-warning me-2"
//                             onClick={() =>
//                               navigate(`/experiment/create/${index}`)
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

//                           {/* 📥 PDF */}
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

//             {/* 📄 PAGINATION */}
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