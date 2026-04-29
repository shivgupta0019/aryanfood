// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   FaBarcode,
//   FaProjectDiagram,
//   FaBuilding,
//   FaWarehouse,
//   FaClock,
//   FaCheckCircle,
// } from "react-icons/fa";

// import "../../Style/FormTable.css";
// import "../../Style/Form.css";

// export default function StudyForm({ editData }) {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [data, setData] = useState({
//     studyId: "",
//     project: "",
//     labcode: "",
//     storage: "",
//     interval: "",
//     results: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");

//   // ✅ ID based edit (same as instrument)
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("study")) || [];

//     if (id !== undefined && id !== null) {
//       const record = stored[Number(id)];
//       if (record) {
//         setData(record);
//       }
//     }
//   }, [id]);

//   // ✅ editData support (optional)
//   useEffect(() => {
//     if (editData) {
//       setData(editData);
//     }
//   }, [editData]);

//   function handleChange(e) {
//     setData({ ...data, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   }

//   function validate() {
//     let err = {};
//     if (!data.studyId.trim()) err.studyId = "Study ID is required";
//     if (!data.project.trim()) err.project = "Project is required";
//     if (!data.labcode.trim()) err.labcode = "Lab Code is required";
//     if (!data.storage.trim()) err.storage = "Storage is required";
//     if (!data.interval.trim()) err.interval = "Interval is required";
//     if (!data.results.trim()) err.results = "Results are required";
//     return err;
//   }

//   function handleSubmit(e) {
//     e.preventDefault();

//     const err = validate();
//     if (Object.keys(err).length > 0) {
//       setErrors(err);
//       return;
//     }

//     let oldData = JSON.parse(localStorage.getItem("study")) || [];

//     if (id !== undefined && id !== null) {
//       oldData[Number(id)] = data;
//       setMessage("Record Updated Successfully ");
//     } else {
//       oldData.push(data);
//       setMessage("Record Added Successfully ");
//     }

//     localStorage.setItem("study", JSON.stringify(oldData));

//     setTimeout(() => {
//       setMessage("");
//       navigate("/study"); // 👉 apna route change kar lena agar alag hai
//       window.location.reload();
//     }, 2000);

//     setData({
//       studyId: "",
//       project: "",
//       labcode: "",
//       storage: "",
//       interval: "",
//       results: "",
//     });

//     setErrors({});
//   }

//   const isEdit = id !== undefined;

//   return (
//     <div className={`form-container ${isEdit ? "edit-form" : ""}`}>
//       <div className="form-card">
//         <h2 className="form-title cl2">Study Master</h2>

//         {message && <div className="custom-alert">{message}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="form-row">
//             <div className="form-group">
//               <label><FaBarcode /> Study ID</label>
//               <input
//                 name="studyId"
//                 placeholder="Enter Study ID"
//                 value={data.studyId}
//                 onChange={handleChange}
//               />
//               {errors.studyId && (
//                 <small className="text-danger">{errors.studyId}</small>
//               )}
//             </div>

//             <div className="form-group">
//               <label><FaProjectDiagram /> Project</label>
//               <input
//                 name="project"
//                 placeholder="Enter Project Name"
//                 value={data.project}
//                 onChange={handleChange}
//               />
//               {errors.project && (
//                 <small className="text-danger">{errors.project}</small>
//               )}
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label><FaBuilding /> Lab Code</label>
//               <input
//                 name="labcode"
//                 placeholder="Enter Lab Code"
//                 value={data.labcode}
//                 onChange={handleChange}
//               />
//               {errors.labcode && (
//                 <small className="text-danger">{errors.labcode}</small>
//               )}
//             </div>

//             <div className="form-group">
//               <label><FaWarehouse /> Storage</label>
//               <input
//                 name="storage"
//                 placeholder="Storage Conditions"
//                 value={data.storage}
//                 onChange={handleChange}
//               />
//               {errors.storage && (
//                 <small className="text-danger">{errors.storage}</small>
//               )}
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label><FaClock /> Interval</label>
//               <input
//                 name="interval"
//                 placeholder="Time Interval"
//                 value={data.interval}
//                 onChange={handleChange}
//               />
//               {errors.interval && (
//                 <small className="text-danger">{errors.interval}</small>
//               )}
//             </div>

//             <div className="form-group">
//               <label><FaCheckCircle /> Results</label>
//               <input
//                 name="results"
//                 placeholder="Enter Results"
//                 value={data.results}
//                 onChange={handleChange}
//               />
//               {errors.results && (
//                 <small className="text-danger">{errors.results}</small>
//               )}
//             </div>
//           </div>

//           <button type="submit" className="btn-submit w-100">
//             {id !== undefined && id !== null ? "Update" : "Submit"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }