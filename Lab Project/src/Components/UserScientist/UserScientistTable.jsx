


// import React, { useState } from 'react'
// import { useNavigate } from "react-router-dom"
// import UserScientistForm from './UserScientistForm'
// import "../Style/FormTable.css"
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export default function UserScientistTable({ records, handleDelete }) {
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showForm, setShowForm] = useState(false); // 🔥 NEW

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
//   // 🔥 Landscape mode (important for many columns)
//   const doc = new jsPDF("landscape");

//   // Title
//   doc.setFontSize(14);
//   doc.text("User Scientist Records", 14, 15);

//   // Table data
//   const tableData = records.map((item) => [
//     item.empcode,
//     item.empid,
//     item.firstname,
//     item.lastname,
//     item.role,
//     item.dob,
//     item.password,
//     item.mobile,
//     item.address,
//     item.personalemail,
//     item.professionalemail,
//     item.labcode,
//     item.designcode,
//     item.department,
//     item.gender
//   ]);

//   // Table
//   autoTable(doc, {
//     startY: 20,
//     head: [[
//       "Emp Code",
//       "Emp ID",
//       "First Name",
//       "Last Name",
//       "Role",
//       "DOB",
//       "Password",
//       "Mobile",
//       "Address",
//       "Personal Email",
//       "Professional Email",
//       "Lab Code",
//       "Design Code",
//       "Department",
//       "Gender"
//     ]],
//     body: tableData,
//     theme: "grid",

//     // 🔥 important settings for large table
//     styles: {
//       fontSize: 6,
//       cellPadding: 2,
//     },
//     headStyles: {
//       fillColor: [0, 102, 204],
//       fontSize: 7
//     },

//     // auto wrap + fit
//     columnStyles: {
//       8: { cellWidth: 40 }, // address thoda bada
//     },

//     margin: { top: 20 },
//   });

//   doc.save("User_Scientist_Records.pdf");
// }
//   return (
//     <div className="main-content">
//       <div className="container-fluid mt-3" style={{ marginTop: "100px" }}>

//         <div className="card" style={{ marginTop: "30px" }}>

//           {/* 🔥 ADD BUTTON */}
//           <div className="d-flex justify-content-end p-3">
//             <button
//               className="btn btn-light"
//               onClick={() => setShowForm(!showForm)}
//             >
//               {showForm ? "✖ Close" : "+ Add User"}
//             </button>
//           </div>

//           {/* 🔥 FORM */}
//           {showForm && (
//             <div className="px-3">
//               <UserScientistForm />
//             </div>
//           )}

//           {/* HEADER */}
//           <div className="card-header">
//             <h5>User Scientist List</h5>
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
//             <div className="table-scroll" style={{ maxHeight: "700px", overflowY: "auto" }}>
//               <table className="table table-bordered all-table">
//                 <thead>
//                   <tr>
//                     <th>Emp Code</th>
//                     <th>Emp ID</th>
//                     <th>First Name</th>
//                     <th>Last Name</th>
//                     <th>Role</th>
//                     <th>DOB</th>
//                     <th>Password</th>
//                     <th>Mobile</th>
//                     <th>Address</th>
//                     <th>Personal Email</th>
//                     <th>Professional Email</th>
//                     <th>Lab Code</th>
//                     <th>Design Code</th>
//                     <th>Department</th>
//                     <th>Gender</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {currentData.length === 0 ? (
//                     <tr>
//                       <td colSpan="16" className="text-center">No Data Found</td>
//                     </tr>
//                   ) : (
//                     currentData.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.empcode}</td>
//                         <td>{item.empid}</td>
//                         <td>{item.firstname}</td>
//                         <td>{item.lastname}</td>
//                         <td>{item.role}</td>
//                         <td>{item.dob}</td>
//                         <td>{item.password}</td>
//                         <td>{item.mobile}</td>
//                         <td>{item.address}</td>
//                         <td>{item.personalemail}</td>
//                         <td>{item.professionalemail}</td>
//                         <td>{item.labcode}</td>
//                         <td>{item.designcode}</td>
//                         <td>{item.department}</td>
//                         <td>{item.gender}</td>

//                         <td>
//                           <button
//                             className="btn btn-sm btn-warning me-2"
//                             onClick={() => navigate(`/user/create/${index}`)}
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

//             {/* PAGINATION */}
//             <div className="d-flex justify-content-between align-items-center mt-3">
//               <div>
//                 Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1} to{" "}
//                 {Math.min(indexOfLast, filteredData.length)} of {filteredData.length}
//               </div>

//               <ul className="pagination mb-0">
//                 <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                   <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
//                 </li>

//                 {[...Array(totalPages)].map((_, i) => (
//                   <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
//                     <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
//                       {i + 1}
//                     </button>
//                   </li>
//                 ))}

//                 <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//                   <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
//                 </li>
//               </ul>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }