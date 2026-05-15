import React, { useState, useEffect, useMemo, useRef } from "react";
import api from "../../api/axiosConfig";

const Spinner = ({ size = 20, color = "#000000" }) => (
  <div
    style={{
      display: "inline-block",
      width: size,
      height: size,
      border: `2px solid ${color}20`,
      borderTop: `2px solid ${color}`,
      borderRadius: "50%",
      animation: "spin 0.6s linear infinite",
    }}
  />
);

// Inject spinner styles
if (
  typeof document !== "undefined" &&
  !document.querySelector("#spinner-style")
) {
  const style = document.createElement("style");
  style.id = "spinner-style";
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .trf-sort-indicator {
      margin-left: 6px;
      font-size: 0.7rem;
      opacity: 0.6;
    }
    .trf-sortable-th {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s;
    }
    .trf-sortable-th:hover {
      background-color: #f1f5f9 !important;
    }
    .trf-pdf-avoid-break,
    .trf-pdf-table-row,
    .trf-pdf-table,
    .trf-pdf-section {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    .trf-pdf-page-break {
      page-break-after: always !important;
      break-after: page !important;
    }
  `;
  document.head.appendChild(style);
}

const formatDate = (isoString) => {
  if (!isoString) return "-";
  return new Date(isoString).toLocaleString();
};

const getPdfFullUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith("http")) return relativePath;
  const backendBase =
    api.defaults.baseURL?.replace(/\/api$/, "") || "http://localhost:5000";
  const cleanBase = backendBase.replace(/\/$/, "");
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${cleanBase}${path}`;
};

// ========== PDF Modal (for product PDF) ==========
const PdfModal = ({ pdfUrl, productName, onClose }) => {
  const iframeRef = React.useRef(null);
  const handlePrint = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow.print();
      } catch (e) {
        alert("Print not available. Please download the PDF first.");
      }
    }
  };
  if (!pdfUrl) return null;
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div
        style={{ ...styles.modalContent, maxWidth: "80vw", width: "75vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>{/* minimalist header */}</div>
        <div style={{ ...styles.modalBody, height: "70vh", padding: 0 }}>
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            title="Product PDF"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </div>
        <div style={styles.modalFooter}>
          <button onClick={onClose} style={styles.closeModalBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== IMPROVED ViewModal with professional report layout and PDF download ==========
const ViewModal = ({ trf, onClose, allProducts }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productRanges, setProductRanges] = useState(null);
  const [pdfLibraryLoaded, setPdfLibraryLoaded] = useState(false);
  const reportRef = useRef(null);

  // Dynamically load html2pdf if not present
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.html2pdf) {
      setPdfLibraryLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    script.onload = () => setPdfLibraryLoaded(true);
    script.onerror = () => {
      console.error("Failed to load html2pdf library.");
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/trf/user/${trf.id}`);
        setDetails(res.data);

        const product = allProducts.find(
          (p) => p.productName === trf.productName,
        );
        if (!product || !product.id) {
          console.warn("Product not found for ranges:", trf.productName);
          setProductRanges(null);
          return;
        }

        const productRes = await api.get(`/products/${product.id}/ranges`);
        const rangesMap = {};
        if (productRes.data && productRes.data.testRanges) {
          productRes.data.testRanges.forEach((tr) => {
            rangesMap[tr.testName] = {};
            tr.fields.forEach((f) => {
              rangesMap[tr.testName][f.label] = {
                min: f.minValue,
                max: f.maxValue,
                unit: f.unit,
              };
            });
          });
        }
        setProductRanges(rangesMap);
      } catch (err) {
        console.error(err);
        setProductRanges(null);
      } finally {
        setLoading(false);
      }
    };
    if (trf && allProducts.length > 0) {
      fetchData();
    }
  }, [trf, allProducts]);

  const isValueInRange = (testName, fieldLabel, value) => {
    if (!productRanges || !productRanges[testName]) return null;
    const range = productRanges[testName][fieldLabel];
    if (!range || (!range.min && !range.max)) return null;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;
    let valid = true;
    if (range.min && numValue < parseFloat(range.min)) valid = false;
    if (range.max && numValue > parseFloat(range.max)) valid = false;
    return { valid, min: range.min, max: range.max, unit: range.unit };
  };

  // PDF download using html2pdf
  const downloadPDF = async () => {
    if (typeof window === "undefined") return;
    if (!details || loading) {
      alert("Please wait until the report is fully loaded before downloading.");
      return;
    }
    if (!reportRef.current) {
      alert("Report is still rendering. Please wait a moment and try again.");
      return;
    }
    if (!pdfLibraryLoaded) {
      alert("PDF generator is still loading. Please wait a moment.");
      return;
    }

    const element = reportRef.current;
    const opt = {
      margin: [0.2, 0.2, 0.2, 0.2],
      filename: `Test_Report_${trf.trfCode}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, letterRendering: true, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: {
        mode: ["css", "legacy"],
        avoid: ["tr", "thead", ".trf-pdf-avoid-break", ".trf-pdf-table-row"],
      },
    };
    try {
      await window.html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div
        style={{ ...styles.modalContent, maxWidth: "1000px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>📋 Test Request Report</h2>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={downloadPDF}
              style={styles.downloadPdfBtn}
              disabled={loading || !details || !pdfLibraryLoaded}
            >
              {loading || !details || !pdfLibraryLoaded ? (
                <>
                  <Spinner size={16} color="#ffffff" /> Loading PDF...
                </>
              ) : (
                "📥 Download PDF"
              )}
            </button>
            <button style={styles.modalCloseBtn} onClick={onClose}>
              ×
            </button>
          </div>
        </div>
        <div style={styles.modalBody}>
          {loading ? (
            <div style={styles.modalLoaderContainer}>
              <Spinner size={40} />
              <p>Loading details...</p>
            </div>
          ) : (
            <div
              ref={reportRef}
              style={styles.reportContainer}
              className="trf-pdf-section"
            >
              {/* Header Section */}
              <div style={styles.reportHeader} className="trf-pdf-avoid-break">
                <div style={styles.reportTitleSection}>
                  <div style={{display:"flex",gap:"20px"}}>
                 <img
            src="assets/photos/aryan.jpeg"
            alt="logo"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "cover",
              
              border: "0.5px solid #c7c7c7",
            }}
          /> <h2 style={styles.reportTitle}>Aryan Food Ingredients Limited </h2></div>
                </div>
                {/* <div style={styles.reportLogo}>
                  <span style={styles.logoText}>🔬 MEDILAB</span>
                </div> */}
              </div>

              {/* Patient & Request Info */}
              <div style={styles.infoCards} className="trf-pdf-avoid-break">
                <div style={styles.infoCard} className="trf-pdf-avoid-break">
                  <h3 style={styles.infoCardTitle}>TRF Information</h3>
                  <div style={styles.infoRow}>
                    <strong>TRF Code:</strong> {details.trf.trfCode}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Company:</strong> {details.trf.companyName}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Company Code:</strong> {details.trf.companyCode}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Company:</strong> {details.trf.companyName}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Request Name:</strong> {details.trf.requestName}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Product:</strong> {details.trf.productName}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Product Code:</strong> {details.trf.sampleCode}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Lot No.:</strong> {details.trf.lotNo || "—"}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>created At:</strong>{" "}
                    {formatDate(details.trf.createdAt)}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <h3 style={styles.infoCardTitle}>
                    Lab Report Details
                  </h3>
                  <div style={styles.infoRow}>
                    <strong>Lab:</strong> {details.trf.labName}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Lab Code:</strong> {details.trf.labCode}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Lab Type:</strong> {details.trf.labType}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Submitted To:</strong>{" "}
                    {formatDate(details.trf.submittedAt)}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Updated At:</strong>{" "}
                    {formatDate(details.trf.updatedAt)}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Reported On:</strong> {formatDate(new Date())}
                  </div>
                </div>
              </div>

              {/* Test Results Tables */}
              {details.fieldsByTest &&
                Object.entries(details.fieldsByTest).map(
                  ([testName, fields]) => (
                    <div
                      key={testName}
                      style={styles.testTableWrapper}
                      className="trf-pdf-avoid-break"
                    >
                      <h3 style={styles.testTableTitle}>🔬 {testName}</h3>
                      <table style={styles.resultsTable}>
                        <thead>
                          <tr>
                            <th style={styles.tableHeader}>Investigation</th>
                            <th style={styles.tableHeader}>Result</th>
                            <th style={styles.tableHeader}>Reference Range</th>
                            <th style={styles.tableHeader}>Unit</th>
                            <th style={styles.tableHeader}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fields.map((field) => {
                            const inRange = isValueInRange(
                              testName,
                              field.label,
                              field.currentValue,
                            );
                            let refRangeText = "";
                            let unitText = "";
                            if (inRange) {
                              refRangeText = `${inRange.min} – ${inRange.max}`;
                              unitText = inRange.unit || "";
                            } else if (
                              productRanges &&
                              productRanges[testName] &&
                              productRanges[testName][field.label]
                            ) {
                              const r = productRanges[testName][field.label];
                              refRangeText =
                                r.min && r.max ? `${r.min} – ${r.max}` : "N/A";
                              unitText = r.unit || "";
                            } else {
                              refRangeText = "—";
                            }
                            const status = inRange
                              ? inRange.valid
                                ? "Normal"
                                : "Abnormal"
                              : "Not defined";
                            const statusStyle = inRange
                              ? inRange.valid
                                ? styles.statusNormal
                                : styles.statusAbnormal
                              : styles.statusUnknown;
                            return (
                              <tr
                                key={field.fieldRowId}
                                style={styles.tableRow}
                                className="trf-pdf-table-row"
                              >
                                <td style={styles.tableCell}>
                                  <strong>{field.label}</strong>
                                </td>
                                <td style={styles.tableCell}>
                                  {field.currentValue || "—"}
                                </td>
                                <td style={styles.tableCell}>{refRangeText}</td>
                                <td style={styles.tableCell}>{unitText}</td>
                                <td style={styles.tableCell}>
                                  <span style={statusStyle}>{status}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ),
                )}

              {/* Interpretation / Remark Section */}
              {details.trf.remark && (
                <div
                  style={styles.interpretationBox}
                  className="trf-pdf-avoid-break"
                >
                  <h4 style={styles.interpretationTitle}>
                    📝 Interpretation & Remarks
                  </h4>
                  <p style={styles.interpretationText}>{details.trf.remark}</p>
                </div>
              )}

              {/* Footer / Signatures */}
              <div style={styles.reportFooter} className="trf-pdf-avoid-break">
                {/* <div style={styles.signatureLine}>
                  <div>_________________________</div>
                  <div>Lab Technician</div>
                </div>
                <div style={styles.signatureLine}>
                  <div>_________________________</div>
                  <div>Pathologist</div>
                </div> */}
                <div style={styles.reportFooterText}>
                Aryan Food Ingredients Limited “Go Organic with Aryan”
India 
{" "}
  <a
    href="https://www.aryanint.com"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      textDecoration: "none",
     
    }}
  >
    www.aryanint.com
  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={styles.modalFooter}>
          <button onClick={onClose} style={styles.closeModalBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== Edit Modal (unchanged) ==========
const EditModal = ({
  trf,
  testData,
  onUpdateField,
  onAddCustomField,
  onSave,
  onCancel,
  saving,
  loading,
}) => {
  const [newFieldName, setNewFieldName] = useState({});
  const [newFieldValue, setNewFieldValue] = useState({});

  const handleAddClick = (testName) => {
    const name = newFieldName[testName]?.trim();
    if (!name) {
      alert("Please enter a field name");
      return;
    }
    const value = newFieldValue[testName] || "";
    onAddCustomField(testName, name, value);
    setNewFieldName((prev) => ({ ...prev, [testName]: "" }));
    setNewFieldValue((prev) => ({ ...prev, [testName]: "" }));
  };

  return (
    <div style={styles.modalOverlay} onClick={onCancel}>
      <div
        style={{ ...styles.modalContent, maxWidth: "1000px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>✏️ Edit Results & Add Fields</h2>
          <button style={styles.modalCloseBtn} onClick={onCancel}>
            ×
          </button>
        </div>
        <div style={styles.modalBody}>
          {loading ? (
            <div style={styles.modalLoaderContainer}>
              <Spinner size={40} />
              <p>Loading test data...</p>
            </div>
          ) : saving ? (
            <div style={styles.modalLoaderContainer}>
              <Spinner size={40} />
              <p>Saving changes...</p>
            </div>
          ) : (
            <>
              {Object.entries(testData).map(
                ([testName, { fields, testId }]) => (
                  <div key={testName} style={styles.editTestSection}>
                    <h3 style={styles.editTestTitle}>🔬 {testName} Analysis</h3>
                    <div style={styles.grid2Col}>
                      {fields.map((field) => (
                        <div key={field.id} style={styles.fieldGroup}>
                          <label style={styles.label}>
                            {field.fieldName}
                            {!field.isPredefined && (
                              <span style={styles.customBadge}>custom</span>
                            )}
                          </label>
                          <input
                            type="text"
                            value={field.fieldValue || ""}
                            onChange={(e) =>
                              onUpdateField(testName, field.id, e.target.value)
                            }
                            placeholder={field.placeholder || "Enter value..."}
                            style={styles.input}
                            disabled={saving}
                          />
                        </div>
                      ))}
                    </div>
                    {/* <div style={styles.addCustomSection}>
                      <div style={styles.addCustomRow}>
                        <input
                          type="text"
                          placeholder="New field name (e.g. 'pH Level')"
                          value={newFieldName[testName] || ""}
                          onChange={(e) =>
                            setNewFieldName((prev) => ({
                              ...prev,
                              [testName]: e.target.value,
                            }))
                          }
                          style={styles.addFieldInput}
                          disabled={saving}
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          value={newFieldValue[testName] || ""}
                          onChange={(e) =>
                            setNewFieldValue((prev) => ({
                              ...prev,
                              [testName]: e.target.value,
                            }))
                          }
                          style={styles.addFieldInput}
                          disabled={saving}
                        />
                        <button
                          onClick={() => handleAddClick(testName)}
                          style={styles.addFieldBtn}
                          disabled={saving}
                        >
                          + Add Custom Field
                        </button>
                      </div>
                      <small style={styles.addHint}>
                        Custom field name + value are saved together.
                      </small>
                    </div> */}
                  </div>
                ),
              )}
              {Object.keys(testData).length === 0 && <p>No tests found.</p>}
            </>
          )}
        </div>
        <div style={styles.modalFooter}>
          <button
            onClick={onSave}
            style={styles.saveBtn}
            disabled={loading || saving}
          >
            💾 Save Changes
          </button>
          <button
            onClick={onCancel}
            style={styles.cancelBtn}
            disabled={loading || saving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== Main Component ==========
const AllReports = () => {
  const [trfList, setTrfList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTrf, setSelectedTrf] = useState(null);
  const [editingTrf, setEditingTrf] = useState(null);
  const [editTestData, setEditTestData] = useState(null);
  const [testNameToIdMap, setTestNameToIdMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfProductName, setPdfProductName] = useState("");

  const [tableSearch, setTableSearch] = useState("");
  const [sortField, setSortField] = useState("submittedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        if (res.data && res.data.allProducts)
          setAllProducts(res.data.allProducts);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    api
      .get(`/tests`)
      .then((res) => {
        const mapping = {};
        Object.entries(res.data.TESTING_FIELDS).forEach(([name, fields]) => {
          if (fields && fields.length > 0) mapping[name] = fields[0]?.id;
        });
        setTestNameToIdMap(mapping);
      })
      .catch(console.error);
  }, []);

  const loadTrfs = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoadingList(true);
    try {
      const response = await api.get(`/trf/submitted`);
      setTrfList(response.data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      alert("Failed to load reports");
    } finally {
      setLoadingList(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTrfs();
  }, []);

  const handleViewPdf = (productName) => {
    const product = allProducts.find((p) => p.productName === productName);
    if (!product || !product.pdf_path) {
      alert("No PDF document attached to this product.");
      return;
    }
    const fullUrl = getPdfFullUrl(product.pdf_path);
    setPdfUrl(fullUrl);
    setPdfProductName(product.productName);
    setPdfModalOpen(true);
  };

  const getTestNamesString = (trf) => (trf.testNames || []).join(" ");

  // UPDATED: search also includes lotNo
  const filterTableData = (data) => {
    if (!tableSearch) return data;
    const searchLower = tableSearch.toLowerCase();
    return data.filter(
      (item) =>
        item.trfCode?.toLowerCase().includes(searchLower) ||
        item.companyName?.toLowerCase().includes(searchLower) ||
        item.requestName?.toLowerCase().includes(searchLower) ||
        item.productName?.toLowerCase().includes(searchLower) ||
        (item.lotNo && item.lotNo.toLowerCase().includes(searchLower)) ||
        getTestNamesString(item).toLowerCase().includes(searchLower),
    );
  };

  // UPDATED: sort by lotNo
  const sortTableData = (data, field, direction) => {
    if (!field) return data;
    return [...data].sort((a, b) => {
      let valA, valB;
      switch (field) {
        case "trfCode":
          valA = a.trfCode || "";
          valB = b.trfCode || "";
          break;
        case "companyName":
          valA = a.companyName || "";
          valB = b.companyName || "";
          break;
        case "requestName":
          valA = a.requestName || "";
          valB = b.requestName || "";
          break;
        case "productName":
          valA = a.productName || "";
          valB = b.productName || "";
          break;
        case "lotNo":
          valA = a.lotNo || "";
          valB = b.lotNo || "";
          break;
        case "tests":
          valA = getTestNamesString(a);
          valB = getTestNamesString(b);
          break;
        case "submittedAt":
          valA = new Date(a.submittedAt);
          valB = new Date(b.submittedAt);
          break;
        default:
          valA = a[field] || "";
          valB = b[field] || "";
      }
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const paginateData = (data, page, perPage) => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  const processedData = useMemo(() => {
    const filtered = filterTableData(trfList);
    const sorted = sortTableData(filtered, sortField, sortDirection);
    const paginated = paginateData(sorted, currentPage, itemsPerPage);
    return { data: paginated, total: filtered.length };
  }, [
    trfList,
    tableSearch,
    sortField,
    sortDirection,
    currentPage,
    itemsPerPage,
  ]);

  useEffect(() => setCurrentPage(1), [tableSearch, itemsPerPage]);

  const handleSort = (field) => {
    if (sortField === field)
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIndicator = ({ field }) =>
    sortField === field ? (
      <span className="trf-sort-indicator">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    ) : (
      <span className="trf-sort-indicator"></span>
    );

  const PaginationControls = () => {
    const totalPages = Math.ceil(processedData.total / itemsPerPage);
    const startItem =
      processedData.total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, processedData.total);
    return (
      <div style={styles.paginationContainer}>
        <div style={styles.itemsPerPage}>
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            style={styles.itemsPerPageSelect}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>
        <div>
          Showing {startItem} to {endItem} of {processedData.total} entries
        </div>
        <div style={styles.paginationButtons}>
          <button
            style={styles.paginationBtn}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) pageNum = i + 1;
            else if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2)
              pageNum = totalPages - 4 + i;
            else pageNum = currentPage - 2 + i;
            return (
              <button
                key={pageNum}
                style={{
                  ...styles.paginationBtn,
                  ...(currentPage === pageNum ? styles.paginationActive : {}),
                }}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            style={styles.paginationBtn}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const startEdit = async (trf) => {
    setEditingTrf(trf);
    setEditLoading(true);
    setEditTestData(null);
    try {
      const res = await api.get(`/trf/user/${trf.id}`);
      const { fieldsByTest } = res.data;
      const testDataObj = {};
      for (const [testName, fields] of Object.entries(fieldsByTest)) {
        const testId = testNameToIdMap[testName];
        if (!testId) {
          console.warn(`No testId found for testName: ${testName}`);
          continue;
        }
        testDataObj[testName] = {
          testId,
          fields: fields.map((f) => ({
            id: f.fieldRowId,
            fieldName: f.label,
            fieldValue: f.currentValue || "",
            placeholder: f.placeholder,
            isPredefined: f.isPredefined,
            dbFieldId: f.isPredefined ? f.fieldId : null,
          })),
        };
      }
      setEditTestData(testDataObj);
    } catch (err) {
      console.error(err);
      alert("Could not load test data for editing");
      setEditingTrf(null);
    } finally {
      setEditLoading(false);
    }
  };

  const updateFieldValue = (testName, fieldId, value) => {
    setEditTestData((prev) => ({
      ...prev,
      [testName]: {
        ...prev[testName],
        fields: prev[testName].fields.map((f) =>
          f.id === fieldId ? { ...f, fieldValue: value } : f,
        ),
      },
    }));
  };

  const addCustomField = (testName, fieldName, initialValue = "") => {
    const newFieldId = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newField = {
      id: newFieldId,
      fieldName: fieldName.trim(),
      fieldValue: initialValue,
      placeholder: "Enter custom value",
      isPredefined: false,
      dbFieldId: null,
    };
    setEditTestData((prev) => ({
      ...prev,
      [testName]: {
        ...prev[testName],
        fields: [...(prev[testName]?.fields || []), newField],
      },
    }));
  };

  const saveEdit = async () => {
    if (!editingTrf || !editTestData) return;
    const selectedTests = [];
    for (const [testName, { testId, fields }] of Object.entries(editTestData)) {
      if (!testId) {
        alert(`Test ID missing for ${testName}. Cannot save.`);
        return;
      }
      selectedTests.push({
        testId,
        fields: fields.map((f) => ({
          fieldId: f.isPredefined ? f.dbFieldId : null,
          customLabel: f.isPredefined ? f.fieldName : f.fieldName,
          placeholder: f.placeholder,
          label: f.fieldName,
          isPredefined: f.isPredefined,
          fieldValue: f.fieldValue || "",
        })),
      });
    }
    const payload = {
      requestName: editingTrf.requestName,
      lotNo: editingTrf.lotNo,
      remark: editingTrf.remark,
      createdBy: editingTrf.createdBy || "admin@example.com",
      selectedTests,
    };
    setSaving(true);
    try {
      await api.put(`/trf/${editingTrf.id}`, payload);
      alert("Updated successfully!");
      setEditingTrf(null);
      setEditTestData(null);
      loadTrfs(true);
    } catch (err) {
      console.error(err);
      alert("Save failed: " + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingTrf(null);
    setEditTestData(null);
    setEditLoading(false);
  };

  const getTestNames = (trf) => trf.testNames || [];

  const renderTableContent = () => {
    if (loadingList && !refreshing)
      return (
        <div style={styles.loaderContainer}>
          <Spinner size={36} />
          <p>Loading reports...</p>
        </div>
      );
    if (trfList.length === 0)
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <h3>No submitted test requests yet</h3>
          <p>After users fill and submit forms, they will appear here.</p>
        </div>
      );
    return (
      <>
        <div style={styles.statsBar}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span>
              ✅ Submitted forms: <strong>{trfList.length}</strong>
            </span>
            <button
              onClick={() => loadTrfs(true)}
              style={styles.refreshIconBtn}
              disabled={refreshing}
            >
              {refreshing ? <Spinner size={16} /> : "🔄 Refresh"}
            </button>
          </div>
          <input
            type="text"
            placeholder="🔍 Search reports..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            style={styles.tableSearchInput}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th
                  className="trf-sortable-th"
                  onClick={() => handleSort("trfCode")}
                  style={styles.th}
                >
                  TRF Code <SortIndicator field="trfCode" />
                </th>
                <th
                  className="trf-sortable-th"
                  onClick={() => handleSort("companyName")}
                  style={styles.th}
                >
                  Company <SortIndicator field="companyName" />
                </th>
                <th
                  className="trf-sortable-th"
                  onClick={() => handleSort("requestName")}
                  style={styles.th}
                >
                  Request Name <SortIndicator field="requestName" />
                </th>
                <th
                  className="trf-sortable-th"
                  onClick={() => handleSort("productName")}
                  style={styles.th}
                >
                  Product <SortIndicator field="productName" />
                </th>
                {/* NEW LOT NO COLUMN HEADER */}
                <th
                  className="trf-sortable-th"
                  onClick={() => handleSort("lotNo")}
                  style={styles.th}
                >
                  Lot No. <SortIndicator field="lotNo" />
                </th>
                <th
                  className="trf-sortable-th"
                  onClick={() => handleSort("tests")}
                  style={styles.th}
                >
                  Tests <SortIndicator field="tests" />
                </th>
                <th
                  className="trf-sortable-th"
                  onClick={() => handleSort("submittedAt")}
                  style={styles.th}
                >
                  Submitted At <SortIndicator field="submittedAt" />
                </th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedData.data.map((trf) => (
                <tr key={trf.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <code style={styles.codeBadge}>{trf.trfCode}</code>
                  </td>
                  <td style={styles.td}>{trf.companyName}</td>
                  <td style={styles.td}>{trf.requestName}</td>
                  <td style={styles.td}>{trf.productName}</td>
                  {/* NEW LOT NO DATA */}
                  <td style={styles.td}>{trf.lotNo || "—"}</td>
                  <td style={styles.td}>
                    <div style={styles.tagsContainer}>
                      {getTestNames(trf)
                        .slice(0, 2)
                        .map((name, idx) => (
                          <span key={idx} style={styles.testTag}>
                            {name}
                          </span>
                        ))}
                      {getTestNames(trf).length > 2 && (
                        <span style={styles.testTagMore}>
                          +{getTestNames(trf).length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>{formatDate(trf.submittedAt)}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleViewPdf(trf.productName)}
                      style={styles.pdfBtn}
                      title="View Product PDF"
                    >
                      📄 PDF
                    </button>
                    <button
                      onClick={() => setSelectedTrf(trf)}
                      style={styles.viewBtn}
                    >
                      👁️ View
                    </button>
                    <button
                      onClick={() => startEdit(trf)}
                      style={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
              {processedData.data.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No matching reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationControls />
      </>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>📊 All TRF Test Requests Reports</h1>
        <p style={styles.subtitle}>
          View and edit finalized test requests (including custom fields).
        </p>
      </div>
      <div style={styles.tableWrapper}>{renderTableContent()}</div>

      {selectedTrf && (
        <ViewModal
          trf={selectedTrf}
          onClose={() => setSelectedTrf(null)}
          allProducts={allProducts}
        />
      )}
      {editingTrf && (
        <EditModal
          trf={editingTrf}
          testData={editTestData || {}}
          onUpdateField={updateFieldValue}
          onAddCustomField={addCustomField}
          onSave={saveEdit}
          onCancel={cancelEdit}
          saving={saving}
          loading={editLoading}
        />
      )}
      {pdfModalOpen && (
        <PdfModal
          pdfUrl={pdfUrl}
          productName={pdfProductName}
          onClose={() => setPdfModalOpen(false)}
        />
      )}
    </div>
  );
};

// ========== Styles (same as before, no changes needed) ==========
const styles = {
  container: {
    maxWidth: "95%",
    margin: "0 auto",
    padding: "40px 24px",
    background: "#ffffff",
    color: "#1e293b",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  header: { marginBottom: "32px" },
  mainTitle: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "8px",
    letterSpacing: "-0.3px",
  },
  subtitle: { fontSize: "1rem", color: "#64748b" },
  tableWrapper: {
    background: "#ffffff",
    borderRadius: "24px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    minHeight: "300px",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
  },
  statsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    background: "#fafcff",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "0.9rem",
    flexWrap: "wrap",
    gap: "12px",
  },
  refreshIconBtn: {
    background: "transparent",
    border: "1px solid #cbd5e1",
    borderRadius: "30px",
    padding: "4px 12px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.75rem",
  },
  tableSearchInput: {
    padding: "8px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "40px",
    fontSize: "0.85rem",
    width: "240px",
    outline: "none",
    fontFamily: "inherit",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
    minWidth: "680px",
  },
  th: {
    textAlign: "left",
    padding: "16px 16px",
    backgroundColor: "#f8fafc",
    fontWeight: "600",
    color: "#1e293b",
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "14px 16px",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  },
  tableRow: { transition: "background 0.2s" },
  codeBadge: {
    background: "#f1f5f9",
    padding: "4px 8px",
    borderRadius: "8px",
    fontFamily: "monospace",
    fontSize: "0.75rem",
  },
  tagsContainer: { display: "flex", flexWrap: "wrap", gap: "6px" },
  testTag: {
    background: "#ede9fe",
    color: "#5b21b6",
    padding: "4px 10px",
    borderRadius: "30px",
    fontSize: "0.7rem",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  testTagMore: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "4px 10px",
    borderRadius: "30px",
    fontSize: "0.7rem",
    fontWeight: "500",
  },
  pdfBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    padding: "5px 12px",
    marginRight: "8px",
    cursor: "pointer",
    fontSize: "0.7rem",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  viewBtn: {
    background: "transparent",
    border: "1px solid #cbd5e1",
    borderRadius: "30px",
    padding: "5px 12px",
    marginRight: "8px",
    cursor: "pointer",
    fontSize: "0.7rem",
    fontWeight: "500",
  },
  editBtn: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    padding: "5px 12px",
    cursor: "pointer",
    fontSize: "0.7rem",
    fontWeight: "500",
  },
  emptyState: {
    textAlign: "center",
    padding: "64px 24px",
    background: "#f8fafc",
    borderRadius: "24px",
  },
  emptyIcon: { fontSize: "4rem", marginBottom: "16px", opacity: 0.6 },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContent: {
    background: "#fff",
    borderRadius: "24px",
    maxWidth: "900px",
    height: "100%",
    width: "100%",
    maxHeight: "95vh",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 35px -10px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 28px",
    borderBottom: "1px solid #e2e8f0",
  },
  modalTitle: { fontSize: "1.5rem", fontWeight: "600", margin: 0 },
  modalCloseBtn: {
    background: "none",
    border: "none",
    fontSize: "2rem",
    cursor: "pointer",
    lineHeight: 1,
  },
  modalBody: { padding: "24px 28px", flex: 1 },
  modalLoaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: "12px",
  },
  modalSection: { marginBottom: "28px" },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "12px",
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "20px",
  },
  testResultBlock: {
    background: "#fefefe",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "16px 20px",
    marginBottom: "20px",
  },
  predefinedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "8px 16px",
    marginTop: "8px",
  },
  predefinedItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px dashed #e2e8f0",
    padding: "6px 0",
    flexWrap: "wrap",
  },
  remarkBox: {
    background: "#fefce8",
    padding: "16px",
    borderRadius: "16px",
    borderLeft: "4px solid #eab308",
    whiteSpace: "pre-wrap",
  },
  modalFooter: {
    padding: "16px 28px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
  closeModalBtn: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    padding: "8px 24px",
    borderRadius: "40px",
    cursor: "pointer",
  },
  saveBtn: {
    background: "#15803d",
    color: "#fff",
    border: "none",
    padding: "8px 24px",
    borderRadius: "40px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  cancelBtn: {
    background: "#94a3b8",
    color: "#fff",
    border: "none",
    padding: "8px 24px",
    borderRadius: "40px",
    cursor: "pointer",
  },
  editTestSection: {
    marginBottom: "32px",
    paddingBottom: "24px",
    borderBottom: "1px solid #e2e8f0",
  },
  editTestTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "16px",
  },
  grid2Col: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "16px",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  label: {
    fontWeight: "500",
    fontSize: "0.8rem",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  customBadge: {
    background: "#e8f4fd",
    color: "#1565c0",
    fontSize: "0.7rem",
    padding: "1px 7px",
    borderRadius: "20px",
    fontWeight: 500,
  },
  input: {
    padding: "8px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    fontSize: "0.9rem",
    outline: "none",
    transition: "0.2s",
  },
  addCustomSection: {
    marginTop: "20px",
    paddingTop: "12px",
    borderTop: "1px dashed #cbd5e1",
  },
  addCustomRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  addFieldInput: {
    flex: 1,
    minWidth: "150px",
    padding: "8px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    fontSize: "0.85rem",
  },
  addFieldBtn: {
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: "30px",
    padding: "6px 16px",
    cursor: "pointer",
    fontWeight: 500,
  },
  addHint: {
    display: "block",
    marginTop: "8px",
    fontSize: "0.7rem",
    color: "#64748b",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderTop: "1px solid #e2e8f0",
    flexWrap: "wrap",
    gap: "16px",
    fontSize: "0.85rem",
  },
  itemsPerPage: { display: "flex", alignItems: "center", gap: "8px" },
  itemsPerPageSelect: {
    padding: "6px 10px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  paginationButtons: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  paginationBtn: {
    background: "transparent",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
  },
  paginationActive: {
    background: "#0f172a",
    color: "#ffffff",
    borderColor: "#0f172a",
  },
  inRangeBadge: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "2px 8px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "500",
    display: "inline-block",
    marginTop: "4px",
  },
  outRangeBadge: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "2px 8px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "500",
    display: "inline-block",
    marginTop: "4px",
  },
  noRangeBadge: {
    background: "#fef3c7",
    color: "#b45309",
    padding: "2px 8px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "500",
    display: "inline-block",
    marginTop: "4px",
  },
  reportContainer: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },
  reportHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "2px solid #e2e8f0",
  },
  reportTitleSection: { textAlign: "left" },
  reportTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    margin: 0,
    color: "#0f172a",
  },
  reportSubtitle: { fontSize: "0.9rem", color: "#64748b", marginTop: "4px" },
  reportLogo: {
    background: "#f1f5f9",
    padding: "8px 16px",
    borderRadius: "40px",
  },
  logoText: { fontWeight: "600", fontSize: "1.2rem" },
  infoCards: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginBottom: "28px",
  },
  infoCard: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  infoCardTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    margin: "0 0 12px 0",
    color: "#1e293b",
    borderLeft: "4px solid #3b82f6",
    paddingLeft: "10px",
  },
  infoRow: {
    fontSize: "0.85rem",
    marginBottom: "8px",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px dotted #cbd5e1",
    paddingBottom: "4px",
  },
  testTableWrapper: {
    marginBottom: "28px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    overflow: "hidden",
  },
  testTableTitle: {
    background: "#f1f5f9",
    margin: 0,
    padding: "10px 16px",
    fontSize: "1rem",
    fontWeight: "600",
    borderBottom: "1px solid #e2e8f0",
  },
  resultsTable: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.8rem",
  },
  tableHeader: {
    textAlign: "left",
    padding: "10px 12px",
    background: "#f8fafc",
    fontWeight: "600",
    borderBottom: "1px solid #e2e8f0",
  },
  tableCell: { padding: "8px 12px", borderBottom: "1px solid #f1f5f9" },
  statusNormal: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "2px 8px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "500",
  },
  statusAbnormal: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "2px 8px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "500",
  },
  statusUnknown: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "2px 8px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "500",
  },
  interpretationBox: {
    background: "#fffbeb",
    borderLeft: "4px solid #f59e0b",
    padding: "16px",
    borderRadius: "12px",
    marginTop: "20px",
    marginBottom: "20px",
  },
  interpretationTitle: {
    margin: "0 0 8px 0",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#b45309",
  },
  interpretationText: { margin: 0, fontSize: "0.85rem", color: "#78350f" },
  reportFooter: {
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0",
    textAlign: "center",
    fontSize: "0.7rem",
    color: "#64748b",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  signatureLine: { textAlign: "center", fontSize: "0.7rem", color: "#475569" },
  reportFooterText: { fontSize: "0.7rem", color: "#94a3b8" },
  downloadPdfBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `.lm-table-row:hover { background-color: #f8fafc; }`;
  document.head.appendChild(style);
}

export default AllReports;
