// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "../Style/Form.css";

// export default function UserScientistForm({ editData }) {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [data, setData] = useState({
//     empcode: "",
//     empid: "",
//     firstname: "",
//     lastname: "",
//     role: "",
//     dob: "",
//     password: "",
//     mobile: "",
//     address: "",
//     personalemail: "",
//     professionalemail: "",
//     labcode: "",
//     designcode: "",
//     department: "",
//     gender: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [message,setMessage] = useState("");

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("users")) || [];
//     if (id !== undefined && stored[Number(id)]) {
//       setData(stored[Number(id)]);
//     }
//   }, [id]);

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
//     if (!data.empcode?.trim()) err.empcode = "Required";
//     return err;
//   }

//   function handleSubmit(e) {
//     e.preventDefault();

//     const err = validate();
//     if (Object.keys(err).length > 0) {
//       setErrors(err);
//       return;
//     }

//     let oldData = JSON.parse(localStorage.getItem("users")) || [];

//     if (id !== undefined) {
//       oldData[Number(id)] = data;
//        setMessage("Record Updated Successfully ");
//     } else {
//       oldData.push(data);
//        setMessage("Record Added Successfully ");
//     }

//     localStorage.setItem("users", JSON.stringify(oldData));
//     setTimeout(()=>{
//       setMessage("");
//             navigate("/user");
//              window.location.reload(); //  important
//     },2000)
   

//     setData({
//       empcode: "",
//       empid: "",
//       firstname: "",
//       lastname: "",
//       role: "",
//       dob: "",
//       password: "",
//       mobile: "",
//       address: "",
//       personalemail: "",
//       professionalemail: "",
//       labcode: "",
//       designcode: "",
//       department: "",
//       gender: "",
//     });

//     setErrors({});
//   }

//   const isEdit = id !== undefined;

//   return (

//     <div className={`form-container ${isEdit ? "edit-form" : ""}`}>
//       <div className="form-card">
//         <h2 className="form-title cl2">User Scientist Master</h2>
//         {message &&(
//           <div className="custom-alert">
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
//           <div className="row g-3">

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-id-badge" style={{color:"black"}}></i> Emp Code</label>
//               <input name="empcode" value={data.empcode} onChange={handleChange} placeholder="Enter emp code..." />
//               {errors.empcode && <small className="text-danger">{errors.empcode}</small>}
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-hashtag" style={{color:"black"}}></i> Emp ID</label>
//               <input name="empid" value={data.empid} onChange={handleChange} placeholder="Enter emp ID..." />
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-user" style={{color:"black"}}></i> First Name</label>
//               <input name="firstname" value={data.firstname} onChange={handleChange} placeholder="Enter first name..." />
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-user" style={{color:"black"}}></i> Last Name</label>
//               <input name="lastname" value={data.lastname} onChange={handleChange} placeholder="Enter last name..." />
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-briefcase" style={{color:"black"}}></i> Role</label>
//               <input name="role" value={data.role} onChange={handleChange} placeholder="Enter role..." />
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-calendar" style={{color:"black"}}></i> DOB</label>
//               <input type="date" name="dob" value={data.dob} onChange={handleChange} />
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-phone" style={{color:"black"}}></i> Mobile</label>
//               <input name="mobile" value={data.mobile} onChange={handleChange} placeholder="Enter mobile number..." />
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-lock" style={{color:"black"}}></i> Password</label>
//               <input type="password" name="password" value={data.password} onChange={handleChange} placeholder="Enter password..." />
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-envelope" style={{color:"black"}}></i> Professional Email</label>
//               <input name="professionalemail" value={data.professionalemail} onChange={handleChange} placeholder="Enter professional email..." />
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-envelope" style={{color:"black"}}></i> Personal Email</label>
//               <input name="personalemail" value={data.personalemail} onChange={handleChange} placeholder="Enter personal email..." />
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-building" style={{color:"black"}}></i> Lab Code</label>
//               <input name="labcode" value={data.labcode} onChange={handleChange} placeholder="Enter lab code..." />
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-code" style={{color:"black"}}></i> Design Code</label>
//               <input name="designcode" value={data.designcode} onChange={handleChange} placeholder="Enter design code..." />
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-building-columns" style={{color:"black"}}></i> Department</label>
//               <input name="department" value={data.department} onChange={handleChange} placeholder="Enter department..." />
//             </div>

//             <div className="col-md-6 form-group">
//               <label><i className="fa-solid fa-venus-mars" style={{color:"black"}}></i> Gender</label>
//               <select name="gender" value={data.gender} onChange={handleChange}>
//                 <option value="">Select gender</option>
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//               </select>
//             </div>

//             <div className="col-lg-12 form-group">
//               <label><i className="fa-solid fa-location-dot" style={{color:"black"}}></i> Address</label>
//               <textarea name="address" value={data.address} onChange={handleChange} placeholder="Enter address..."></textarea>
//             </div>

//           </div>

//           <button className="btn-submit w-100">
//             {id !== undefined ? "Update" : "Submit"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }