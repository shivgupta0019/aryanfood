
// import React, { useEffect, useState } from 'react'
// import { useLocation } from 'react-router-dom';
// import RowMetairialTable from './RowMetairialTable';

// export default function RawMaterialPage() {
//   const [records, setRecords] = useState([]);
//   const location = useLocation();

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("metairial")) || [];
//     setRecords(stored);
//   }, [location]);

//   function handleDelete(index) {
//     const confirmDelete = window.confirm("Are you sure you want to delete?");
//     if (confirmDelete) {
//       const filtered = records.filter((_, i) => i !== index);
//       setRecords(filtered);
//       localStorage.setItem("metairial", JSON.stringify(filtered));
//     }
//   }

//   return (
//     <RowMetairialTable
//       records={records}
//       handleDelete={handleDelete}
//     />
//   );
// }