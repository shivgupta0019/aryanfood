

// import React, { useEffect, useState } from "react";
// import UserScientistTable from "./UserScientistTable";
// import { useLocation } from "react-router-dom";

// export default function UserScientistPage() {
//   const [records, setRecords] = useState([]);
//   const location = useLocation();

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("users")) || [];
//     setRecords(stored);
//   }, [location]);

//   function handleDelete(index) {
//     const confirmDelete = window.confirm("Are you sure?");
//     if (confirmDelete) {
//       const filtered = records.filter((_, i) => i !== index);
//       setRecords(filtered);
//       localStorage.setItem("users", JSON.stringify(filtered));
//     }
//   }

//   return (
//     <UserScientistTable
//       records={records}
//       handleDelete={handleDelete}
//     />
//   );
// }