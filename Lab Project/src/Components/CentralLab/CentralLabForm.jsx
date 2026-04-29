import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── PDF Export Function ──────────────────────────────────────────────────────
function generateLabPDF(record) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = 15;

  // Helper function to add section title
  function addSectionTitle(title) {
    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0);
    doc.text(title, margin, yPosition);
    yPosition += 7;

    // Draw line under title
    doc.setDrawColor(200);
    doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
    yPosition += 5;
  }

  // Helper function to check page space
  function checkPageSpace(spaceNeeded) {
    if (yPosition + spaceNeeded > pageHeight - 15) {
      doc.addPage();
      yPosition = 15;
    }
  }

  // Title
  doc.setFontSize(18);
  doc.setFont(undefined, "bold");
  doc.setTextColor(0);
  doc.text("Submission Summary", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 12;

  // Lab Info Section
  addSectionTitle("Lab Info");

  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  const labInfoData = [
    ["Code", record.code],
    ["Lab Name", record.labname],
    ["Location", record.location],
    ["Lab Type", record.labtype],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: labInfoData,
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: contentWidth * 0.3 },
      1: { cellWidth: contentWidth * 0.7 },
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
      textColor: 0,
      lineColor: 220,
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });
  yPosition = doc.lastAutoTable.finalY + 8;

  // Lab Test Entries Section
  if (record.tests && record.tests.length > 0) {
    checkPageSpace(40);
    addSectionTitle(`Lab Test Entries (${record.tests.length})`);

    const testData = record.tests.map((t) => [
      t.labCode || "",
      t.companyName || "",
      t.labTestCode || "",
      t.testingType || "",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Lab Code", "Company", "Test Code", "Type"]],
      body: testData,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 2.5,
        textColor: 0,
        lineColor: 220,
        lineWidth: 0.1,
      },
      headStyles: {
        fontStyle: "bold",
        fillColor: [230, 230, 230],
        textColor: 0,
        lineColor: 150,
        lineWidth: 0.5,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
    });
    yPosition = doc.lastAutoTable.finalY + 8;
  }

  // Scientists Section
  if (record.scientists && record.scientists.length > 0) {
    checkPageSpace(40);
    addSectionTitle(`Scientists (${record.scientists.length})`);

    const scientistData = record.scientists.map((s) => [
      s.userId || "",
      s.name || "",
      s.role || "",
      s.labCode || "",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["User ID", "Name", "Role", "Lab Code"]],
      body: scientistData,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 2.5,
        textColor: 0,
        lineColor: 220,
        lineWidth: 0.1,
      },
      headStyles: {
        fontStyle: "bold",
        fillColor: [230, 230, 230],
        textColor: 0,
        lineColor: 150,
        lineWidth: 0.5,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
    });
    yPosition = doc.lastAutoTable.finalY + 8;
  }

  // Materials Section
  if (record.materials && record.materials.length > 0) {
    checkPageSpace(40);
    addSectionTitle(`Materials (${record.materials.length})`);

    const materialData = record.materials.map((m) => [
      m.materialCode || "",
      m.materialName || "",
      m.category || "",
      m.supplier || "",
      m.storageCondition || "",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["Code", "Name", "Category", "Supplier", "Storage"]],
      body: materialData,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 2.5,
        textColor: 0,
        lineColor: 220,
        lineWidth: 0.1,
      },
      headStyles: {
        fontStyle: "bold",
        fillColor: [230, 230, 230],
        textColor: 0,
        lineColor: 150,
        lineWidth: 0.5,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
    });
    yPosition = doc.lastAutoTable.finalY + 8;
  }

  // Instruments Section
  if (record.instruments && record.instruments.length > 0) {
    checkPageSpace(40);
    addSectionTitle(`Instruments (${record.instruments.length})`);

    const instrumentData = record.instruments.map((ins) => [
      ins.instrumentId || "",
      ins.instrumentName || "",
      ins.model || "",
      ins.calibrationDate || "",
      ins.nextCalibrationDate || "",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [["ID", "Name", "Model", "Calibrated", "Next Calib."]],
      body: instrumentData,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 2.5,
        textColor: 0,
        lineColor: 220,
        lineWidth: 0.1,
      },
      headStyles: {
        fontStyle: "bold",
        fillColor: [230, 230, 230],
        textColor: 0,
        lineColor: 150,
        lineWidth: 0.5,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
    });
  }

  // Footer with page numbers
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(9);
  doc.setTextColor(128);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 8, {
      align: "center",
    });
  }

  doc.save(`lab-report-${record.code}.pdf`);
}

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  primaryLight: "#eff6ff",
  border: "#e2e8f0",
  text: "#1e293b",
  muted: "#64748b",
  bg: "#f8fafc",
  white: "#ffffff",
  success: "#16a34a",
  danger: "#dc2626",
  warn: "#d97706",
};

// ─── Testing Type Fields ──────────────────────────────────────────────────────
const TESTING_FIELDS = {
  ETO: [
    {
      name: "etoConcentration",
      label: "ETO Concentration",
      placeholder: "e.g. 600 mg/L",
    },
    {
      name: "exposureTime",
      label: "Exposure Time",
      placeholder: "e.g. 4 hours",
    },
    { name: "temperature", label: "Temperature", placeholder: "e.g. 54°C" },
    { name: "humidity", label: "Humidity", placeholder: "e.g. 60%" },
    {
      name: "residueLevel",
      label: "Residue Level",
      placeholder: "e.g. < 10 ppm",
    },
  ],
  Micro: [
    {
      name: "totalPlateCount",
      label: "Total Plate Count",
      placeholder: "e.g. < 100 CFU/g",
    },
    {
      name: "yeastMold",
      label: "Yeast & Mold",
      placeholder: "e.g. < 10 CFU/g",
    },
    { name: "eColi", label: "E. Coli", placeholder: "e.g. Absent/25g" },
    { name: "salmonella", label: "Salmonella", placeholder: "e.g. Absent/25g" },
    {
      name: "coliformBacteria",
      label: "Coliform Bacteria",
      placeholder: "e.g. < 3 MPN/g",
    },
  ],
  Physical: [
    {
      name: "textureAnalysis",
      label: "Texture Analysis",
      placeholder: "e.g. Firm, 8.5 N",
    },
    {
      name: "colorMeasurement",
      label: "Color Measurement",
      placeholder: "e.g. L*=92",
    },
    {
      name: "moistureContent",
      label: "Moisture Content",
      placeholder: "e.g. 12.5%",
    },
    {
      name: "particleSizeShape",
      label: "Particle Size & Shape",
      placeholder: "e.g. 50–100 µm",
    },
    { name: "viscosity", label: "Viscosity", placeholder: "e.g. 450 mPa·s" },
    {
      name: "densitySpecificGravity",
      label: "Density / Specific",
      placeholder: "e.g. 1.05 g/cm³",
    },
    {
      name: "waterActivity",
      label: "Water Activity",
      placeholder: "e.g. 0.87 aw",
    },
  ],
  Chemical: [
    { name: "phLevel", label: "pH Level", placeholder: "e.g. 6.8" },
    { name: "ashContent", label: "Ash Content", placeholder: "e.g. 1.2%" },
    {
      name: "proteinContent",
      label: "Protein Content",
      placeholder: "e.g. 18.5%",
    },
    { name: "fatContent", label: "Fat Content", placeholder: "e.g. 5.3%" },
    {
      name: "peroxideValue",
      label: "Peroxide Value",
      placeholder: "e.g. 2.1 meq/kg",
    },
    {
      name: "heavyMetals",
      label: "Heavy Metals",
      placeholder: "e.g. Pb < 0.5 ppm",
    },
  ],
  Presticide: [
    {
      name: "activeIngredient",
      label: "Active Ingredient",
      placeholder: "e.g. Chlorpyrifos",
    },
    {
      name: "concentration",
      label: "Concentration",
      placeholder: "e.g. 500 g/L",
    },
    { name: "solventUsed", label: "Solvent Used", placeholder: "e.g. Xylene" },
    {
      name: "stabilityTest",
      label: "Stability Test",
      placeholder: "e.g. Stable at 54°C",
    },
    { name: "phOfSolution", label: "pH of Solution", placeholder: "e.g. 6.5" },
  ],
};

const ROLES = [
  "Lab Technician",
  "Senior Scientist",
  "QA Analyst",
  "Lab Manager",
];
const CATEGORIES = [
  "Chemical",
  "Biological",
  "Physical Sample",
  "Reference Standard",
];
const STORAGE = ["Room Temperature", "Refrigerated", "Frozen", "Dark & Dry"];

function genId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

function getCalibStatus(nextDate) {
  if (!nextDate) return null;
  const diff = Math.ceil((new Date(nextDate) - new Date()) / 86400000);
  if (diff < 0) return "Expired";
  if (diff <= 30) return "Due Soon";
  return "Valid";
}

// ─── Atoms ────────────────────────────────────────────────────────────────────
function FInput({ label, error, style: xStyle, ...props }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 15,
            fontWeight: 800,
            color: C.muted,
            marginBottom: 7,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
          }}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        onFocus={(e) => {
          setF(true);
          props.onFocus && props.onFocus(e);
        }}
        onBlur={(e) => {
          setF(false);
          props.onBlur && props.onBlur(e);
        }}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "13px 15px",
          borderRadius: 8,
          border: `2px solid ${error ? C.danger : f ? C.primary : C.border}`,
          background: C.white,
          color: C.text,
          fontSize: 16,
          fontWeight: 500,
          outline: "none",
          transition: "border 0.15s, box-shadow 0.15s",
          boxShadow: f ? `0 0 0 3px ${C.primary}20` : "none",
          ...xStyle,
        }}
      />
      {error && (
        <p
          style={{
            color: C.danger,
            fontSize: 12,
            margin: "5px 0 0",
            fontWeight: 700,
          }}
        >
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

function FSelect({ label, error, children, ...props }) {
  const [f, setF] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 15,
            fontWeight: 800,
            color: C.muted,
            marginBottom: 7,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
          }}
        >
          {label}
        </label>
      )}
      <select
        {...props}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "13px 15px",
          borderRadius: 8,
          border: `2px solid ${error ? C.danger : f ? C.primary : C.border}`,
          background: C.white,
          color: props.value ? C.text : C.muted,
          fontSize: 16,
          fontWeight: 500,
          outline: "none",
          cursor: "pointer",
          boxShadow: f ? `0 0 0 3px ${C.primary}20` : "none",
          transition: "border 0.15s",
        }}
      >
        {children}
      </select>
      {error && (
        <p
          style={{
            color: C.danger,
            fontSize: 12,
            margin: "5px 0 0",
            fontWeight: 700,
          }}
        >
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

function Btn({
  children,
  variant = "primary",
  size = "md",
  full,
  style: xs,
  ...props
}) {
  const [hov, setHov] = useState(false);
  const v = {
    primary: {
      bg: C.primary,
      hbg: C.primaryDark,
      color: C.white,
      border: "none",
    },
    success: { bg: C.success, hbg: "#15803d", color: C.white, border: "none" },
    danger: { bg: "#fee2e2", hbg: "#fecaca", color: C.danger, border: "none" },
    ghost: {
      bg: "transparent",
      hbg: C.primaryLight,
      color: C.primary,
      border: "none",
    },
    outline: {
      bg: C.white,
      hbg: C.primaryLight,
      color: C.primary,
      border: `1.5px solid ${C.primary}`,
    },
  }[variant];
  const pad =
    size === "sm" ? "5px 12px" : size === "lg" ? "12px 24px" : "8px 16px";
  const fs = size === "sm" ? 12 : 14;
  return (
    <button
      {...props}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: pad,
        borderRadius: 8,
        border: v.border,
        background: hov ? v.hbg : v.bg,
        color: v.color,
        fontSize: fs,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
        transform: hov ? "translateY(-1px)" : "none",
        boxShadow:
          hov && variant === "primary" ? `0 4px 12px ${C.primary}40` : "none",
        width: full ? "100%" : "auto",
        ...xs,
      }}
    >
      {children}
    </button>
  );
}

function Badge({ status }) {
  const map = {
    Valid: { bg: "#dcfce7", color: "#15803d" },
    "Due Soon": { bg: "#fef9c3", color: "#92400e" },
    Expired: { bg: "#fee2e2", color: C.danger },
    "Pending Review": { bg: "#dbeafe", color: C.primary },
    "Lab Technician": { bg: "#f1f5f9", color: C.muted },
    "Senior Scientist": { bg: "#ede9fe", color: "#7c3aed" },
    "QA Analyst": { bg: "#fef3c7", color: "#92400e" },
    "Lab Manager": { bg: "#dcfce7", color: "#15803d" },
  };
  const s = map[status] || { bg: "#f1f5f9", color: C.muted };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        background: s.bg,
        color: s.color,
        letterSpacing: "0.3px",
      }}
    >
      {status}
    </span>
  );
}

function EmptyState({ msg = "No records found" }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 20px",
        color: C.muted,
        border: `1.5px dashed ${C.border}`,
        borderRadius: 12,
        marginTop: 12,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{msg}</p>
      <p style={{ margin: "4px 0 0", fontSize: 12 }}>
        Add a record using the form above
      </p>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <span
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: 13,
          color: C.muted,
          pointerEvents: "none",
        }}
      >
        🔍
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search..."}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "8px 12px 8px 32px",
          borderRadius: 8,
          border: `1.5px solid ${C.border}`,
          fontSize: 13,
          color: C.text,
          background: C.bg,
          outline: "none",
        }}
      />
    </div>
  );
}

function Divider({ label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "20px 0 14px",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: C.primary,
          textTransform: "uppercase",
          letterSpacing: "1px",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: `${C.primary}30` }} />
    </div>
  );
}

