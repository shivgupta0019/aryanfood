// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   FaBarcode,
//   FaFlask,
//   FaBuilding,
//   FaCogs,
//   FaCalendarAlt,
//   FaCheckCircle,
// } from "react-icons/fa";

// import "../Style/FormTable.css";
// import "../Style/Form.css";

// export default function InstrumentForm({ editdata }) {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [data, setData] = useState({
//     instrumentId: "",
//     instrumentName: "",
//     labId: "",
//     model: "",
//     calibrationDate: "",
//     nextcalibrationDate: "",
//     status: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [message,setMessage] = useState("");

//   //  FIXED: id check properly
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("instrument")) || [];

//     if (id !== undefined && id !== null) {
//       const record = stored[Number(id)];
//       if (record) {
//         setData(record);
//       }
//     }
//   }, [id]);

//   // EDIT AUTO FILL (unchanged)
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
//     if (!data.instrumentId.trim())
//       err.instrumentId = "Instrument Id is required";
//     if (!data.instrumentName.trim())
//       err.instrumentName = "Instrument Name is required";
//     if (!data.labId.trim()) err.labId = "Lab Id is required";
//     if (!data.model.trim()) err.model = "Model is required";
//     if (!data.calibrationDate)
//       err.calibrationDate = "Calibration Date is required";
//     // if (!data.nextcalibrationDate)
//     //   err.nextcalibrationDate = "Next Calibration Date is required";
//     if (!data.status.trim()) err.status = "Status is required";
//     return err;
//   }

//   function handleSubmit(e) {
//   e.preventDefault();

//   const err = validate();
//   if (Object.keys(err).length > 0) {
//     setErrors(err);
//     return;
//   }

//   let oldData = JSON.parse(localStorage.getItem("instrument")) || [];

//   if (id !== undefined && id !== null) {
//     oldData[Number(id)] = data;
//     setMessage("Record Updated Successfully ");
//   } else {
//     oldData.push(data);
//      setMessage("Record Added Successfully ");
//   }

//   localStorage.setItem("instrument", JSON.stringify(oldData));

//   setTimeout(() => {
//       setMessage("");
//         navigate("/centrallab");
//        window.location.reload(); //  important
//     }, 2000);
 

//   setData({
//     instrumentId: "",
//     instrumentName: "",
//     labId: "",
//     model: "",
//     calibrationDate: "",
//     status: "",
//   });

//   setErrors({});
// }
// const isEdit = id !== undefined;
//   return (
//     <div className={`form-container ${isEdit ? "edit-form" : ""}`}>
//       <div className="form-card">
//         <h2 className="form-title cl2">Instrument Master</h2>
//          {message && (
//           <div className="custom-alert">
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="form-section">
//             <div className="form-row">
//               <div className="form-group">
//                 <label>
//                   <FaBarcode />
//                   Instrument ID
//                 </label>
//                 <input
//                   type="text"
//                   name="instrumentId"
//                   value={data.instrumentId}
//                   onChange={handleChange}
//                   placeholder="Instrument Id...."
//                 />
//                 {errors.instrumentId && (
//                   <small className="text-danger">
//                     {errors.instrumentId}
//                   </small>
//                 )}
//               </div>

//               <div className="form-group">
//                 <label>
//                   <FaFlask />
//                   Instrument Name
//                 </label>
//                 <input
//                   type="text"
//                   name="instrumentName"
//                   value={data.instrumentName}
//                   onChange={handleChange}
//                   placeholder="Instrument Name"
//                 />
//                 {errors.instrumentName && (
//                   <small className="text-danger">
//                     {errors.instrumentName}
//                   </small>
//                 )}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>
//                   <FaBuilding />
//                   Lab ID
//                 </label>
//                 <input
//                   type="text"
//                   name="labId"
//                   value={data.labId}
//                   onChange={handleChange}
//                   placeholder="Lab Id"
//                 />
//                 {errors.labId && (
//                   <small className="text-danger">{errors.labId}</small>
//                 )}
//               </div>

//               <div className="form-group">
//                 <label>
//                   <FaCogs />
//                   Model
//                 </label>
//                 <input
//                   type="text"
//                   name="model"
//                   value={data.model}
//                   onChange={handleChange}
//                   placeholder="Model"
//                 />
//                 {errors.model && (
//                   <small className="text-danger">{errors.model}</small>
//                 )}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>
//                   <FaCalendarAlt />
//                   Calibration Date
//                 </label>
//                 <input
//                   type="date"
//                   name="calibrationDate"
//                   value={data.calibrationDate}
//                   onChange={handleChange}
//                 />
//                 {errors.calibrationDate && (
//                   <small className="text-danger">
//                     {errors.calibrationDate}
//                   </small>
//                 )}
//               </div>

//               <div className="form-group">
//                 <label>
//                   <FaCheckCircle />
//                   Status
//                 </label>
//                 <input
//                   name="status"
//                   value={data.status}
//                   onChange={handleChange}
//                   placeholder="Status"
//                 />
//                 {errors.status && (
//                   <small className="text-danger">{errors.status}</small>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/*  FIXED BUTTON */}
//           <button type="submit" className="btn-submit w-100">
//             {id !== undefined && id !== null ? "Update" : "Submit"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }