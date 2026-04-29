// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import "../Style/Form.css";

// export default function TestForm() {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [data, setData] = useState({
//     testid: "",
//     testname: "",
//     labcode: "",
//     method: "",
//     unit: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");

//   // EDIT MODE
//   useEffect(() => {
//     async function fetchData() {
//       if (id !== undefined) {
//         const res = await axios.get(`http://localhost:3000/test/${id}`);
//         setData(res.data);
//       }
//     }
//     fetchData();
//   }, [id]);

//   function handleChange(e) {
//     setData({ ...data, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   }

//   function validate() {
//     let err = {};
//     if (!data.testid) err.testid = "Required";
//     return err;
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();

//     const err = validate();
//     if (Object.keys(err).length > 0) {
//       setErrors(err);
//       return;
//     }

//     if (id !== undefined) {
//       await axios.put(`http://localhost:3000/test/${id}`, data);
//       setMessage("Record Updated Successfully ");
//     } else {
//       await axios.post("http://localhost:3000/test", data);
//       setMessage("Record Added Successfully");
//     }

//     // auto hide + redirect
//     setTimeout(() => {
//       setMessage("");
//       navigate("/test");
//              window.location.reload(); //  important

//     }, 2000);
//   }

//   const isEdit = id !== undefined;

//   return (
//     <div className={`form-container ${isEdit ? "edit-form" : ""}`}>
//       <div className="form-card">
//         <h2 className="form-title cl2">
//           {isEdit ? "Update Test" : "Add Test"}
//         </h2>
//         {message && (
//           <div className="custom-alert">
//             {message}
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>

//           <div className="form-group">
//             <label>
//               <i className="fa-solid fa-vial" style={{ color: "black" }}></i> Test ID
//             </label>
//             <input
//               name="testid"
//               value={data.testid}
//               onChange={handleChange}
//               placeholder="Enter test ID..."
//             />
//           </div>

//           <div className="form-group">
//             <label>
//               <i className="fa-solid fa-flask" style={{ color: "black" }}></i> Test Name
//             </label>
//             <input
//               name="testname"
//               value={data.testname}
//               onChange={handleChange}
//               placeholder="Enter test name..."
//             />
//           </div>

//           <div className="form-group">
//             <label>
//               <i className="fa-solid fa-building" style={{ color: "black" }}></i> Lab Code
//             </label>
//             <input
//               name="labcode"
//               value={data.labcode}
//               onChange={handleChange}
//               placeholder="Enter lab code..."
//             />
//           </div>

//           <div className="form-group">
//             <label>
//               <i className="fa-solid fa-gears" style={{ color: "black" }}></i> Method
//             </label>
//             <input
//               name="method"
//               value={data.method}
//               onChange={handleChange}
//               placeholder="Enter method..."
//             />
//           </div>

//           <div className="form-group">
//             <label>
//               <i className="fa-solid fa-ruler" style={{ color: "black" }}></i> Unit
//             </label>
//             <input
//               name="unit"
//               value={data.unit}
//               onChange={handleChange}
//               placeholder="Enter unit..."
//             />
//           </div>

//           <button className="btn-submit w-100">
//             {isEdit ? "Update" : "Submit"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }