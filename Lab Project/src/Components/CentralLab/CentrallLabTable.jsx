// import React, { useState } from 'react'
// import { Link, useNavigate } from "react-router-dom"
// import CentralLabForm from './CentralLabForm';
// import "../Style/FormTable.css"
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// export default function CentrallLabTable({ records, handleDelete }) {
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(5);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showForm, setShowForm] = useState(false);

//   const filteredData = records.filter((item) =>
//     Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
//   );

//   const indexOfLast = currentPage * entries;
//   const indexOfFirst = indexOfLast - entries;
//   const currentData = filteredData.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredData.length / entries);

//   function handleDownloadAll() {
//     const doc = new jsPDF();

//     // Title
//     doc.setFontSize(16);
//     doc.text("Central Lab Records", 14, 20);

//     // records props se data lo
//     const tableData = records.map((item) => [
//       item.code,
//       item.labname,
//       item.location,
//       item.labtype
//     ]);

//     autoTable(doc, {
//       startY: 30,
//       head: [["Code", "Lab Name", "Location", "Lab Type"]],
//       body: tableData,
//       theme: "grid",
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [0, 102, 204] },
//     });

//     doc.save("Central_Lab_Records.pdf");
//   }
//   return (
//     <>
//     <div className="main-content">
//       <div className="container-fluid mt-3" style={{ marginTop: "100px" }}>
//         <div className="card" style={{ marginTop: "30px" }}>

//           {/* ADD BUTTON */}
//           <div className="d-flex justify-content-end p-3">
//             <button className="btn btn-light"  >
//            <Link  to="/centrallab/lablist" style={{textDecoration:"none", color:"black", margin:"20px"}} >+Lab List</Link>
//             </button>
//             <button
//               className="btn btn-light"
//               onClick={() => setShowForm(!showForm)}
//             >
//               {showForm ? "✖ Close" : "+ Add Central Lab"}
//             </button>
//           </div>

//           {/* FORM */}
//           {showForm && (
//             <div className="px-3">
//               <CentralLabForm />
//             </div>
//           )}

//           <div className="card-header">
//             <h5>Central Lab List</h5>
//           </div>

//           <div className="card-body">

//             {/* Search */}
//             <div className="d-flex justify-content-between mb-3">
//               <div>
//                 Show
//                 <select
//                   className="mx-2 entries-select"
//                   value={entries}
//                   onChange={(e) => {
//                     setEntries(Number(e.target.value));
//                     setCurrentPage(1);
//                   }}
//                 >
//                   <option value={5}>5</option>
//                   <option value={10}>10</option>
//                   <option value={25}>25</option>
//                 </select>
//                 entries
//               </div>

//               <div>
//                 Search :
//                 <input
//                   type="text"
//                   className="ms-2 search-box"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                 />
//               </div>
//             </div>

//             {/* TABLE */}
//             <div className="table-scroll" style={{ maxHeight: "700px", overflowY: "auto" }}>
//               <table className="table table-bordered all-table">
//                 <thead>
//                   <tr>
//                     <th>Code</th>
//                     <th>Lab Name</th>
//                     <th>Location</th>
//                     <th>Lab Type</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {currentData.length === 0 ? (
//                     <tr>
//                       <td colSpan="5" className="text-center">No Data Found</td>
//                     </tr>
//                   ) : (
//                     currentData.map((item, index) => (
//                       <tr key={index}>
//                         <td>{item.code}</td>
//                         <td>{item.labname}</td>
//                         <td>{item.location}</td>
//                         <td>{item.labtype}</td>
//                         <td>
//                           <button
//                             className="btn btn-sm btn-warning me-2"
//                             onClick={() =>
//                               navigate(`/centrallab/create/${index}`)

//                             }
//                           >
//                             <i className="fa-solid fa-pen"></i>
//                           </button>

//                           <button
//                             onClick={() => handleDelete(index)}
//                             className="btn btn-sm btn-danger"
//                           >
//                             <i className="fa-solid fa-trash"></i>
//                           </button>
//                           <button
//                             className="btn btn-sm btn-success ms-2"
//                             onClick={handleDownloadAll}
//                           >
//                             <i className="fa-solid fa-download"></i>
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* PAGINATION */}
//             <div className="d-flex justify-content-between mt-3">
//               <div>
//                 Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1} to{" "}
//                 {Math.min(indexOfLast, filteredData.length)} of{" "}
//                 {filteredData.length}
//               </div>

//               <ul className="pagination mb-0">
//                 <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                   <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
//                     Prev
//                   </button>
//                 </li>

//                 {[...Array(totalPages)].map((_, i) => (
//                   <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
//                     <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
//                       {i + 1}
//                     </button>
//                   </li>
//                 ))}

//                 <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
//                   <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   );
// }
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CentralLabForm from "./CentralLabForm";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../Style/FormTable.css";

// ─── Constants (keep in sync with CentralLabForm) ────────────────────────────
const TESTING_FIELDS = {
  ETO: [
    { name: "etoConcentration", label: "ETO Concentration" },
    { name: "exposureTime", label: "Exposure Time" },
    { name: "temperature", label: "Temperature" },
    { name: "humidity", label: "Humidity" },
    { name: "residueLevel", label: "Residue Level" },
  ],
  Micro: [
    { name: "totalPlateCount", label: "Total Plate Count" },
    { name: "yeastMold", label: "Yeast & Mold" },
    { name: "eColi", label: "E. Coli" },
    { name: "salmonella", label: "Salmonella" },
    { name: "coliformBacteria", label: "Coliform Bacteria" },
  ],
  Physical: [
    { name: "textureAnalysis", label: "Texture Analysis" },
    { name: "colorMeasurement", label: "Color Measurement" },
    { name: "moistureContent", label: "Moisture Content" },
    { name: "particleSizeShape", label: "Particle Size & Shape" },
    { name: "viscosity", label: "Viscosity" },
    { name: "densitySpecificGravity", label: "Density / Specific Gravity" },
    { name: "waterActivity", label: "Water Activity" },
  ],
  Chemical: [
    { name: "phLevel", label: "pH Level" },
    { name: "ashContent", label: "Ash Content" },
    { name: "proteinContent", label: "Protein Content" },
    { name: "fatContent", label: "Fat Content" },
    { name: "peroxideValue", label: "Peroxide Value" },
    { name: "heavyMetals", label: "Heavy Metals" },
  ],
  Presticide: [
    { name: "activeIngredient", label: "Active Ingredient" },
    { name: "concentration", label: "Concentration" },
    { name: "solventUsed", label: "Solvent Used" },
    { name: "stabilityTest", label: "Stability Test" },
    { name: "phOfSolution", label: "pH of Solution" },
  ],
};

function getCalibStatus(nextDate) {
  if (!nextDate) return null;
  const diff = Math.ceil((new Date(nextDate) - new Date()) / 86400000);
  if (diff < 0) return "Expired";
  if (diff <= 30) return "Due Soon";
  return "Valid";
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ record, onClose }) {
  if (!record) return null;

  const tests = record.tests || [];
  const scientists = record.scientists || [];
  const materials = record.materials || [];
  const instruments = record.instruments || [];

  // ── PDF Export ──────────────────────────────────────────────────────────────
  function handlePrintPDF() {
    const doc = new jsPDF();
    let y = 18;

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("Central Lab — Full Report", 14, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y);
    y += 10;
    doc.setTextColor(0);

    // ── Lab Info ──
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.text("Lab Information", 14, y);
    y += 2;
    autoTable(doc, {
      startY: y,
      head: [["Field", "Value"]],
      body: [
        ["Code", record.code || "—"],
        ["Lab Name", record.labname || "—"],
        ["Location", record.location || "—"],
        ["Lab Type", record.labtype || "—"],
      ],
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    y = doc.lastAutoTable.finalY + 8;

    // ── Lab Tests ──
    if (tests.length > 0) {
      if (y > 240) {
        doc.addPage();
        y = 18;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(`Lab Tests (${tests.length})`, 14, y);
      y += 2;

      tests.forEach((t, ti) => {
        if (y > 240) {
          doc.addPage();
          y = 18;
        }
        const dynFields = TESTING_FIELDS[t.testingType] || [];
        const baseRows = [
          ["Lab Code", t.labCode || "—"],
          ["Company Code", t.companyCode || "—"],
          ["Company Name", t.companyName || "—"],
          ["Lab Test Code", t.labTestCode || "—"],
          ["Location", t.testLocation || "—"],
          ["Testing Company", t.testingCompanyName || "—"],
          ["Testing Type", t.testingType || "—"],
        ];
        const paramRows = dynFields.map((f) => [f.label, t[f.name] || "—"]);

        autoTable(doc, {
          startY: y,
          head: [
            [
              {
                content: `Test ${ti + 1}: ${t.labTestCode || "—"}`,
                colSpan: 2,
                styles: {
                  fillColor: [239, 246, 255],
                  textColor: [37, 99, 235],
                  fontStyle: "bold",
                },
              },
            ],
          ],
          body: [
            ...baseRows,
            ...(paramRows.length ? [["— Parameters —", ""], ...paramRows] : []),
          ],
          theme: "grid",
          styles: { fontSize: 9 },
          columnStyles: { 0: { fontStyle: "bold", cellWidth: 60 } },
        });
        y = doc.lastAutoTable.finalY + 5;
      });
    }

    // ── Scientists ──
    if (scientists.length > 0) {
      if (y > 240) {
        doc.addPage();
        y = 18;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(`Scientists (${scientists.length})`, 14, y);
      y += 2;
      autoTable(doc, {
        startY: y,
        head: [["User ID", "Name", "Role", "Lab Code"]],
        body: scientists.map((s) => [
          s.userId || "—",
          s.name || "—",
          s.role || "—",
          s.labCode || "—",
        ]),
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [37, 99, 235] },
      });
      y = doc.lastAutoTable.finalY + 8;
    }

    // ── Materials ──
    if (materials.length > 0) {
      if (y > 240) {
        doc.addPage();
        y = 18;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(`Raw Materials (${materials.length})`, 14, y);
      y += 2;
      autoTable(doc, {
        startY: y,
        head: [["Code", "Name", "Category", "Supplier", "Storage"]],
        body: materials.map((m) => [
          m.materialCode || "—",
          m.materialName || "—",
          m.category || "—",
          m.supplier || "—",
          m.storageCondition || "—",
        ]),
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [37, 99, 235] },
      });
      y = doc.lastAutoTable.finalY + 8;
    }

    // ── Instruments ──
    if (instruments.length > 0) {
      if (y > 240) {
        doc.addPage();
        y = 18;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.text(`Instruments (${instruments.length})`, 14, y);
      y += 2;
      autoTable(doc, {
        startY: y,
        head: [["ID", "Name", "Model", "Calibrated", "Next Calib.", "Status"]],
        body: instruments.map((ins) => [
          ins.instrumentId || "—",
          ins.instrumentName || "—",
          ins.model || "—",
          ins.calibrationDate || "—",
          ins.nextCalibrationDate || "—",
          getCalibStatus(ins.nextCalibrationDate) || "—",
        ]),
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [37, 99, 235] },
      });
    }

    doc.save(`Lab_Report_${record.code || "export"}.pdf`);
  }

  const calibBadgeStyle = (status) => {
    if (status === "Valid") return { background: "#dcfce7", color: "#15803d" };
    if (status === "Due Soon")
      return { background: "#fef9c3", color: "#92400e" };
    if (status === "Expired")
      return { background: "#fee2e2", color: "#dc2626" };
    return { background: "#f1f5f9", color: "#64748b" };
  };

  const sectionTitle = (label) => (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#2563eb",
        textTransform: "uppercase",
        letterSpacing: "1px",
        margin: "18px 0 10px",
        paddingBottom: 6,
        borderBottom: "1.5px solid #eff6ff",
      }}
    >
      {label}
    </div>
  );

  const infoGrid = (pairs) => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 8,
        marginBottom: 8,
      }}
    >
      {pairs.map(([k, v]) => (
        <div
          key={k}
          style={{
            background: "#f8fafc",
            borderRadius: 8,
            padding: "8px 12px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 2,
            }}
          >
            {k}
          </div>
          <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 13 }}>
            {v || "—"}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.65)",
        zIndex: 1050,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "120px 12px 10px 12px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          width: "100%",
          maxWidth: "70%",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #2563eb, #1e40af)",
            padding: "24px 28px",
            borderRadius: "16px 16px 0 0",
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 3px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  opacity: 0.7,
                }}
              >
                Central Lab System
              </p>
              <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>
                {record.labname}
              </h2>
              <p style={{ margin: 0, fontSize: 12, opacity: 0.8 }}>
                {record.code} · {record.location} · {record.labtype}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={handlePrintPDF}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1.5px solid rgba(255,255,255,0.5)",
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                🖨 Print PDF
              </button>
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1.5px solid rgba(255,255,255,0.4)",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: 18,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div
          style={{ padding: "24px 28px", maxHeight: "72vh", overflowY: "auto" }}
        >
          {/* Lab Info */}
          {sectionTitle("🏢 Lab Information")}
          {infoGrid([
            ["Code", record.code],
            ["Lab Name", record.labname],
            ["Location", record.location],
            ["Lab Type", record.labtype],
          ])}

          {/* Lab Tests */}
          {sectionTitle(`🧪 Lab Tests (${tests.length})`)}
          {tests.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              No tests recorded.
            </p>
          ) : (
            tests.map((t, i) => {
              const dynFields = TESTING_FIELDS[t.testingType] || [];
              return (
                <div
                  key={i}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "14px 16px",
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#2563eb",
                      marginBottom: 10,
                    }}
                  >
                    Test {i + 1} — {t.labTestCode || "—"}
                    {t.testingType && (
                      <span
                        style={{
                          marginLeft: 8,
                          background: "#eff6ff",
                          color: "#2563eb",
                          padding: "1px 9px",
                          borderRadius: 12,
                          fontSize: 11,
                        }}
                      >
                        {t.testingType}
                      </span>
                    )}
                  </div>
                  {infoGrid([
                    ["Lab Code", t.labCode],
                    ["Company Code", t.companyCode],
                    ["Company Name", t.companyName],
                    ["Location", t.testLocation],
                    ["Testing Company", t.testingCompanyName],
                  ])}
                  {dynFields.length > 0 && (
                    <>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          margin: "8px 0 6px",
                        }}
                      >
                        {t.testingType} Parameters
                      </div>
                      {infoGrid(dynFields.map((f) => [f.label, t[f.name]]))}
                    </>
                  )}
                </div>
              );
            })
          )}

          {/* Scientists */}
          {sectionTitle(`🔬 Scientists (${scientists.length})`)}
          {scientists.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              No scientists recorded.
            </p>
          ) : (
            <div
              style={{
                overflowX: "auto",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ background: "#eff6ff" }}>
                    {["User ID", "Name", "Role", "Lab Code"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "9px 14px",
                          textAlign: "left",
                          color: "#2563eb",
                          fontWeight: 700,
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scientists.map((s, i) => (
                    <tr
                      key={i}
                      style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}
                    >
                      <td
                        style={{
                          padding: "9px 14px",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <code
                          style={{
                            fontSize: 11,
                            color: "#2563eb",
                            background: "#eff6ff",
                            padding: "2px 7px",
                            borderRadius: 5,
                          }}
                        >
                          {s.userId || "—"}
                        </code>
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          borderBottom: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        {s.name}
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {s.role || "—"}
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {s.labCode || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Raw Materials */}
          {sectionTitle(`📦 Raw Materials (${materials.length})`)}
          {materials.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              No materials recorded.
            </p>
          ) : (
            <div
              style={{
                overflowX: "auto",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ background: "#eff6ff" }}>
                    {["Code", "Name", "Category", "Supplier", "Storage"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            padding: "9px 14px",
                            textAlign: "left",
                            color: "#2563eb",
                            fontWeight: 700,
                            fontSize: 11,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m, i) => (
                    <tr
                      key={i}
                      style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}
                    >
                      <td
                        style={{
                          padding: "9px 14px",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        <code
                          style={{
                            fontSize: 11,
                            color: "#2563eb",
                            background: "#eff6ff",
                            padding: "2px 7px",
                            borderRadius: 5,
                          }}
                        >
                          {m.materialCode}
                        </code>
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          borderBottom: "1px solid #e2e8f0",
                          fontWeight: 600,
                        }}
                      >
                        {m.materialName}
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {m.category || "—"}
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {m.supplier || "—"}
                      </td>
                      <td
                        style={{
                          padding: "9px 14px",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {m.storageCondition || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Instruments */}
          {sectionTitle(`⚙️ Instruments (${instruments.length})`)}
          {instruments.length === 0 ? (
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              No instruments recorded.
            </p>
          ) : (
            <div
              style={{
                overflowX: "auto",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                }}
              >
                <thead>
                  <tr style={{ background: "#eff6ff" }}>
                    {[
                      "ID",
                      "Name",
                      "Model",
                      "Calibrated",
                      "Next Calib.",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "9px 14px",
                          textAlign: "left",
                          color: "#2563eb",
                          fontWeight: 700,
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          borderBottom: "1px solid #e2e8f0",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {instruments.map((ins, i) => {
                    const st = getCalibStatus(ins.nextCalibrationDate);
                    const bs = calibBadgeStyle(st);
                    return (
                      <tr
                        key={i}
                        style={{
                          background:
                            st === "Expired"
                              ? "#fff1f2"
                              : st === "Due Soon"
                                ? "#fffbeb"
                                : i % 2 === 0
                                  ? "#fff"
                                  : "#f8fafc",
                        }}
                      >
                        <td
                          style={{
                            padding: "9px 14px",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          <code
                            style={{
                              fontSize: 11,
                              color: "#2563eb",
                              background: "#eff6ff",
                              padding: "2px 7px",
                              borderRadius: 5,
                            }}
                          >
                            {ins.instrumentId}
                          </code>
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            borderBottom: "1px solid #e2e8f0",
                            fontWeight: 600,
                          }}
                        >
                          {ins.instrumentName}
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {ins.model || "—"}
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {ins.calibrationDate || "—"}
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {ins.nextCalibrationDate || "—"}
                        </td>
                        <td
                          style={{
                            padding: "9px 14px",
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {st ? (
                            <span
                              style={{
                                ...bs,
                                display: "inline-block",
                                padding: "2px 10px",
                                borderRadius: 20,
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              {st}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div
            style={{
              marginTop: 20,
              paddingTop: 14,
              borderTop: "1px solid #e2e8f0",
              fontSize: 11,
              color: "#64748b",
            }}
          >
            System-generated report. Verify all values before submission.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Table Component ─────────────────────────────────────────────────────
export default function CentralLabTable({
  records,
  handleDelete,
  onRecordsChange,
}) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);

  const filteredData = records.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  const indexOfLast = currentPage * entries;
  const indexOfFirst = indexOfLast - entries;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / entries);

  // Download ALL records as PDF
  function handleDownloadAll() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Central Lab Records", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Code", "Lab Name", "Location", "Lab Type"]],
      body: records.map((item) => [
        item.code,
        item.labname,
        item.location,
        item.labtype,
      ]),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    doc.save("Central_Lab_Records.pdf");
  }

  // Called after inline form saves — refresh parent
  function handleFormSaved() {
    setShowForm(false);
    if (onRecordsChange) onRecordsChange();
  }

  return (
    <>
      <div className="main-content">
        <div className="container-fluid mt-3" >
          <div className="card" style={{ marginTop: "30px"}}>
            {/* Top Action Buttons */}
            <div className="d-flex justify-content-end p-3 gap-2 flex-wrap " >
              {/* <button className="btn btn-light">
                <Link
                  to="/centrallab/lablist"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  + Lab List
                </Link>
              </button> */}
              {/* <button className="btn btn-light" onClick={handleDownloadAll}>
                ⬇ Download All PDF
              </button> */}
              <button
                className="btn btn-primary"
                onClick={() => navigate("/centrallab/create")}
              >
                + Add Central Lab
              </button>
            </div>

            <div className="card-header">
              <h5 className="mb-0">Central Lab List</h5>
            </div>

            <div className="card-body">
              {/* Controls */}
              <div className="d-flex justify-content-between mb-3 flex-wrap gap-2">
                <div>
                  Show
                  <select
                    className="mx-2 entries-select"
                    value={entries}
                    onChange={(e) => {
                      setEntries(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                  entries
                </div>
                <div>
                  Search:
                  <input
                    type="text"
                    className="ms-2 search-box"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              {/* Table */}
              <div
                className="table-scroll"
                style={{ maxHeight: "700px", overflowY: "auto" }}
              >
                <table className="table table-bordered all-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Lab Name</th>
                      <th>Location</th>
                      <th>Lab Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No Data Found
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item, index) => {
                        // Real index in the full records array (needed for edit/delete)
                        const realIndex = records.indexOf(item);
                        return (
                          <tr
                            key={index}
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              // Don't open detail if clicking action buttons
                              if (
                                e.target.closest("button") ||
                                e.target.closest("a")
                              )
                                return;
                              setDetailRecord({ ...item, _index: realIndex });
                            }}
                          >
                            <td>{item.code}</td>
                            <td>{item.labname}</td>
                            <td>{item.location}</td>
                            <td>{item.labtype}</td>
                            <td onClick={(e) => e.stopPropagation()}>
                              <div className="d-flex gap-1 flex-wrap">
                                {/* Edit */}
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() =>
                                    navigate(`/centrallab/create/${realIndex}`)
                                  }
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen"></i>
                                </button>

                                {/* Delete */}
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(realIndex)}
                                  title="Delete"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>

                                {/* Download single row PDF */}
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() =>
                                    setDetailRecord({
                                      ...item,
                                      _index: realIndex,
                                    })
                                  }
                                  title="View Details"
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="d-flex justify-content-between mt-3 flex-wrap gap-2">
                <div>
                  Showing {filteredData.length === 0 ? 0 : indexOfFirst + 1} to{" "}
                  {Math.min(indexOfLast, filteredData.length)} of{" "}
                  {filteredData.length}
                </div>
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Prev
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailRecord && (
        <DetailModal
          record={detailRecord}
          onClose={() => setDetailRecord(null)}
        />
      )}
    </>
  );
}