function Th({ children }) {
  return (
    <th
      style={{
        padding: "10px 14px",
        textAlign: "left",
        background: C.primaryLight,
        color: C.primary,
        fontWeight: 700,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        borderBottom: `1px solid ${C.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}
function Td({ children, s }) {
  return (
    <td
      style={{
        padding: "10px 14px",
        borderBottom: `1px solid ${C.border}`,
        color: C.text,
        verticalAlign: "middle",
        ...s,
      }}
    >
      {children}
    </td>
  );
}

function ActionBtns({ onEdit, onDelete }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <Btn variant="ghost" size="sm" onClick={onEdit}>
        ✏ Edit
      </Btn>
      <Btn variant="danger" size="sm" onClick={onDelete}>
        🗑
      </Btn>
    </div>
  );
}

// ─── Toast System ─────────────────────────────────────────────────────────────
function ToastStack({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 340,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            padding: "12px 18px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 13,
            background:
              t.type === "success"
                ? C.success
                : t.type === "error"
                  ? C.danger
                  : C.warn,
            color: C.white,
            boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "clToastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {t.type === "success" ? "✓" : "⚠"} {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Scientist Sub-Tab ────────────────────────────────────────────────────────
const ScientistSubTab = forwardRef(function ScientistSubTab(
  { scientists, setScientists, showToast, initialForm },
  ref,
) {
  const makeBlank = () => ({
    userId: genId("USR"),
    name: "",
    role: "",
    labCode: "",
  });
  const [form, setForm] = useState(makeBlank());
  const [errors, setErrors] = useState({});
  const [editIdx, setEditIdx] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
      const idx = scientists.indexOf(initialForm);
      if (idx !== -1) setEditIdx(idx);
    }
  }, [initialForm, scientists]);

  function commitPending() {
    const nonEmpty = Object.values(form).some((v) =>
      typeof v === "string" ? v.trim() !== "" : !!v,
    );
    if (!nonEmpty) return true;
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      showToast(
        "Please fill required fields in Scientist tab before final submit",
        "error",
      );
      return false;
    }
    handleSubmit();
    return true;
  }

  function hasContent() {
    return Object.values(form).some((v) =>
      typeof v === "string" ? v.trim() !== "" : !!v,
    );
  }

  function getFullItems() {
    const current = scientists || [];
    if (!hasContent()) return current;
    const e = validate();
    if (Object.keys(e).length) return current;
    if (editIdx !== null) return current;
    return [...current, form];
  }

  useImperativeHandle(ref, () => ({ commitPending, hasContent, getFullItems }));

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.role) e.role = "Role is required";
    if (!form.labCode.trim()) e.labCode = "Lab Code is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      showToast("Please fill required fields", "error");
      return;
    }
    if (editIdx !== null) {
      setScientists((l) => l.map((x, i) => (i === editIdx ? form : x)));
      showToast("Scientist updated!", "success");
      setEditIdx(null);
    } else {
      setScientists((l) => [...l, form]);
      showToast("Scientist added!", "success");
    }
    setForm(makeBlank());
    setErrors({});
  }

  const filtered = scientists.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.labCode.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <Divider label={editIdx !== null ? "Edit Scientist" : "Add Scientist"} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "0 16px",
        }}
      >
        <FInput
          label="User ID"
          value={form.userId}
          onChange={(e) => set("userId", e.target.value)}
          placeholder="Auto-generated"
        />
        <FInput
          label="Name *"
          value={form.name}
          error={errors.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Full name"
        />
        <FSelect
          label="Role *"
          value={form.role}
          error={errors.role}
          onChange={(e) => set("role", e.target.value)}
        >
          <option value="">— Select Role —</option>
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </FSelect>
        <FInput
          label="Lab Code *"
          value={form.labCode}
          error={errors.labCode}
          onChange={(e) => set("labCode", e.target.value)}
          placeholder="e.g. LAB-001"
        />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="primary" onClick={handleSubmit}>
          {editIdx !== null ? "✔ Update Scientist" : "+ Add Scientist"}
        </Btn>
        {editIdx !== null && (
          <Btn
            variant="ghost"
            onClick={() => {
              setForm(makeBlank());
              setEditIdx(null);
              setErrors({});
            }}
          >
            Cancel
          </Btn>
        )}
      </div>
      <Divider label={`Scientist List (${scientists.length})`} />
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name or lab code..."
      />
      {filtered.length === 0 ? (
        <EmptyState msg="No scientists added yet" />
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: 10,
            border: `1px solid ${C.border}`,
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                <Th>User ID</Th>
                <Th>Name</Th>
                <Th>Role</Th>
                <Th>Lab Code</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const idx = scientists.indexOf(s);
                return (
                  <tr
                    key={i}
                    style={{ background: i % 2 === 0 ? C.white : C.bg }}
                  >
                    <Td>
                      <code
                        style={{
                          fontSize: 11,
                          color: C.primary,
                          background: C.primaryLight,
                          padding: "2px 7px",
                          borderRadius: 5,
                        }}
                      >
                        {s.userId}
                      </code>
                    </Td>
                    <Td>
                      <strong>{s.name}</strong>
                    </Td>
                    <Td>
                      <Badge status={s.role} />
                    </Td>
                    <Td>{s.labCode}</Td>
                    <Td>
                      <ActionBtns
                        onEdit={() => {
                          setForm(s);
                          setEditIdx(idx);
                        }}
                        onDelete={() => {
                          setScientists((l) => l.filter((_, j) => j !== idx));
                          showToast("Scientist removed", "error");
                        }}
                      />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

// ─── Raw Material Sub-Tab ─────────────────────────────────────────────────────
const RawMaterialSubTab = forwardRef(function RawMaterialSubTab(
  { materials, setMaterials, showToast, initialForm },
  ref,
) {
  const makeBlank = () => ({
    materialCode: "",
    materialName: "",
    category: "",
    supplier: "",
    storageCondition: "",
  });
  const [form, setForm] = useState(makeBlank());
  const [errors, setErrors] = useState({});
  const [editIdx, setEditIdx] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
      const idx = materials.indexOf(initialForm);
      if (idx !== -1) setEditIdx(idx);
    }
  }, [initialForm, materials]);

  function commitPending() {
    const nonEmpty = Object.values(form).some((v) =>
      typeof v === "string" ? v.trim() !== "" : !!v,
    );
    if (!nonEmpty) return true;
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      showToast(
        "Please fill required fields in Raw Material tab before final submit",
        "error",
      );
      return false;
    }
    handleSubmit();
    return true;
  }

  function hasContent() {
    return Object.values(form).some((v) =>
      typeof v === "string" ? v.trim() !== "" : !!v,
    );
  }

  function getFullItems() {
    const current = materials || [];
    if (!hasContent()) return current;
    const e = validate();
    if (Object.keys(e).length) return current;
    if (editIdx !== null) return current;
    return [...current, form];
  }

  useImperativeHandle(ref, () => ({ commitPending, hasContent, getFullItems }));

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  function validate() {
    const e = {};
    if (!form.materialCode.trim()) e.materialCode = "Code is required";
    if (!form.materialName.trim()) e.materialName = "Name is required";
    if (!form.category) e.category = "Category is required";
    if (!form.supplier.trim()) e.supplier = "Supplier is required";
    if (!form.storageCondition)
      e.storageCondition = "Storage condition is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      showToast("Please fill required fields", "error");
      return;
    }
    if (editIdx !== null) {
      setMaterials((l) => l.map((x, i) => (i === editIdx ? form : x)));
      showToast("Material updated!", "success");
      setEditIdx(null);
    } else {
      setMaterials((l) => [...l, form]);
      showToast("Material added!", "success");
    }
    setForm(makeBlank());
    setErrors({});
  }

  const filtered = materials.filter(
    (m) =>
      m.materialName.toLowerCase().includes(search.toLowerCase()) ||
      m.materialCode.toLowerCase().includes(search.toLowerCase()),
  );

  const storageTag = {
    "Room Temperature": { bg: "#f0fdf4", color: "#15803d" },
    Refrigerated: { bg: "#e0f2fe", color: "#0369a1" },
    Frozen: { bg: "#eff6ff", color: C.primary },
    "Dark & Dry": { bg: "#fef9c3", color: "#92400e" },
  };

  return (
    <div>
      <Divider
        label={editIdx !== null ? "Edit Material" : "Add Raw Material"}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "0 16px",
        }}
      >
        <FInput
          label="Material Code *"
          value={form.materialCode}
          error={errors.materialCode}
          onChange={(e) => set("materialCode", e.target.value)}
          placeholder="e.g. MAT-001"
        />
        <FInput
          label="Material Name *"
          value={form.materialName}
          error={errors.materialName}
          onChange={(e) => set("materialName", e.target.value)}
          placeholder="e.g. Sodium Chloride"
        />
        <FSelect
          label="Category *"
          value={form.category}
          error={errors.category}
          onChange={(e) => set("category", e.target.value)}
        >
          <option value="">— Select Category —</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </FSelect>
        <FInput
          label="Supplier *"
          value={form.supplier}
          error={errors.supplier}
          onChange={(e) => set("supplier", e.target.value)}
          placeholder="e.g. Merck India"
        />
        <FSelect
          label="Storage Condition *"
          value={form.storageCondition}
          error={errors.storageCondition}
          onChange={(e) => set("storageCondition", e.target.value)}
        >
          <option value="">— Select Storage —</option>
          {STORAGE.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </FSelect>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="primary" onClick={handleSubmit}>
          {editIdx !== null ? "✔ Update Material" : "+ Add Material"}
        </Btn>
        {editIdx !== null && (
          <Btn
            variant="ghost"
            onClick={() => {
              setForm(makeBlank());
              setEditIdx(null);
              setErrors({});
            }}
          >
            Cancel
          </Btn>
        )}
      </div>
      <Divider label={`Materials List (${materials.length})`} />
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name or code..."
      />
      {filtered.length === 0 ? (
        <EmptyState msg="No materials added yet" />
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: 10,
            border: `1px solid ${C.border}`,
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                <Th>Code</Th>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Supplier</Th>
                <Th>Storage</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const idx = materials.indexOf(m);
                const sc = storageTag[m.storageCondition] || {
                  bg: C.bg,
                  color: C.muted,
                };
                return (
                  <tr
                    key={i}
                    style={{ background: i % 2 === 0 ? C.white : C.bg }}
                  >
                    <Td>
                      <code
                        style={{
                          fontSize: 11,
                          color: C.primary,
                          background: C.primaryLight,
                          padding: "2px 7px",
                          borderRadius: 5,
                        }}
                      >
                        {m.materialCode}
                      </code>
                    </Td>
                    <Td>
                      <strong>{m.materialName}</strong>
                    </Td>
                    <Td>{m.category}</Td>
                    <Td>{m.supplier}</Td>
                    <Td>
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.color,
                          padding: "2px 10px",
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {m.storageCondition}
                      </span>
                    </Td>
                    <Td>
                      <ActionBtns
                        onEdit={() => {
                          setForm(m);
                          setEditIdx(idx);
                        }}
                        onDelete={() => {
                          setMaterials((l) => l.filter((_, j) => j !== idx));
                          showToast("Material removed", "error");
                        }}
                      />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

// ─── Instrument Sub-Tab ───────────────────────────────────────────────────────
const InstrumentSubTab = forwardRef(function InstrumentSubTab(
  { instruments, setInstruments, showToast, initialForm },
  ref,
) {
  const makeBlank = () => ({
    instrumentId: "",
    instrumentName: "",
    model: "",
    calibrationDate: "",
    nextCalibrationDate: "",
  });
  const [form, setForm] = useState(makeBlank());
  const [errors, setErrors] = useState({});
  const [editIdx, setEditIdx] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
      const idx = instruments.indexOf(initialForm);
      if (idx !== -1) setEditIdx(idx);
    }
  }, [initialForm, instruments]);

  function commitPending() {
    const nonEmpty = Object.values(form).some((v) =>
      typeof v === "string" ? v.trim() !== "" : !!v,
    );
    if (!nonEmpty) return true;
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      showToast(
        "Please fill required fields in Instrument tab before final submit",
        "error",
      );
      return false;
    }
    handleSubmit();
    return true;
  }

  function hasContent() {
    return Object.values(form).some((v) =>
      typeof v === "string" ? v.trim() !== "" : !!v,
    );
  }

  function getFullItems() {
    const current = instruments || [];
    if (!hasContent()) return current;
    const e = validate();
    if (Object.keys(e).length) return current;
    if (editIdx !== null) return current;
    return [...current, form];
  }

  useImperativeHandle(ref, () => ({ commitPending, hasContent, getFullItems }));

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  function validate() {
    const e = {};
    if (!form.instrumentId.trim()) e.instrumentId = "ID is required";
    if (!form.instrumentName.trim()) e.instrumentName = "Name is required";
    if (!form.model.trim()) e.model = "Model is required";
    if (!form.calibrationDate) e.calibrationDate = "Date required";
    if (!form.nextCalibrationDate) e.nextCalibrationDate = "Date required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      showToast("Please fill required fields", "error");
      return;
    }
    if (editIdx !== null) {
      setInstruments((l) => l.map((x, i) => (i === editIdx ? form : x)));
      showToast("Instrument updated!", "success");
      setEditIdx(null);
    } else {
      setInstruments((l) => [...l, form]);
      showToast("Instrument added!", "success");
    }
    setForm(makeBlank());
    setErrors({});
  }

  const previewStatus = getCalibStatus(form.nextCalibrationDate);
  const filtered = instruments.filter(
    (ins) =>
      ins.instrumentName.toLowerCase().includes(search.toLowerCase()) ||
      ins.instrumentId.toLowerCase().includes(search.toLowerCase()),
  );

  function rowBg(st, i) {
    if (st === "Expired") return "#fff1f2";
    if (st === "Due Soon") return "#fffbeb";
    return i % 2 === 0 ? C.white : C.bg;
  }

  return (
    <div>
      <Divider
        label={editIdx !== null ? "Edit Instrument" : "Add Instrument"}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "0 16px",
        }}
      >
        <FInput
          label="Instrument ID *"
          value={form.instrumentId}
          error={errors.instrumentId}
          onChange={(e) => set("instrumentId", e.target.value)}
          placeholder="e.g. INS-001"
        />
        <FInput
          label="Instrument Name *"
          value={form.instrumentName}
          error={errors.instrumentName}
          onChange={(e) => set("instrumentName", e.target.value)}
          placeholder="e.g. HPLC Analyzer"
        />
        <FInput
          label="Model *"
          value={form.model}
          error={errors.model}
          onChange={(e) => set("model", e.target.value)}
          placeholder="e.g. Agilent 1260"
        />
        <FInput
          label="Calibration Date *"
          type="date"
          value={form.calibrationDate}
          error={errors.calibrationDate}
          onChange={(e) => set("calibrationDate", e.target.value)}
        />
        <div>
          <FInput
            label="Next Calibration Date *"
            type="date"
            value={form.nextCalibrationDate}
            error={errors.nextCalibrationDate}
            onChange={(e) => set("nextCalibrationDate", e.target.value)}
          />
          {previewStatus && (
            <div
              style={{
                marginTop: -10,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>
                Auto status:
              </span>
              <Badge status={previewStatus} />
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn variant="primary" onClick={handleSubmit}>
          {editIdx !== null ? "✔ Update Instrument" : "+ Add Instrument"}
        </Btn>
        {editIdx !== null && (
          <Btn
            variant="ghost"
            onClick={() => {
              setForm(makeBlank());
              setEditIdx(null);
              setErrors({});
            }}
          >
            Cancel
          </Btn>
        )}
      </div>
      <Divider label={`Instruments List (${instruments.length})`} />
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 10,
          fontSize: 11,
          color: C.muted,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            background: "#fffbeb",
            padding: "2px 10px",
            borderRadius: 6,
            fontWeight: 600,
            color: "#92400e",
          }}
        >
          🟡 Due Soon — within 30 days
        </span>
        <span
          style={{
            background: "#fff1f2",
            padding: "2px 10px",
            borderRadius: 6,
            fontWeight: 600,
            color: C.danger,
          }}
        >
          🔴 Expired
        </span>
      </div>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name or ID..."
      />
      {filtered.length === 0 ? (
        <EmptyState msg="No instruments added yet" />
      ) : (
        <div
          style={{
            overflowX: "auto",
            borderRadius: 10,
            border: `1px solid ${C.border}`,
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Model</Th>
                <Th>Calibrated</Th>
                <Th>Next Calib.</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ins, i) => {
                const st = getCalibStatus(ins.nextCalibrationDate);
                const idx = instruments.indexOf(ins);
                return (
                  <tr key={i} style={{ background: rowBg(st, i) }}>
                    <Td>
                      <code
                        style={{
                          fontSize: 11,
                          color: C.primary,
                          background: C.primaryLight,
                          padding: "2px 7px",
                          borderRadius: 5,
                        }}
                      >
                        {ins.instrumentId}
                      </code>
                    </Td>
                    <Td>
                      <strong>{ins.instrumentName}</strong>
                    </Td>
                    <Td>{ins.model}</Td>
                    <Td>{ins.calibrationDate}</Td>
                    <Td>{ins.nextCalibrationDate}</Td>
                    <Td>
                      <Badge status={st || "—"} />
                    </Td>
                    <Td>
                      <ActionBtns
                        onEdit={() => {
                          setForm(ins);
                          setEditIdx(idx);
                        }}
                        onDelete={() => {
                          setInstruments((l) => l.filter((_, j) => j !== idx));
                          showToast("Instrument removed", "error");
                        }}
                      />
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

// ─── Lab Test Sub-Tab ─────────────────────────────────────────────────────────
const LabTestSubTab = forwardRef(function LabTestSubTab(
  { tests, setTests, showToast, initialForm },
  ref,
) {
  const makeBlank = () => ({
    labCode: "",
    companyCode: "",
    companyName: "",
    labTestCode: "",
    testLocation: "",
    testingCompanyName: "",
    testingType: "",
  });
  const [form, setForm] = useState(makeBlank());
  const [errors, setErrors] = useState({});
  const [editIdx, setEditIdx] = useState(null);

  useEffect(() => {
    if (initialForm) {
      setForm(initialForm);
    }
  }, [initialForm]);

  function commitPending() {
    const nonEmpty = Object.values(form).some((v) =>
      typeof v === "string" ? v.trim() !== "" : !!v,
    );
    if (!nonEmpty) return true;
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      showToast(
        "Please fill required fields in Lab Test tab before final submit",
        "error",
      );
      return false;
    }
    handleAddTest();
    return true;
  }

  function hasContent() {
    return Object.values(form).some((v) =>
      typeof v === "string" ? v.trim() !== "" : !!v,
    );
  }

  function getFullItems() {
    const current = tests || [];
    if (!hasContent()) return current;
    const e = validate();
    if (Object.keys(e).length) return current;
    if (editIdx !== null) return current;
    return [...current, form];
  }

  useImperativeHandle(ref, () => ({ commitPending, hasContent, getFullItems }));

  function resetDynamic(base) {
    const r = {};
    Object.values(TESTING_FIELDS).forEach((flds) =>
      flds.forEach((f) => {
        r[f.name] = "";
      }),
    );
    return { ...base, ...r };
  }

  function setField(key, val) {
    if (key === "testingType") {
      setForm((f) => resetDynamic({ ...f, testingType: val }));
    } else {
      setForm((f) => ({ ...f, [key]: val }));
    }
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.labCode.trim()) e.labCode = "Lab Code is required";
    if (!form.companyCode.trim()) e.companyCode = "Company Code is required";
    if (!form.companyName.trim()) e.companyName = "Company Name is required";
    if (!form.labTestCode.trim()) e.labTestCode = "Lab Test Code is required";
    if (!form.testingType) e.testingType = "Testing Type is required";
    return e;
  }

  function handleAddTest() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      showToast("Please fill required fields", "error");
      return;
    }
    if (editIdx !== null) {
      setTests((l) => l.map((x, i) => (i === editIdx ? form : x)));
      showToast("Test updated!", "success");
      setEditIdx(null);
    } else {
      setTests((l) => [...l, { ...form }]);
      showToast("Test added!", "success");
    }
    setForm(makeBlank());
    setErrors({});
  }

  const dynFields = TESTING_FIELDS[form.testingType] || [];

  return (
    <div>
      <Divider label={editIdx !== null ? "Edit Lab Test" : "Add Lab Test"} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "0 16px",
        }}
      >
        {[
          { k: "labCode", l: "Lab Code *", p: "e.g. LAB-001" },
          { k: "companyCode", l: "Company Code *", p: "e.g. COMP-042" },
          { k: "companyName", l: "Company Name *", p: "e.g. PharmaCorp" },
          { k: "labTestCode", l: "Lab Test Code *", p: "e.g. LT-2024-009" },
          { k: "testLocation", l: "Location", p: "e.g. Mumbai" },
          {
            k: "testingCompanyName",
            l: "Testing Company",
            p: "e.g. SGS India",
          },
        ].map((f) => (
          <FInput
            key={f.k}
            label={f.l}
            value={form[f.k]}
            error={errors[f.k]}
            onChange={(e) => setField(f.k, e.target.value)}
            placeholder={f.p}
          />
        ))}
      </div>
      <div style={{ maxWidth: 280 }}>
        <FSelect
          label="Testing Type *"
          value={form.testingType}
          error={errors.testingType}
          onChange={(e) => setField("testingType", e.target.value)}
        >
          <option value="">— Select Testing Type —</option>
          {Object.keys(TESTING_FIELDS).map((t) => (
            <option key={t}>{t}</option>
          ))}
        </FSelect>
      </div>
      {form.testingType && (
        <div
          style={{
            background: `${C.primary}07`,
            border: `1.5px solid ${C.primary}25`,
            borderRadius: 12,
            padding: "18px 20px",
            marginTop: 4,
            marginBottom: 8,
          }}
        >
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 11,
              fontWeight: 700,
              color: C.primary,
              textTransform: "uppercase",
              letterSpacing: "1.2px",
            }}
          >
            {form.testingType} Parameters
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "0 16px",
            }}
          >
            {dynFields.map((f) => (
              <FInput
                key={f.name}
                label={f.label}
                value={form[f.name] || ""}
                onChange={(e) => setField(f.name, e.target.value)}
                placeholder={f.placeholder}
              />
            ))}
          </div>
        </div>
      )}
      <Btn variant="success" onClick={handleAddTest}>
        {editIdx !== null ? "✔ Update Test Entry" : "+ Add Test Entry"}
      </Btn>
      {editIdx !== null && (
        <Btn
          variant="ghost"
          onClick={() => {
            setForm(makeBlank());
            setEditIdx(null);
            setErrors({});
          }}
        >
          Cancel
        </Btn>
      )}

      {false && tests.length > 0 && (
        <>
          <Divider label={`Added Tests (${tests.length})`} />
          <div
            style={{
              overflowX: "auto",
              borderRadius: 10,
              border: `1px solid ${C.border}`,
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
                <tr>
                  <Th>#</Th>
                  <Th>Lab Code</Th>
                  <Th>Company</Th>
                  <Th>Test Code</Th>
                  <Th>Type</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t, i) => (
                  <tr
                    key={i}
                    style={{ background: i % 2 === 0 ? C.white : C.bg }}
                  >
                    <Td>{i + 1}</Td>
                    <Td>{t.labCode}</Td>
                    <Td>{t.companyName}</Td>
                    <Td>{t.labTestCode}</Td>
                    <Td>
                      <Badge status={t.testingType} />
                    </Td>
                    <Td>
                      <ActionBtns
                        onEdit={() => {
                          setForm(t);
                          setEditIdx(i);
                        }}
                        onDelete={() =>
                          setTests((l) => l.filter((_, j) => j !== i))
                        }
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
});

// ─── Main CentralLabForm ──────────────────────────────────────────────────────
export default function CentralLabForm({ onSaved }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("lab-info");
  const [toasts, setToasts] = useState([]);

  const labTestRef = useRef(null);
  const scientistRef = useRef(null);
  const materialsRef = useRef(null);
  const instrumentsRef = useRef(null);

  // Lab Info state
  const [data, setData] = useState({
    code: "",
    labname: "",
    location: "",
    labtype: "",
  });
  const [errors, setErrors] = useState({});

  // Sub-records state
  const [tests, setTests] = useState([]);
  const [scientists, setScientists] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [instruments, setInstruments] = useState([]);

  // Initial form data for edit mode
  const [initialTestForm, setInitialTestForm] = useState(null);
  const [initialScientistForm, setInitialScientistForm] = useState(null);
  const [initialMaterialForm, setInitialMaterialForm] = useState(null);
  const [initialInstrumentForm, setInitialInstrumentForm] = useState(null);

  const [summaryRecord, setSummaryRecord] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("centrallab") || "[]");
    if (id != null) {
      const rec = stored[Number(id)];
      if (rec) {
        setData({
          code: rec.code || "",
          labname: rec.labname || "",
          location: rec.location || "",
          labtype: rec.labtype || "",
        });
        setTests(rec.tests || []);
        setScientists(rec.scientists || []);
        setMaterials(rec.materials || []);
        setInstruments(rec.instruments || []);

        // Set initial form data for edit mode
        if (rec.tests && rec.tests.length > 0) setInitialTestForm(rec.tests[0]);
        if (rec.scientists && rec.scientists.length > 0)
          setInitialScientistForm(rec.scientists[0]);
        if (rec.materials && rec.materials.length > 0)
          setInitialMaterialForm(rec.materials[0]);
        if (rec.instruments && rec.instruments.length > 0)
          setInitialInstrumentForm(rec.instruments[0]);
      }
    }
  }, [id]);

  const showToast = useCallback((message, type = "success") => {
    const tid = Date.now() + Math.random();
    setToasts((t) => [...t, { id: tid, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== tid)), 3500);
  }, []);

  function handleChange(e) {
    setData((d) => ({ ...d, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: "" }));
  }

  // ─── Common Submit — saves Lab Info + all sub-records together ────────────
  function handleFinalSubmit() {
    const er = {};
    if (!data.code.trim()) er.code = "Code is required";
    if (!data.labname.trim()) er.labname = "Lab Name is required";
    if (!data.location.trim()) er.location = "Location is required";
    if (!data.labtype.trim()) er.labtype = "Lab Type is required";

    if (Object.keys(er).length) {
      setErrors(er);
      setActiveTab("lab-info");
      showToast("Please fill required Lab Info fields", "error");
      return;
    }

    const subTabs = [
      { ref: labTestRef, key: "lab-test" },
      { ref: scientistRef, key: "scientist" },
      { ref: materialsRef, key: "raw-material" },
      { ref: instrumentsRef, key: "instrument" },
    ];

    for (const tab of subTabs) {
      const commitFn = tab.ref.current?.commitPending;
      if (typeof commitFn === "function") {
        const ok = commitFn();
        if (!ok) {
          setActiveTab(tab.key);
          return;
        }
      }
    }

    const testsFinal = labTestRef.current?.getFullItems?.() ?? tests;
    const scientistsFinal =
      scientistRef.current?.getFullItems?.() ?? scientists;
    const materialsFinal = materialsRef.current?.getFullItems?.() ?? materials;
    const instrumentsFinal =
      instrumentsRef.current?.getFullItems?.() ?? instruments;

    if (testsFinal.length === 0) {
      setActiveTab("lab-test");
      showToast("Please add at least one lab test before submit", "error");
      return;
    }
    if (scientistsFinal.length === 0) {
      setActiveTab("scientist");
      showToast("Please add at least one scientist before submit", "error");
      return;
    }
    if (materialsFinal.length === 0) {
      setActiveTab("raw-material");
      showToast("Please add at least one raw material before submit", "error");
      return;
    }
    if (instrumentsFinal.length === 0) {
      setActiveTab("instrument");
      showToast("Please add at least one instrument before submit", "error");
      return;
    }

    const record = {
      ...data,
      tests: testsFinal,
      scientists: scientistsFinal,
      materials: materialsFinal,
      instruments: instrumentsFinal,
    };
    console.log("record", record);

    setTests(testsFinal);
    setScientists(scientistsFinal);
    setMaterials(materialsFinal);
    setInstruments(instrumentsFinal);

    let old = JSON.parse(localStorage.getItem("centrallab") || "[]");

    if (id != null) {
      old[Number(id)] = record;
      showToast("Record updated successfully!", "success");
    } else {
      old.push(record);
      showToast("Record saved successfully!", "success");
    }

    localStorage.setItem("centrallab", JSON.stringify(old));

    setSummaryRecord(record);
    setShowSummaryModal(true);

    // Auto-navigate to centrallab after 3 seconds
    setTimeout(() => {
      navigate("/centrallab");
    }, 3000);

    if (onSaved) {
      setTimeout(() => onSaved(), 1500);
    }
  }

  const isEdit = id != null;

  const hasPendingTest = labTestRef.current?.hasContent?.() ?? false;
  const hasPendingScientist = scientistRef.current?.hasContent?.() ?? false;
  const hasPendingMaterials = materialsRef.current?.hasContent?.() ?? false;
  const hasPendingInstruments = instrumentsRef.current?.hasContent?.() ?? false;

  const canSubmit =
    data.code.trim() &&
    data.labname.trim() &&
    data.location.trim() &&
    data.labtype.trim() &&
    (tests.length > 0 || hasPendingTest) &&
    (scientists.length > 0 || hasPendingScientist) &&
    (materials.length > 0 || hasPendingMaterials) &&
    (instruments.length > 0 || hasPendingInstruments);

  const TABS = [
    { key: "lab-info", label: "Lab Info", icon: "🏢" },
    { key: "lab-test", label: "Lab Test", icon: "🧪" },
    { key: "scientist", label: "Scientist", icon: "🔬" },
    { key: "raw-material", label: "Raw Material", icon: "📦" },
    { key: "instrument", label: "Instrument", icon: "⚙️" },
  ];

  return (
    <>
      <style>{`
        @keyframes clToastIn { from { opacity:0; transform:translateX(60px); } to { opacity:1; transform:translateX(0); } }
        @keyframes clFadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        .cl-content { animation: clFadeIn 0.2s ease; }
        @media (max-width:640px) {
          .cl-main-card { padding: 18px 12px !important; }
          .cl-tab-scroll { overflow-x: auto; }
          .cl-tab-btn { padding: 8px 10px !important; font-size: 12px !important; }
        }
        @media print { body > *:not(.cl-print-area) { display: none; } }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          padding: "24px 14px",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
          <div
            className="cl-main-card"
            style={{
              background: C.white,
              borderRadius: 16,
              boxShadow: "0 2px 20px rgba(37,99,235,0.09)",
              border: `1px solid ${C.border}`,
              padding: "28px 26px",
              // marginTop:"118px"
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                🏥
              </div>
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 800,
                    color: C.text,
                    lineHeight: 1.2,
                  }}
                >
                  Central Lab Master
                </h2>
                <p style={{ margin: 0, fontSize: 12, color: C.muted }}>
                  Manage lab records, tests, scientists & instruments
                </p>
              </div>
              {isEdit && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.primary,
                    background: C.primaryLight,
                    padding: "4px 12px",
                    borderRadius: 20,
                    border: `1px solid ${C.primary}33`,
                  }}
                >
                  ✏ Editing
                </span>
              )}
            </div>

            {/* Tabs */}
            <div
              className="cl-tab-scroll"
              style={{
                borderBottom: `2px solid ${C.border}`,
                marginBottom: 22,
              }}
            >
              <div style={{ display: "flex", gap: 0, minWidth: "max-content" }}>
                {TABS.map((t) => {
                  const active = activeTab === t.key;
                  return (
                    <button
                      key={t.key}
                      className="cl-tab-btn"
                      onClick={() => setActiveTab(t.key)}
                      style={{
                        padding: "12px 24px",
                        border: "none",
                        borderBottom: active
                          ? `2px solid ${C.primary}`
                          : "2px solid transparent",
                        background: active ? C.primaryLight : "transparent",
                        color: active ? C.primary : C.muted,
                        fontWeight: active ? 800 : 600,
                        fontSize: 16,
                        cursor: "pointer",
                        borderRadius: "8px 8px 0 0",
                        transition: "all 0.15s",
                        whiteSpace: "nowrap",
                        marginBottom: -2,
                      }}
                    >
                      {t.icon} {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="cl-content">
              <div
                style={{ display: activeTab === "lab-info" ? "block" : "none" }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "0 20px",
                  }}
                >
                  <FInput
                    label="Code *"
                    name="code"
                    value={data.code}
                    error={errors.code}
                    onChange={handleChange}
                    placeholder="e.g. CL-001"
                  />
                  <FInput
                    label="Lab Name *"
                    name="labname"
                    value={data.labname}
                    error={errors.labname}
                    onChange={handleChange}
                    placeholder="Lab Name"
                  />
                  <FInput
                    label="Location *"
                    name="location"
                    value={data.location}
                    error={errors.location}
                    onChange={handleChange}
                    placeholder="City / Region"
                  />
                  <FInput
                    label="Lab Type *"
                    name="labtype"
                    value={data.labtype}
                    error={errors.labtype}
                    onChange={handleChange}
                    placeholder="e.g. Microbiology"
                  />
                </div>
              </div>

              <div
                style={{ display: activeTab === "lab-test" ? "block" : "none" }}
              >
                <LabTestSubTab
                  ref={labTestRef}
                  tests={tests}
                  setTests={setTests}
                  showToast={showToast}
                  initialForm={initialTestForm}
                />
              </div>

              <div
                style={{
                  display: activeTab === "scientist" ? "block" : "none",
                }}
              >
                <ScientistSubTab
                  ref={scientistRef}
                  scientists={scientists}
                  setScientists={setScientists}
                  showToast={showToast}
                  initialForm={initialScientistForm}
                />
              </div>

              <div
                style={{
                  display: activeTab === "raw-material" ? "block" : "none",
                }}
              >
                <RawMaterialSubTab
                  ref={materialsRef}
                  materials={materials}
                  setMaterials={setMaterials}
                  showToast={showToast}
                  initialForm={initialMaterialForm}
                />
              </div>

              <div
                style={{
                  display: activeTab === "instrument" ? "block" : "none",
                }}
              >
                <InstrumentSubTab
                  ref={instrumentsRef}
                  instruments={instruments}
                  setInstruments={setInstruments}
                  showToast={showToast}
                  initialForm={initialInstrumentForm}
                />
              </div>
            </div>

            {/* ─── Common Submit Button ─── */}
            <div
              style={{
                marginTop: 28,
                paddingTop: 18,
                borderTop: `2px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 12, color: C.muted }}>
                {tests.length > 0 && `${tests.length} test(s)  `}
                {scientists.length > 0 && `${scientists.length} scientist(s)  `}
                {materials.length > 0 && `${materials.length} material(s)  `}
                {instruments.length > 0 &&
                  `${instruments.length} instrument(s)`}
              </div>
              <Btn
                variant="primary"
                size="lg"
                onClick={handleFinalSubmit}
                disabled={!canSubmit}
                style={{
                  opacity: canSubmit ? 1 : 0.55,
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}
              >
                {isEdit ? "✔ Update All & Save" : "✔ Submit All & Save"}
              </Btn>
            </div>
          </div>
        </div>
      </div>

      {false && showSummaryModal && summaryRecord && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: 20,
            overflow: "auto",
          }}
        >
          <div
            style={{
              background: C.white,
              borderRadius: 16,
              width: "95%",
              maxWidth: 1200,
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
              zIndex: 100000,
              position: "relative",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${C.primary} 0%, #1d4ed8 100%)`,
                padding: "24px 28px",
                borderRadius: "16px 16px 0 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2 style={{ margin: "0 0 4px", color: C.white, fontSize: 26 }}>
                  Submission Summary
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 13,
                  }}
                >
                  Lab: <strong>{summaryRecord.labname}</strong> • Location:{" "}
                  <strong>{summaryRecord.location}</strong>
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={() => setShowPrintModal(true)}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: C.white,
                    borderColor: C.white,
                    fontWeight: 600,
                  }}
                >
                  Print Preview
                </Btn>
                <Btn
                  variant="primary"
                  size="sm"
                  onClick={() => generateLabPDF(summaryRecord)}
                  style={{ background: C.success, fontWeight: 600 }}
                >
                  Download PDF
                </Btn>
                <Btn
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowSummaryModal(false);
                    setSummaryRecord(null);
                    navigate("/centrallab");
                    window.location.reload();
                  }}
                  style={{ color: C.white, fontWeight: 600 }}
                >
                  Close
                </Btn>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: "28px" }}>
              {/* Lab Info Card */}
              <div
                style={{
                  background: "#f0f4ff",
                  borderLeft: "4px solid " + C.primary,
                  borderRadius: 8,
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px",
                    color: C.primary,
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Lab Information
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 12,
                  }}
                >
                  {[
                    ["Code", summaryRecord.code],
                    ["Lab Name", summaryRecord.labname],
                    ["Location", summaryRecord.location],
                    ["Lab Type", summaryRecord.labtype],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div
                        style={{
                          fontSize: 11,
                          color: C.muted,
                          fontWeight: 600,
                          marginBottom: 4,
                          textTransform: "uppercase",
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{ fontSize: 14, color: C.text, fontWeight: 600 }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Test Entries Card */}
              <div
                style={{
                  background: "#f9fafb",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px",
                    color: "#ea580c",
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Lab Entries{" "}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      background: "#fed7aa",
                      color: "#92400e",
                      padding: "2px 8px",
                      borderRadius: 4,
                      marginLeft: 8,
                    }}
                  >
                    {summaryRecord.tests?.length || 0}
                  </span>
                </h4>
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 13,
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "#fef9e7",
                          borderBottom: "2px solid #fcd34d",
                        }}
                      >
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#92400e",
                          }}
                        >
                          Lab Code
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#92400e",
                          }}
                        >
                          Company
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#92400e",
                          }}
                        >
                          Test Code
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#92400e",
                          }}
                        >
                          Type
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryRecord.tests?.map((t, i) => (
                        <tr
                          key={i}
                          style={{
                            borderBottom: `1px solid ${C.border}`,
                            background: i % 2 === 0 ? "#fff" : "#fafaf9",
                          }}
                        >
                          <td style={{ padding: "10px", color: C.text }}>
                            {t.labCode}
                          </td>
                          <td style={{ padding: "10px", color: C.text }}>
                            {t.companyName}
                          </td>
                          <td style={{ padding: "10px", color: C.text }}>
                            {t.labTestCode}
                          </td>
                          <td style={{ padding: "10px", color: C.text }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "3px 10px",
                                background: "#dbeafe",
                                color: C.primary,
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              {t.testingType}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Scientists Card */}
              <div
                style={{
                  background: "#f9fafb",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px",
                    color: "#7c3aed",
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Scientists{" "}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      background: "#ede9fe",
                      color: "#7c3aed",
                      padding: "2px 8px",
                      borderRadius: 4,
                      marginLeft: 8,
                    }}
                  >
                    {summaryRecord.scientists?.length || 0}
                  </span>
                </h4>
                <div style={{ maxHeight: 180, overflowY: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 13,
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "#f3e8ff",
                          borderBottom: "2px solid #ddd6fe",
                        }}
                      >
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#7c3aed",
                          }}
                        >
                          ID
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#7c3aed",
                          }}
                        >
                          Name
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#7c3aed",
                          }}
                        >
                          Role
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#7c3aed",
                          }}
                        >
                          Lab Code
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryRecord.scientists?.map((s, i) => (
                        <tr
                          key={i}
                          style={{
                            borderBottom: `1px solid ${C.border}`,
                            background: i % 2 === 0 ? "#fff" : "#fafaf9",
                          }}
                        >
                          <td
                            style={{
                              padding: "10px",
                              color: C.text,
                              fontSize: 12,
                            }}
                          >
                            {s.userId}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              color: C.text,
                              fontWeight: 600,
                            }}
                          >
                            {s.name}
                          </td>
                          <td style={{ padding: "10px", color: C.text }}>
                            {s.role}
                          </td>
                          <td style={{ padding: "10px", color: C.text }}>
                            {s.labCode}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Materials Card */}
              <div
                style={{
                  background: "#f9fafb",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "16px",
                  marginBottom: "20px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px",
                    color: "#15803d",
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Materials{" "}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      background: "#dcfce7",
                      color: "#15803d",
                      padding: "2px 8px",
                      borderRadius: 4,
                      marginLeft: 8,
                    }}
                  >
                    {summaryRecord.materials?.length || 0}
                  </span>
                </h4>
                <div style={{ maxHeight: 180, overflowY: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 13,
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "#f0fdf4",
                          borderBottom: "2px solid #bbf7d0",
                        }}
                      >
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#15803d",
                          }}
                        >
                          Code
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#15803d",
                          }}
                        >
                          Name
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#15803d",
                          }}
                        >
                          Category
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#15803d",
                          }}
                        >
                          Supplier
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryRecord.materials?.map((m, i) => (
                        <tr
                          key={i}
                          style={{
                            borderBottom: `1px solid ${C.border}`,
                            background: i % 2 === 0 ? "#fff" : "#fafaf9",
                          }}
                        >
                          <td
                            style={{
                              padding: "10px",
                              color: C.text,
                              fontSize: 12,
                            }}
                          >
                            {m.materialCode}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              color: C.text,
                              fontWeight: 600,
                            }}
                          >
                            {m.materialName}
                          </td>
                          <td style={{ padding: "10px", color: C.text }}>
                            {m.category}
                          </td>
                          <td style={{ padding: "10px", color: C.text }}>
                            {m.supplier}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Instruments Card */}
              <div
                style={{
                  background: "#f9fafb",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "16px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 12px",
                    color: "#dc2626",
                    fontSize: 14,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Instruments{" "}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      background: "#fee2e2",
                      color: "#dc2626",
                      padding: "2px 8px",
                      borderRadius: 4,
                      marginLeft: 8,
                    }}
                  >
                    {summaryRecord.instruments?.length || 0}
                  </span>
                </h4>
                <div style={{ maxHeight: 180, overflowY: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 13,
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "#fef2f2",
                          borderBottom: "2px solid #fecaca",
                        }}
                      >
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#dc2626",
                          }}
                        >
                          ID
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#dc2626",
                          }}
                        >
                          Name
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#dc2626",
                          }}
                        >
                          Model
                        </th>
                        <th
                          style={{
                            padding: "10px",
                            textAlign: "left",
                            fontWeight: 700,
                            color: "#dc2626",
                          }}
                        >
                          Next Calib.
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryRecord.instruments?.map((ins, i) => (
                        <tr
                          key={i}
                          style={{
                            borderBottom: `1px solid ${C.border}`,
                            background: i % 2 === 0 ? "#fff" : "#fafaf9",
                          }}
                        >
                          <td
                            style={{
                              padding: "10px",
                              color: C.text,
                              fontSize: 12,
                            }}
                          >
                            {ins.instrumentId}
                          </td>
                          <td
                            style={{
                              padding: "10px",
                              color: C.text,
                              fontWeight: 600,
                            }}
                          >
                            {ins.instrumentName}
                          </td>
                          <td style={{ padding: "10px", color: C.text }}>
                            {ins.model}
                          </td>
                          <td style={{ padding: "10px", color: C.text }}>
                            {ins.nextCalibrationDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPrintModal && summaryRecord && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            padding: 20,
            overflow: "auto",
          }}
        >
          <div
            style={{
              background: C.white,
              borderRadius: 12,
              width: "95%",
              maxWidth: "none",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
              zIndex: 100000,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 18px",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <h3 style={{ margin: 0 }}>Print Preview</h3>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="primary" onClick={() => window.print()}>
                  🖨 Print
                </Btn>
                <Btn variant="ghost" onClick={() => setShowPrintModal(false)}>
                  Close
                </Btn>
              </div>
            </div>
            <div style={{ padding: "14px 18px" }}>
              <h4>Lab Info</h4>
              <table style={{ width: "100%", marginBottom: 14 }}>
                <tbody>
                  {[
                    ["Code", summaryRecord.code],
                    ["Lab Name", summaryRecord.labname],
                    ["Location", summaryRecord.location],
                    ["Lab Type", summaryRecord.labtype],
                  ].map(([l, v]) => (
                    <tr key={l}>
                      <td style={{ fontWeight: 700, width: "20%" }}>{l}</td>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h4>Lab Test Entries ({summaryRecord.tests?.length || 0})</h4>
              <div
                style={{ maxHeight: 180, overflowY: "auto", marginBottom: 10 }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Lab Code
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Company
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Test Code
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryRecord.tests?.map((t, i) => (
                      <tr key={i}>
                        <td>{t.labCode}</td>
                        <td>{t.companyName}</td>
                        <td>{t.labTestCode}</td>
                        <td>{t.testingType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4>Scientists ({summaryRecord.scientists?.length || 0})</h4>
              <div
                style={{ maxHeight: 130, overflowY: "auto", marginBottom: 10 }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        ID
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Role
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Lab Code
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryRecord.scientists?.map((s, i) => (
                      <tr key={i}>
                        <td>{s.userId}</td>
                        <td>{s.name}</td>
                        <td>{s.role}</td>
                        <td>{s.labCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4>Materials ({summaryRecord.materials?.length || 0})</h4>
              <div
                style={{ maxHeight: 130, overflowY: "auto", marginBottom: 10 }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Code
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Category
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Supplier
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryRecord.materials?.map((m, i) => (
                      <tr key={i}>
                        <td>{m.materialCode}</td>
                        <td>{m.materialName}</td>
                        <td>{m.category}</td>
                        <td>{m.supplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4>Instruments ({summaryRecord.instruments?.length || 0})</h4>
              <div
                style={{ maxHeight: 130, overflowY: "auto", marginBottom: 10 }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        ID
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Model
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        Next Calib.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryRecord.instruments?.map((ins, i) => (
                      <tr key={i}>
                        <td>{ins.instrumentId}</td>
                        <td>{ins.instrumentName}</td>
                        <td>{ins.model}</td>
                        <td>{ins.nextCalibrationDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastStack toasts={toasts} />
    </>
  );
}
