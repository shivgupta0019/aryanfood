// import React, { useState } from 'react'
// import { useNavigate } from "react-router-dom"
// export default function TestTable({records, handleDelete}) {
//     const navigate = useNavigate();
    
//       const [search, setSearch] = useState("");
//       const [entries, setEntries] = useState(5);
//       const [currentPage, setCurrentPage] = useState(1);
    
//       //  Search filter
//       const filteredData = records.filter((item) =>
//         Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
//       );
    
//       //  Pagination
//       const indexOfLast = currentPage * entries;
//       const indexOfFirst = indexOfLast - entries;
//       const currentData = filteredData.slice(indexOfFirst, indexOfLast);
    
//       const totalPages = Math.ceil(filteredData.length / entries);
    
//   return (
//     <>
//       <div className="container-fluid mt-3 " style={{marginTop:"100px"}}>
//       <div className="card" style={{marginTop:"100px"}}>

//         {/* Header */}
//         <div
//           className="card-header d-flex justify-content-between align-items-center"
//           style={{ background: "#3fb4b6", color: "white" }}
//         >
//           <h5>Test List</h5>

//           <button
//             className="btn btn-light"
//             onClick={() => navigate("/test/create")}
//           >
//             + Add Test
//           </button>
//         </div>

//         <div className="card-body">

//           {/* Search + Entries */}
//           <div className="d-flex justify-content-between mb-3">
//             <div>
//               Show
//               <select
//                 className="mx-2 entries-select"
//                 value={entries}
//                 onChange={(e) => {
//                   setEntries(Number(e.target.value));
//                   setCurrentPage(1);
//                 }}
//               >
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//               </select>
//               entries
//             </div>

//             <div>
//               Search :
//               <input
//                 type="text"
//                 className="ms-2 search-box"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//           </div>

    
//      {/* Table */}
//           <div
//             className="table-scroll"
//             style={{ maxHeight: "500px", overflowY: "auto" }}
//           >
//             <table className="table table-bordered all-table">
//               <thead>
//                 <tr>
//             <th>Test ID</th>
//             <th>Test Name</th>
//             <th>Lab Code</th>
//             <th>Method</th>
//             <th>Unit</th>
//           </tr>
//         </thead>

//         <tbody>
//            {currentData.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="text-center">
//                       No Data Found
//                     </td>
//                   </tr>
//                 ) : (
//           currentData.map((item, index) => (
//                     <tr key={index}>
//                 <td>{item.testid}</td>
//                 <td>{item.testname}</td>
//                 <td>{item.labcode}</td>
//                 <td>{item.method}</td>
//                 <td>{item.unit}</td>
//                 <td>
//                    <button
//                           className="btn btn-sm btn-warning me-2"
//                           onClick={() =>
//                             navigate(`/test/create/${item.id}`)
//                           }
//                         >
//                           <i className="fa-solid fa-pen"></i>
//                         </button>

//                         <button
//                           onClick={() => handleDelete(item.id)}
//                           className="btn btn-sm btn-danger"
//                         >
//                           <i className="fa-solid fa-trash"></i>
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="d-flex justify-content-between align-items-center mt-3">
//             <div>
//               Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1} to{" "}
//               {Math.min(indexOfLast, filteredData.length)} of{" "}
//               {filteredData.length}
//             </div>

//             <ul className="pagination mb-0">
//               <li
//                 className={`page-item ${
//                   currentPage === 1 ? "disabled" : ""
//                 }`}
//               >
//                 <button
//                   className="page-link"
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                 >
//                   Prev
//                 </button>
//               </li>

//               {[...Array(totalPages)].map((_, i) => (
//                 <li
//                   key={i}
//                   className={`page-item ${
//                     currentPage === i + 1 ? "active" : ""
//                   }`}
//                 >
//                   <button
//                     className="page-link"
//                     onClick={() => setCurrentPage(i + 1)}
//                   >
//                     {i + 1}
//                   </button>
//                 </li>
//               ))}

//               <li
//                 className={`page-item ${
//                   currentPage === totalPages ? "disabled" : ""
//                 }`}
//               >
//                 <button
//                   className="page-link"
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                 >
//                   Next
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   )
// }

// import React, { useState } from 'react'
// import "../Style/FormTable.css"
// import TestForm from './TestForm';
// import { useNavigate } from 'react-router-dom';
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export default function TestTable({
//   records,
//   handleDelete,
//   handleCreate,
//   handleEdit,
//   showForm,
//   setShowForm,
//   editData,
//   editIndex
// }) {

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);

//   const filteredData = records.filter((item) =>
//     Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
//   );

//   const indexOfLast = currentPage * entries;
//   const indexOfFirst = indexOfLast - entries;
//   const currentData = filteredData.slice(indexOfFirst, indexOfLast);

//   const totalPages = Math.ceil(filteredData.length / entries);
//       const navigate = useNavigate()

//     function handleDownloadAll() {
//   const doc = new jsPDF();

//   // Title
//   doc.setFontSize(16);
//   doc.text("Test Records", 14, 20);

//   // Table data
//   const tableData = records.map((item) => [
//     item.testid,
//     item.testname,
//     item.labcode,
//     item.method,
//     item.unit
//   ]);

//   // Table
//   autoTable(doc, {
//     startY: 30,
//     head: [["Test ID", "Test Name", "Lab Code", "Method", "Unit"]],
//     body: tableData,
//     theme: "grid",
//     styles: { fontSize: 10 },
//     headStyles: { fillColor: [0, 102, 204] },
//   });

//   doc.save("Test_Records.pdf");
// }  
//   return (
//     <div className='main-content'>
//       <div className="container-fluid mt-3" style={{ marginTop: "100px" }}>
//         <div className="card" style={{ marginTop: "30px" }}>

//           {/* ADD BUTTON */}
//           <div className="d-flex justify-content-end p-3">
//             <button
//               className="btn btn-light"
//               onClick={() => setShowForm(!showForm)}
//             >
//               {showForm ? "✖ Close" : "+ Add Test"}
//             </button>
//           </div>

//           {/* 🔥 FORM SAME PLACE */}
//           {/* {showForm && (
//             <div className="px-3">
//               <TestForm editData={editData} editIndex={editIndex} />
//             </div>
//           )} */}
          

//           {showForm && (
//   <div className="px-3">
//     <TestForm />   
//   </div>
// )}

//           {/* HEADER */}
//           <div className="card-header">
//             <h5>Test List</h5>
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
//             <div className="table-scroll" style={{ maxHeight: "500px", overflowY: "auto" }}>
//               <table className="table table-bordered all-table">
//                 <thead>
//                   <tr>
//                     <th>Test ID</th>
//                     <th>Test Name</th>
//                     <th>Lab Code</th>
//                     <th>Method</th>
//                     <th>Unit</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {currentData.length === 0 ? (
//                     <tr>
//                       <td colSpan="6" className="text-center">No Data Found</td>
//                     </tr>
//                   ) : (
//                     currentData.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.testid}</td>
//                         <td>{item.testname}</td>
//                         <td>{item.labcode}</td>
//                         <td>{item.method}</td>
//                         <td>{item.unit}</td>

//                         <td>
//                           <button
//                             className="btn btn-sm btn-warning me-2"
//                             // onClick={() => handleEdit(index)}
//                            onClick={() => navigate(`/test/create/${item.id}`)}
//                           >
//                             <i className="fa-solid fa-pen"></i>
//                           </button>

//                           <button
//                             onClick={() => handleDelete(item.id)}
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

//             {/* PAGINATION */}
//             <div className="d-flex justify-content-between align-items-center mt-3">
//               <div>
//                 Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1} to{" "}
//                 {Math.min(indexOfLast, filteredData.length)} of{" "}
//                 {filteredData.length}
//               </div>

//               <ul className="pagination mb-0">
//                 <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                   <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
//                     Prev
//                   </button>
//                 </li>

//                 {[...Array(totalPages)].map((_, i) => (
//                   <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
//                     <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
//                       {i + 1}
//                     </button>
//                   </li>
//                 ))}

//                 <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//                   <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
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