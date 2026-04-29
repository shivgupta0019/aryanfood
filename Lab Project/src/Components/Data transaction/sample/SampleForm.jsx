// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//     FaFlask,
//     FaBuilding,
//     FaProjectDiagram,
//     FaHashtag,
//     FaCalendarAlt,
//     FaCheckCircle,
// } from "react-icons/fa";

// import "../../Style/FormTable.css";
// import "../../Style/Form.css";

// export default function SampleForm({ editData }) {
//     const navigate = useNavigate();
//     const { id } = useParams();

//     const [data, setData] = useState({
//         sampleName: "",
//         labCode: "",
//         projectId: "",
//         batchNo: "",
//         sampleType: "",
//         dateReceived: "",
//         testRequired: "",
//         priority: "",
//     });

//     const [errors, setErrors] = useState({});
//     const [message, setMessage] = useState("");

//     useEffect(() => {
//         const stored = JSON.parse(localStorage.getItem("sample")) || [];
//         if (id !== undefined && id !== null) {
//             const record = stored[Number(id)];
//             if (record) {
//                 setData(record);
//             }
//         }
//     }, [id]);

//     useEffect(() => {
//         if (editData) {
//             setData(editData);
//         }
//     }, [editData]);

//     function handleChange(e) {
//         setData({ ...data, [e.target.name]: e.target.value });
//         setErrors({ ...errors, [e.target.name]: "" });
//     }

//     function validate() {
//         let err = {};
//         if (!data.sampleName.trim()) err.sampleName = "Sample Name required";
//         if (!data.labCode.trim()) err.labCode = "Lab Code required";
//         if (!data.projectId.trim()) err.projectId = "Project ID required";
//         if (!data.batchNo.trim()) err.batchNo = "Batch No required";
//         if (!data.sampleType.trim()) err.sampleType = "Sample Type required";
//         if (!data.dateReceived) err.dateReceived = "Date required";
//         if (!data.testRequired.trim()) err.testRequired = "Test Required";
//         if (!data.priority.trim()) err.priority = "Priority required";
//         return err;
//     }

//     function handleSubmit(e) {
//         e.preventDefault();

//         const err = validate();
//         if (Object.keys(err).length > 0) {
//             setErrors(err);
//             return;
//         }

//         let oldData = JSON.parse(localStorage.getItem("sample")) || [];

//         if (id !== undefined && id !== null) {
//             oldData[Number(id)] = data;
//             setMessage("Record Updated Successfully");
//         } else {
//             oldData.push(data);
//             setMessage("Record Added Successfully");
//         }

//         localStorage.setItem("sample", JSON.stringify(oldData));

//         setTimeout(() => {
//             setMessage("");
//             navigate("/sample");
//             window.location.reload();
//         }, 2000);

//         setData({
//             sampleName: "",
//             labCode: "",
//             projectId: "",
//             batchNo: "",
//             sampleType: "",
//             dateReceived: "",
//             testRequired: "",
//             priority: "",
//         });

//         setErrors({});
//     }

//     const isEdit = id !== undefined;

//     return (
//         <div className={`form-container ${isEdit ? "edit-form" : ""}`}>
//             <div className="form-card">
//                 <h2 className="form-title cl2">Sample</h2>

//                 {message && <div className="custom-alert">{message}</div>}

//                 <form onSubmit={handleSubmit}>
//                     <div className="form-section">

//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label><FaFlask /> Sample Name</label>
//                                 <input 
//                                     name="sampleName" 
//                                     value={data.sampleName} 
//                                     onChange={handleChange} 
//                                     placeholder="Enter sample name"
//                                 />
//                                 {errors.sampleName && (
//                                     <small className="text-danger">
//                                         {errors.sampleName}
//                                     </small>
//                                 )}
//                             </div>

//                             <div className="form-group">
//                                 <label><FaBuilding /> Lab Code</label>
//                                 <input 
//                                     name="labCode" 
//                                     value={data.labCode} 
//                                     onChange={handleChange} 
//                                     placeholder="Enter lab code"
//                                 />
//                                 {errors.labCode && (
//                                     <small className="text-danger">
//                                         {errors.labCode}
//                                     </small>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label><FaProjectDiagram /> Project ID</label>
//                                 <input 
//                                     name="projectId" 
//                                     value={data.projectId} 
//                                     onChange={handleChange} 
//                                     placeholder="Enter project ID"
//                                 />
//                                 {errors.projectId && (
//                                     <small className="text-danger">
//                                         {errors.projectId}
//                                     </small>
//                                 )}
//                             </div>

//                             <div className="form-group">
//                                 <label><FaHashtag /> Batch No</label>
//                                 <input 
//                                     name="batchNo" 
//                                     value={data.batchNo} 
//                                     onChange={handleChange} 
//                                     placeholder="Enter batch number"
//                                 />
//                                 {errors.batchNo && (
//                                     <small className="text-danger">
//                                         {errors.batchNo}
//                                     </small>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label>Sample Type</label>
//                                 <input 
//                                     name="sampleType" 
//                                     value={data.sampleType} 
//                                     onChange={handleChange} 
//                                     placeholder="Enter sample type"
//                                 />
//                                 {errors.sampleType && (
//                                     <small className="text-danger">
//                                         {errors.sampleType}
//                                     </small>
//                                 )}
//                             </div>

//                             <div className="form-group">
//                                 <label><FaCalendarAlt /> Date Received</label>
//                                 <input 
//                                     type="date" 
//                                     name="dateReceived" 
//                                     value={data.dateReceived} 
//                                     onChange={handleChange} 
//                                 />
//                                 {errors.dateReceived && (
//                                     <small className="text-danger">
//                                         {errors.dateReceived}
//                                     </small>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label>Test Required</label>
//                                 <input 
//                                     name="testRequired" 
//                                     value={data.testRequired} 
//                                     onChange={handleChange} 
//                                     placeholder="Enter required test"
//                                 />
//                                 {errors.testRequired && (
//                                     <small className="text-danger">
//                                         {errors.testRequired}
//                                     </small>
//                                 )}
//                             </div>

//                             <div className="form-group">
//                                 <label><FaCheckCircle /> Priority</label>
//                                 <input 
//                                     name="priority" 
//                                     value={data.priority} 
//                                     onChange={handleChange} 
//                                     placeholder="Enter priority (High/Medium/Low)"
//                                 />
//                                 {errors.priority && (
//                                     <small className="text-danger">
//                                         {errors.priority}
//                                     </small>
//                                 )}
//                             </div>
//                         </div>

//                     </div>

//                     <button type="submit" className="btn-submit w-100">
//                         {id !== undefined && id !== null ? "Update" : "Submit"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }