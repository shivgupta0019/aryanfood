// import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom';

// import InstrumentForm from './InstrumentForm';
// import InstrumentTable from './InstrumentTable';

// export default function IntrumentPage() {
//     const [records, setRecords] = useState([]);
//     const [editIndex, setEditIndex] = useState(null);
//     const [editData, setEditData] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     const location = useLocation();

//     useEffect(() => {
//         const stored = JSON.parse(localStorage.getItem("instrument")) || [];
//         setRecords(stored);
//     }, [location]);

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
//    function handleDelete(index) {
//   const confirmDelete = window.confirm("Are you sure you want to delete this record?");

//   if (confirmDelete) {
//     const filtered = records.filter((_, i) => i !== index);
//     setRecords(filtered);

//     // localStorage update bhi kar
//     localStorage.setItem("instrument", JSON.stringify(filtered));
//   }
// }

//     return (
//         <>
//             <InstrumentTable
//                 records={records}
//                 handleEdit={handleEdit}
//                 handleDelete={handleDelete}
//                 handleCreate={handleCreate}
//             />
//             {showForm && (
//                 <InstrumentForm

//                     handleSave={handleSave}
//                     editData={editData}
//                     editIndex={editIndex}
//                 />
//             )}
//         </>
//     )
// }
