// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//     FaFlask,
//     FaBuilding,
//     FaProjectDiagram,
//     FaUser,
//     FaCogs,
//     FaCheckCircle,
//      FaTint,            // Reagent
//   FaListAlt,         // Procedure
//   FaEye,             // Observation
//   FaClipboardCheck   // Conclusion
// } from "react-icons/fa";

// import "../../Style/FormTable.css";
// import "../../Style/Form.css";

// export default function ExperimentForm({ editdata }) {
//     const navigate = useNavigate();
//     const { id } = useParams();

//     const [data, setData] = useState({
//         experimentId: "",
//         labCode: "",
//         project: "",
//         scientist: "",
//         method: "",
//         instrumentResult: "",
//         reagent: "",
//         procedure: "",
//         observation: "",
//         conclusion: "",
//     });

//     const [errors, setErrors] = useState({});
//     const [message, setMessage] = useState("");

//     // 🔥 EDIT LOAD (same as instrument)
//     useEffect(() => {
//         const stored = JSON.parse(localStorage.getItem("experiment")) || [];

//         if (id !== undefined && id !== null) {
//             const record = stored[Number(id)];
//             if (record) {
//                 setData(record);
//             }
//         }
//     }, [id]);

//     useEffect(() => {
//         if (editdata) {
//             setData(editdata);
//         }
//     }, [editdata]);

//     function handleChange(e) {
//         setData({ ...data, [e.target.name]: e.target.value });
//         setErrors({ ...errors, [e.target.name]: "" });
//     }

//     function validate() {
//         let err = {};
//         if (!data.experimentId.trim()) err.experimentId = "Required";
//         if (!data.labCode.trim()) err.labCode = "Required";
//         if (!data.project.trim()) err.project = "Required";
//         if (!data.scientist.trim()) err.scientist = "Required";
//         if (!data.method.trim()) err.method = "Required";
//         if (!data.instrumentResult.trim()) err.instrumentResult = "Required";
//         if (!data.reagent.trim()) err.reagent = "Required";
//         if (!data.procedure.trim()) err.procedure = "Required";
//         if (!data.observation.trim()) err.observation = "Required";
//         if (!data.conclusion.trim()) err.conclusion = "Required";
//         return err;
//     }

//     function handleSubmit(e) {
//         e.preventDefault();

//         const err = validate();
//         if (Object.keys(err).length > 0) {
//             setErrors(err);
//             return;
//         }

//         let oldData = JSON.parse(localStorage.getItem("experiment")) || [];

//         if (id !== undefined && id !== null) {
//             oldData[Number(id)] = data;
//             setMessage("Record Updated Successfully ");
//         } else {
//             oldData.push(data);
//             setMessage("Record Added Successfully ");
//         }

//         localStorage.setItem("experiment", JSON.stringify(oldData));

//         setTimeout(() => {
//             setMessage("");
//             navigate("/experiment");
//             window.location.reload(); 
//         }, 2000);

//         setData({
//             experimentId: "",
//             labCode: "",
//             project: "",
//             scientist: "",
//             method: "",
//             instrumentResult: "",
//             reagent: "",
//             procedure: "",
//             observation: "",
//             conclusion: "",
//         });

//         setErrors({});
//     }

//     const isEdit = id !== undefined;

//     return (
//         <div className={`form-container ${isEdit ? "edit-form" : ""}`}>
//             <div className="form-card">
//                 <h2 className="form-title cl2">Experiment Trial Record</h2>

//                 {message && <div className="custom-alert">{message}</div>}

//                 <form onSubmit={handleSubmit}>
//                     <div className="form-section">

//                         {/* ROW 1 */}
//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label>
//                                     <FaFlask /> Experiment ID
//                                 </label>
//                                 <input type="text"
//                                     name="experimentId"
//                                     value={data.experimentId}
//                                     onChange={handleChange}
//                                     placeholder="Experiment ID"
//                                 />
//                                 {errors.experimentId && <small className="text-danger">{errors.experimentId}</small>}
//                             </div>

//                             <div className="form-group">
//                                 <label>
//                                     <FaBuilding /> Lab Code
//                                 </label>
//                                 <input type="text"
//                                     name="labCode"
//                                     value={data.labCode}
//                                     onChange={handleChange}
//                                     placeholder="Lab Code"
//                                 />
//                                 {errors.labCode && <small className="text-danger">{errors.labCode}</small>}
//                             </div>
//                         </div>

//                         {/* ROW 2 */}
//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label>
//                                     <FaProjectDiagram /> Project
//                                 </label>
//                                 <input type="text"
//                                     name="project"
//                                     value={data.project}
//                                     onChange={handleChange}
//                                     placeholder="Project"
//                                 />
//                                 {errors.project && <small className="text-danger">{errors.project}</small>}
//                             </div>

//                             <div className="form-group">
//                                 <label>
//                                     <FaUser /> Scientist
//                                 </label>
//                                 <input type="text"
//                                     name="scientist"
//                                     value={data.scientist}
//                                     onChange={handleChange}
//                                     placeholder="Scientist"
//                                 />
//                                 {errors.scientist && <small className="text-danger">{errors.scientist}</small>}
//                             </div>
//                         </div>

//                         {/* ROW 3 */}
//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label>
//                                     <FaCogs /> Method
//                                 </label>
//                                 <input type="text"
//                                     name="method"
//                                     value={data.method}
//                                     onChange={handleChange}
//                                     placeholder="Method"
//                                 />
//                                 {errors.method && <small className="text-danger">{errors.method}</small>}
//                             </div>

//                             <div className="form-group">
//                                 <label>
//                                     <FaCheckCircle /> Instrument Result
//                                 </label>
//                                 <input type="text"
//                                     name="instrumentResult"
//                                     value={data.instrumentResult}
//                                     onChange={handleChange}
//                                     placeholder="Result"
//                                 />
//                                 {errors.instrumentResult && <small className="text-danger">{errors.instrumentResult}</small>}
//                             </div>
//                         </div>

//                         {/* ROW 4 */}
//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label><FaTint/>Reagent</label>
//                                 <input type="text"
//                                     name="reagent"
//                                     value={data.reagent}
//                                     onChange={handleChange}
//                                     placeholder="Reagent"
//                                 />
//                                 {errors.reagent && <small className="text-danger">{errors.reagent}</small>}
//                             </div>

//                             <div className="form-group">
//                                 <label>< FaListAlt/>Procedure</label>
//                                 <input type="text"
//                                     name="procedure"
//                                     value={data.procedure}
//                                     onChange={handleChange}
//                                     placeholder="Procedure"
//                                 />
//                                 {errors.procedure && <small className="text-danger">{errors.procedure}</small>}
//                             </div>
//                         </div>

//                         {/* ROW 5 */}
//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label>< FaEye/>Observation</label>
//                                 <input type="text"
//                                     name="observation"
//                                     value={data.observation}
//                                     onChange={handleChange}
//                                     placeholder="Observation"
//                                 />
//                                 {errors.observation && <small className="text-danger">{errors.observation}</small>}
//                             </div>

//                             <div className="form-group">
//                                 <label>< FaClipboardCheck/>Conclusion</label>
//                                 <input type="text"
//                                     name="conclusion"
//                                     value={data.conclusion}
//                                     onChange={handleChange}
//                                     placeholder="Conclusion"
//                                 />
//                                 {errors.conclusion && <small className="text-danger">{errors.conclusion}</small>}
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