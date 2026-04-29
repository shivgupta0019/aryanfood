
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Style/Form.css";

export default function ProjectForm({ editdata, editIndex }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [data, setData] = useState({
    projectId: "",
    projectName: "",
    objective: "",
    startDate: "",
    endDate: "",
    status: ""
  });

  const [errors, setErrors] = useState({});
  const [message,setMessage] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("project")) || [];
    if (id !== undefined && stored[Number(id)]) {
      setData(stored[Number(id)]);
    }
  }, [id]);

  useEffect(() => {
    if (editdata) setData(editdata);
  }, [editdata]);

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    let err = {};
    if (!data.projectId.trim()) err.projectId = "Project ID is required";
    if (!data.projectName.trim()) err.projectName = "Project Name is required";
    if (!data.objective.trim()) err.objective = "Objective is required";
    if (!data.startDate) err.startDate = "Start Date is required";
    if (!data.endDate) err.endDate = "End Date is required";
    if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
      err.endDate = "End Date must be after Start Date";
    }
    if (!data.status) err.status = "Status is required";
    return err;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    let oldData = JSON.parse(localStorage.getItem("project")) || [];

    if (id !== undefined) {
      oldData[Number(id)] = data;
      setMessage("Record Update Successfully")
    } else {
      oldData.push(data);
      setMessage("Record Added Successfully")
    }

    localStorage.setItem("project", JSON.stringify(oldData));
    setTimeout(()=>{
      setMessage("");
       navigate("/project");
             window.location.reload(); //  important

    },2000)
   
  }

  const isEdit = id !== undefined;

  return (
    <div className={`form-container ${isEdit ? "edit-form" : ""}`}>
      <div className="form-card">
        <h2 className="form-title cl2">Project Master</h2>
         {  message && (
          <div className="custom-alert">
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label><i className="fa-solid fa-hashtag me-2"></i>Project ID</label>
            <input
              name="projectId"
              value={data.projectId}
              onChange={handleChange}
              placeholder="Enter Project ID..."
            />
            {errors.projectId && <small className="text-danger">{errors.projectId}</small>}
          </div>

          <div className="form-group">
            <label><i className="fa-solid fa-diagram-project me-2"></i>Project Name</label>
            <input
              name="projectName"
              value={data.projectName}
              onChange={handleChange}
              placeholder="Enter Project Name..."
            />
            {errors.projectName && <small className="text-danger">{errors.projectName}</small>}
          </div>

          <div className="form-group">
            <label><i className="fa-solid fa-bullseye me-2"></i>Objective</label>
            <textarea
              name="objective"
              value={data.objective}
              onChange={handleChange}
              placeholder="Enter Project Objective..."
            />
            {errors.objective && <small className="text-danger">{errors.objective}</small>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><i className="fa-solid fa-calendar-days me-2"></i>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={data.startDate}
                onChange={handleChange}
              />
              {errors.startDate && <small className="text-danger">{errors.startDate}</small>}
            </div>

            <div className="form-group">
              <label><i className="fa-solid fa-calendar-check me-2"></i>End Date</label>
              <input
                type="date"
                name="endDate"
                value={data.endDate}
                onChange={handleChange}
              />
              {errors.endDate && <small className="text-danger">{errors.endDate}</small>}
            </div>
          </div>

          <div className="form-group">
            <label><i className="fa-solid fa-chart-line me-2"></i>Status</label>
            <select
              name="status"
              value={data.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            {errors.status && <small className="text-danger">{errors.status}</small>}
          </div>

          <button className="btn-submit w-100">
            {isEdit ? "Update" : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
}