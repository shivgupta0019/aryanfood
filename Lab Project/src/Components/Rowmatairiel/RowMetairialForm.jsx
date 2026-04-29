// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "../Style/Form.css";

// export default function RowMetairialForm() {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [data, setData] = useState({
//     materialCode: "",
//     materialName: "",
//     category: "",
//     supplier: "",
//     storage: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("metairial")) || [];
//     if (id !== undefined) {
//       const record = stored[Number(id)];
//       if (record) setData(record);
//     }
//   }, [id]);

//   function handleChange(e) {
//     setData({ ...data, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   }

//   function validate() {
//     let err = {};
//     if (!data.materialCode.trim()) err.materialCode = "Material Code is required";
//     if (!data.materialName.trim()) err.materialName = "Material Name is required";
//     if (!data.category.trim()) err.category = "Category is required";
//     if (!data.supplier.trim()) err.supplier = "Supplier is required";
//     if (!data.storage.trim()) err.storage = "Storage is required";
//     return err;
//   }

//   function handleSubmit(e) {
//     e.preventDefault();

//     const err = validate();
//     if (Object.keys(err).length > 0) {
//       setErrors(err);
//       return;
//     }

//     let oldData = JSON.parse(localStorage.getItem("metairial")) || [];

//     if (id !== undefined) {
//       oldData[Number(id)] = data;
//       setMessage("Record Updated Successfully ");
//     } else {
//       oldData.push(data);
//       setMessage("Record Added Successfully ");
//     }

//     localStorage.setItem("metairial", JSON.stringify(oldData));
//     setTimeout(() => {
//       setMessage("");
//       navigate("/metairial");
//       window.location.reload(); //  important
//     }, 2000);

//     setData({
//       materialCode: "",
//       materialName: "",
//       category: "",
//       supplier: "",
//       storage: ""
//     });

//     setErrors({});
//   }

//   const isEdit = id !== undefined;

//   return (
//     <div className={`form-container ${isEdit ? "edit-form" : ""}`}>
//       <div className="form-card">
//         <h2 className="form-title cl2">Raw Material Master</h2>
//         {message && (
//           <div className="custom-alert">
//             {message}
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>

//           <div className="form-group">
//             <label>
//               <i className="fa-solid fa-barcode" style={{ color: "black" }}></i> Material Code
//             </label>
//             <input
//               name="materialCode"
//               value={data.materialCode}
//               onChange={handleChange}
//               placeholder="Enter material code..."
//             />
//             {errors.materialCode && <small className="text-danger">{errors.materialCode}</small>}
//           </div>

//           <div className="form-group">
//             <label>
//               <i className="fa-solid fa-cube" style={{ color: "black" }}></i> Material Name
//             </label>
//             <input
//               name="materialName"
//               value={data.materialName}
//               onChange={handleChange}
//               placeholder="Enter material name..."
//             />
//           </div>

//           <div className="form-group">
//             <label>
//               <i className="fa-solid fa-layer-group" style={{ color: "black" }}></i> Category
//             </label>
//             <select
//               name="category"
//               value={data.category}
//               onChange={handleChange}
//             >
//               <option value="">Select Category</option>
//               <option value="Chemical">Chemical</option>
//               <option value="Biological">Biological</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label>
//               <i className="fa-solid fa-truck" style={{ color: "black" }}></i> Supplier
//             </label>
//             <input
//               name="supplier"
//               value={data.supplier}
//               onChange={handleChange}
//               placeholder="Enter supplier name..."
//             />
//           </div>

//           <div className="form-group">
//             <label>
//               <i className="fa-solid fa-warehouse" style={{ color: "black" }}></i> Storage
//             </label>
//             <input
//               name="storage"
//               value={data.storage}
//               onChange={handleChange}
//               placeholder="Enter storage details..."
//             />
//           </div>

//           <button className="btn-submit w-100">
//             {id !== undefined ? "Update" : "Submit"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }