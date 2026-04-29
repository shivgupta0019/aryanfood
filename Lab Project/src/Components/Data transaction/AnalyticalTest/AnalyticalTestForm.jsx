// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   FaBarcode,
//   FaFlask,
//   FaBuilding,
//   FaCogs,
//   FaCheckCircle,
//   FaVial,
//   FaClipboardList,
//   FaChartLine,
//   FaBalanceScale,
//   FaUserAlt,
// } from "react-icons/fa";

// import "../../Style/FormTable.css";
// import "../../Style/Form.css";

// export default function AnalyticalTestForm({ editdata }) {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [data, setData] = useState({
//     testId: "",
//     labcode: "",
//     sampleId: "",
//     parameters: "",
//     method: "",
//     specification: "",
//     result: "",
//     unit: "",
//     status: "",
//     analyst: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("analyticalTest")) || [];

//     if (id !== undefined && id !== null) {
//       const record = stored[Number(id)];
//       if (record) {
//         setData(record);
//       }
//     }
//   }, [id]);

//   useEffect(() => {
//     if (editdata) {
//       setData(editdata);
//     }
//   }, [editdata]);

//   function handleChange(e) {
//     setData({ ...data, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   }

//   function validate() {
//     let err = {};

//     if (!data.testId.trim()) err.testId = "Test ID is required";
//     if (!data.labcode.trim()) err.labcode = "Lab Code is required";
//     if (!data.sampleId.trim()) err.sampleId = "Sample ID is required";
//     if (!data.parameters.trim()) err.parameters = "Parameters required";
//     if (!data.method.trim()) err.method = "Method required";
//     if (!data.result.trim()) err.result = "Result required";
//     if (!data.unit.trim()) err.unit = "Unit required";
//     if (!data.specification.trim()) err.specification = "Specification is required";
//     if (!data.status.trim()) err.status = "Status is required";
//     if (!data.analyst.trim()) err.analyst = "Analyst is required";

//     return err;
//   }

//   function handleSubmit(e) {
//     e.preventDefault();

//     const err = validate();
//     if (Object.keys(err).length > 0) {
//       setErrors(err);
//       return;
//     }

//     let oldData =
//       JSON.parse(localStorage.getItem("analyticalTest")) || [];

//     if (id !== undefined && id !== null) {
//       oldData[Number(id)] = data;
//       setMessage("Record Updated Successfully ");
//     } else {
//       oldData.push(data);
//       setMessage("Record Added Successfully ");
//     }

//     localStorage.setItem(
//       "analyticalTest",
//       JSON.stringify(oldData)
//     );

//     setTimeout(() => {
//       setMessage("");
//       navigate("/analytical");
//       window.location.reload();
//     }, 2000);

//     setData({
//       testId: "",
//       labcode: "",
//       sampleId: "",
//       parameters: "",
//       method: "",
//       specification: "",
//       result: "",
//       unit: "",
//       status: "",
//       analyst: "",
//     });

//     setErrors({});
//   }

//   const isEdit = id !== undefined;

//   return (
//     <div className={`form-container ${isEdit ? "edit-form" : ""}`}>
//       <div className="form-card">
//         <h2 className="form-title cl2">Analytical Test</h2>

//         {message && <div className="custom-alert">{message}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="form-section">

//             <div className="form-row">
//               <div className="form-group">
//                 <label><FaBarcode /> Test ID</label>
//                 <input name="testId" value={data.testId} onChange={handleChange} placeholder="Enter Test ID" />
//                 {errors.testId && <small className="text-danger">{errors.testId}</small>}
//               </div>

//               <div className="form-group">
//                 <label><FaBuilding /> Lab Code</label>
//                 <input name="labcode" value={data.labcode} onChange={handleChange} placeholder="Enter Lab Code" />
//                 {errors.labcode && <small className="text-danger">{errors.labcode}</small>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label><FaFlask /> Sample ID</label>
//                 <input name="sampleId" value={data.sampleId} onChange={handleChange} placeholder="Enter Sample ID" />
//                 {errors.sampleId && <small className="text-danger">{errors.sampleId}</small>}
//               </div>

//               <div className="form-group">
//                 <label><FaCogs /> Parameters</label>
//                 <input name="parameters" value={data.parameters} onChange={handleChange} placeholder="Enter Parameters" />
//                 {errors.parameters && <small className="text-danger">{errors.parameters}</small>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label><FaClipboardList /> Method</label>
//                 <input name="method" value={data.method} onChange={handleChange} placeholder="Enter Method" />
//                 {errors.method && <small className="text-danger">{errors.method}</small>}
//               </div>

//               <div className="form-group">
//                 <label><FaBalanceScale /> Specification</label>
//                 <input name="specification" value={data.specification} onChange={handleChange} placeholder="Enter Specification" />
//                  {errors.specification && <small className="text-danger">{errors.specification}</small>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label><FaChartLine /> Result</label>
//                 <input name="result" value={data.result} onChange={handleChange} placeholder="Enter Result" />
//                 {errors.result && <small className="text-danger">{errors.result}</small>}
//               </div>

//               <div className="form-group">
//                 <label><FaVial /> Unit</label>
//                 <input name="unit" value={data.unit} onChange={handleChange} placeholder="Enter Unit" />
//                 {errors.unit && <small className="text-danger">{errors.unit}</small>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label><FaCheckCircle /> Status</label>
//                 <input name="status" value={data.status} onChange={handleChange} placeholder="Enter Status" />
//                 {errors.status && <small className="text-danger">{errors.status}</small>}
//               </div>

//               <div className="form-group">
//                 <label><FaUserAlt /> Analyst</label>
//                 <input name="analyst" value={data.analyst} onChange={handleChange} placeholder="Enter Analyst Name" />
//                 {errors.analyst && <small className="text-danger">{errors.analyst}</small>}
//               </div>
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


