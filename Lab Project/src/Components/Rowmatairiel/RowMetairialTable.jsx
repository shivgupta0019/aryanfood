
// import React, { useState } from 'react'
// import { useNavigate } from "react-router-dom";
// import RowMetairialForm from './RowMetairialForm';
// import "../Style/FormTable.css"
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export default function RowMetairialTable({ records, handleDelete }) {
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showForm, setShowForm] = useState(false);

//   // Search
//   const filteredData = records.filter((item) =>
//     Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
//   );

//   // Pagination
//   const indexOfLast = currentPage * entries;
//   const indexOfFirst = indexOfLast - entries;
//   const currentData = filteredData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredData.length / entries);

//   function handleDownloadAll() {
//   const doc = new jsPDF();

//   // Title
//   doc.setFontSize(16);
//   doc.text("Raw Material Records", 14, 20);

//   // Table data
//   const tableData = records.map((item) => [
//     item.materialCode,
//     item.materialName,
//     item.category,
//     item.supplier,
//     item.storage
//   ]);

//   // Table
//   autoTable(doc, {
//     startY: 30,
//     head: [["Code", "Name", "Category", "Supplier", "Storage"]],
//     body: tableData,
//     theme: "grid",
//     styles: { fontSize: 10 },
//     headStyles: { fillColor: [0, 102, 204] },
//   });

//   doc.save("Raw_Material_Records.pdf");
// }
//   return (
//     <div className="main-content">
//       <div className="container-fluid mt-3" style={{ marginTop: "100px" }}>

//         <div className="card" style={{ marginTop: "30px" }}>

//           {/*  ADD BUTTON TOP RIGHT */}
//           <div className="d-flex justify-content-end p-3">
//             <button
//               className="btn btn-light"
//               onClick={() => setShowForm(!showForm)}
//             >
//               {showForm ? "✖ Close" : "+ Add Material"}
//             </button>

//           </div>

//           {/*  FORM SAME PLACE AS INSTRUMENT */}
//           {showForm && (
//             <div className="px-3">
//               <RowMetairialForm />
//             </div>
//           )}

//           {/*  HEADER (DOWN SHIFT) */}
//           <div className="card-header">
//             <h5>Raw Material List</h5>
//           </div>

//           <div className="card-body">

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

//             {/* TABLE */}
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
//                     <th>Code</th>
//                     <th>Name</th>
//                     <th>Category</th>
//                     <th>Supplier</th>
//                     <th>Storage</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {currentData.length === 0 ? (
//                     <tr>
//                       <td colSpan="6" className="text-center">
//                         No Data Found
//                       </td>
//                     </tr>
//                   ) : (
//                     currentData.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.materialCode}</td>
//                         <td>{item.materialName}</td>
//                         <td>{item.category}</td>
//                         <td>{item.supplier}</td>
//                         <td>{item.storage}</td>
//                         <td>
//                           <button
//                             className="btn btn-sm btn-warning me-2"
//                             onClick={() =>
//                               navigate(`/metairial/create/${index}`)
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

//             {/* PAGINATION */}
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