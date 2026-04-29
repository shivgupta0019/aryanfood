// import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom';
// import TestTable from './TestTable';
// import TestForm from './TestFrom';
// import axios from "axios";


// export default function TestPage() {
//     const [records, setRecords] = useState([]);
//     const [editIndex, setEditIndex] = useState(null);
//     const [editData, setEditData] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     const location = useLocation();

//     useEffect(() => {
//         fetchData();
//     }, [location]);

//     async function fetchData() {
//         try {
//             const res = await axios.get("http://localhost:3000/test");
//             setRecords(res.data);
//         } catch (err) {
//             console.log(err);
//         }
//     }
//     // CREATE + UPDATE
//     function handleSave(data) {
//         if (editIndex !== null) {
//             const updated = [...records];
//             updated[editIndex] = data;
//             setRecords(updated);
//             setEditIndex(null);
//             setEditData(null);
//         } else {
//             setRecords([...records, data]);
//         }

//         setShowForm(false); //  form close
//     }

//     // CREATE
//     function handleCreate() {
//         setEditIndex(null);
//         setEditData(null);
//         setShowForm(true); //  form open
//     }

//     // EDIT
//     function handleEdit(index) {
//         setEditIndex(index);
//         setEditData(records[index]);
//         setShowForm(true); //  form open
//     }

//     // DELETE
//    async function handleDelete(id) {
//   const confirmDelete = window.confirm("Delete?");
//   if (confirmDelete) {
//     await axios.delete(`http://localhost:3000/test/${id}`);
//     fetchData();
//   }
// }
//     return (
//         <>
//             <TestTable
//                 records={records}
//                 handleEdit={handleEdit}
//                 handleDelete={handleDelete}
//                 handleCreate={handleCreate}
//             />
//             {showForm && (
//                 <TestForm

//                     handleSave={handleSave}
//                     editData={editData}
//                     editIndex={editIndex}
//                 />
//             )}
//         </>
//     )
// }


// import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom';
// import TestTable from './TestTable';
// import axios from "axios";

// export default function TestPage() {
//   const [records, setRecords] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editData, setEditData] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   const location = useLocation();

//   useEffect(() => {
//     fetchData();
//   }, [location]);

//   async function fetchData() {
//     try {
//       const res = await axios.get("http://localhost:3000/test");
//       setRecords(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   // CREATE
//   function handleCreate() {
//     setEditIndex(null);
//     setEditData(null);
//     setShowForm(true);
//   }

//   // EDIT
//   function handleEdit(index) {
//     setEditIndex(index);
//     setEditData(records[index]);
//     setShowForm(true);
//   }

//   // DELETE
//   async function handleDelete(id) {
//     const confirmDelete = window.confirm("Delete?");
//     if (confirmDelete) {
//       await axios.delete(`http://localhost:3000/test/${id}`);
//       fetchData();
//     }
//   }

//   return (
//     <TestTable
//       records={records}
//       handleDelete={handleDelete}
//       handleCreate={handleCreate}
//       handleEdit={handleEdit}
//       showForm={showForm}
//       setShowForm={setShowForm}
//       editData={editData}
//       editIndex={editIndex}
//     />
//   )
// }