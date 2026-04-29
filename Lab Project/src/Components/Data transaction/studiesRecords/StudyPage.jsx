// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// import StudyForm from "./StudyForm";
// import StudyTable from "./StudyTable";

// export default function StudyPage() {
//   const [records, setRecords] = useState([]);
//   const [editIndex, setEditIndex] = useState(null);
//   const [editData, setEditData] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   const location = useLocation();

//   // LOAD DATA
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("study")) || [];
//     setRecords(stored);
//   }, [location]);

//   // CREATE + UPDATE
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

//   // CREATE BUTTON
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
//   function handleDelete(index) {
//     const confirmDelete = window.confirm("Are you sure you want to delete?");
//     if (confirmDelete) {
//       const filtered = records.filter((_, i) => i !== index);
//       setRecords(filtered);
//       localStorage.setItem("study", JSON.stringify(filtered));
//     }
//   }

//   return (
//     <>
//       <StudyTable
//         records={records}
//         handleEdit={handleEdit}
//         handleDelete={handleDelete}
//         handleCreate={handleCreate}
//       />

//       {showForm && (
//         <StudyForm
//           handleSave={handleSave}
//           editData={editData}
//           editIndex={editIndex}
//         />
//       )}
//     </>
//   );
// }