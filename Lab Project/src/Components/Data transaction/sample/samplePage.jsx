// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// import SampleForm from "../sample/SampleForm";
// import SampleTable from "../sample/sampleTable";

// export default function SamplePage() {
//   const [records, setRecords] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editData, setEditData] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   const location = useLocation();

//   // 🔥 Load data from localStorage
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("sample")) || [];
//     setRecords(stored);
//   }, [location]);

//   // 🔥 CREATE + UPDATE (same logic)
//   function handleSave(data) {
//     if (editIndex !== null) {
//       const updated = [...records];
//       updated[editIndex] = data;
//       setRecords(updated);
//       setEditIndex(null);
//       setEditData(null);
//     } else {
//       setRecords([...records, data]);
//     }

//     setShowForm(false);
//   }

//   // 🔥 CREATE
//   function handleCreate() {
//     setEditIndex(null);
//     setEditData(null);
//     setShowForm(true);
//   }

//   // 🔥 EDIT
//   function handleEdit(index) {
//     setEditIndex(index);
//     setEditData(records[index]);
//     setShowForm(true);
//   }

//   // 🔥 DELETE
//   function handleDelete(index) {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this record?"
//     );

//     if (confirmDelete) {
//       const filtered = records.filter((_, i) => i !== index);
//       setRecords(filtered);

//       localStorage.setItem("sample", JSON.stringify(filtered));
//     }
//   }

//   return (
//     <>
//       <SampleTable
//         records={records}
//         handleEdit={handleEdit}   //  IMPORTANT
//         handleDelete={handleDelete}
//         handleCreate={handleCreate}
//       />

//       {showForm && (
//         <SampleForm
//           handleSave={handleSave}   //  IMPORTANT
//           editData={editData}
//           editIndex={editIndex}
//         />
//       )}
//     </>
//   );
// }