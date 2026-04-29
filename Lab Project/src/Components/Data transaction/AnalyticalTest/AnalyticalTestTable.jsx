// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../Style/FormTable.css";
// import AnalyticalTestForm from "./AnalyticalTestForm";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export default function AnalyticalTestTable({ records, handleDelete }) {

//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showForm, setShowForm] = useState(false);

//   // 🔥 SEARCH
//   const filteredData = records.filter((item) =>
//     Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
//   );

//   // 🔥 PAGINATION
//   const indexOfLast = currentPage * entries;
//   const indexOfFirst = indexOfLast - entries;
//   const currentData = filteredData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredData.length / entries);

//   // 🔥 PDF DOWNLOAD
//   function handleDownloadAll() {
//     const doc = new jsPDF();

//     doc.setFontSize(16);
//     doc.text("Analytical Test Records", 14, 20);

//     const tableData = records.map((item) => [
//       item.testId,
//       item.labcode,
//       item.sampleId,
//       item.parameters,
//       item.method,
//       item.specification,
//       item.result,
//       item.unit,
//       item.status,
//       item.analyst,
//     ]);

//     autoTable(doc, {
//       startY: 30,
//       head: [[
//         "TestId",
//         "Labcode",
//         "SampleID",
//         "Parameters",
//         "Method",
//         "Specification",
//         "Result",
//         "Unit",
//         "Status",
//         "Analyst"
//       ]],
//       body: tableData,
//       theme: "grid",
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [0, 102, 204] },
//     });

//     doc.save("Analytical_Test_Records.pdf");
//   }

//   return (
//     <div className="main-content">
//       <div className="container-fluid mt-3" style={{ marginTop: "100px" }}>

//         <div className="card" style={{ marginTop: "30px" }}>

//           {/* 🔥 TOGGLE BUTTON */}
//           <div className="d-flex justify-content-end p-3">
//             <button
//               className="btn btn-light"
//               onClick={() => setShowForm(!showForm)}
//             >
//               {showForm ? "✖ Close" : "+ Add Analytical Test"}
//             </button>
//           </div>

//           {/* 🔥 FORM */}
//           {showForm && (
//             <div className="px-3">
//               <AnalyticalTestForm />
//             </div>
//           )}

//           {/* 🔥 HEADER */}
//           <div className="card-header">
//             <h5>Analytical Test List</h5>
//           </div>

//           <div className="card-body">

//             {/* 🔥 SEARCH + ENTRIES */}
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

//             {/* 🔥 TABLE */}
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
//                     <th>TestId</th>
//                     <th>Labcode</th>
//                     <th>SampleID</th>
//                     <th>Parameters</th>
//                     <th>Method</th>
//                     <th>Specification</th>
//                     <th>Result</th>
//                     <th>Unit</th>
//                     <th>Status</th>
//                     <th>Analyst</th>
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
//                         <td>{item.testId}</td>
//                         <td>{item.labcode}</td>
//                         <td>{item.sampleId}</td>
//                         <td>{item.parameters}</td>
//                         <td>{item.method}</td>
//                         <td>{item.specification}</td>
//                         <td>{item.result}</td>
//                         <td>{item.unit}</td>
//                         <td>{item.status}</td>
//                         <td>{item.analyst}</td>

//                         <td>
//                           {/* 🔥 EDIT */}
//                           <button
//                             className="btn btn-sm btn-warning me-2"
//                             onClick={() =>
//                               navigate(`/analytical/create/${index}`)
//                             }
//                           >
//                             <i className="fa-solid fa-pen"></i>
//                           </button>

//                           {/* 🔥 DELETE */}
//                           <button
//                             onClick={() => handleDelete(index)}
//                             className="btn btn-sm btn-danger"
//                           >
//                             <i className="fa-solid fa-trash"></i>
//                           </button>

//                           {/* 🔥 PDF */}
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

//             {/* 🔥 PAGINATION */}
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