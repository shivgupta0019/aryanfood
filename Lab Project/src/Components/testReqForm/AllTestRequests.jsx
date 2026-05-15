import React, { useState, useEffect, useMemo } from "react";
import api from "../../api/axiosConfig";

// Spinner Component
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
  `;
  document.head.appendChild(style);
}

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString();
};

// Helper to get full PDF URL
const getPdfFullUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith("http")) return relativePath;
  const backendBase =
    api.defaults.baseURL?.replace(/\/api$/, "") || "http://localhost:5000";
  const cleanBase = backendBase.replace(/\/$/, "");
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${cleanBase}${path}`;
};

// ========== PDF Modal ==========
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

// ========== IMPROVED ViewModal (Test Request Report) ==========
const ViewModal = ({ trf, fieldsByTest, onClose, loading }) => {
  if (!trf) return null;

  const formatDateOnly = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleString();
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div
        style={{ ...styles.modalContent, maxWidth: "1000px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>📋 Test Request Report</h2>
          <button style={styles.modalCloseBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div style={styles.modalBody}>
          {loading ? (
            <div style={styles.modalLoaderContainer}>
              <Spinner size={40} />
              <p>Loading details...</p>
            </div>
          ) : (
            <div style={styles.reportContainer}>
              {/* Report Header */}
              <div style={styles.reportHeader}>
                <div>
                  <h2 style={styles.reportTitle}>Aryan Food Ingredients Limited </h2>
                  <p style={styles.reportSubtitle}>
               
                  </p>
                </div>
                 
              </div>

              {/* Information Cards */}
              <div style={styles.infoCards}>
                <div style={styles.infoCard}>
                  <h3 style={styles.infoCardTitle}>Request Details</h3>
                  <div style={styles.infoRow}>
                    <strong>TRF Code:</strong> {trf.trfCode}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Company:</strong> {trf.companyName}  
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Request Name:</strong> {trf.requestName}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Product:</strong> {trf.productName}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Product Code:</strong> {trf.sampleCode || "—"}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Lot No.:</strong> {trf.lotNo || "—"}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Created:</strong> {formatDateTime(trf.createdAt)}
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <h3 style={styles.infoCardTitle}>Collection & Status</h3>
                  <div style={styles.infoRow}>
                    <strong>Lab Code:</strong> {trf.labName}  
                  </div>
                    <div style={styles.infoRow}>
                    <strong>Lab:</strong>  {trf.labCode}  
                  </div>
                    <div style={styles.infoRow}>
                    <strong>Lab Type:</strong>  
                    {trf.labType}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Status:</strong>{" "}
                    {trf.status === "filled" ? (
                      <span style={styles.statusBadge}>✅ Filled</span>
                    ) : (
                      <span style={styles.statusBadgePending}>⏳ Pending</span>
                    )}
                  </div>
                  
                  <div style={styles.infoRow}>
                    <strong>Last Updated:</strong>{" "}
                    {formatDateTime(trf.updatedAt)}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Reported On:</strong> {formatDateOnly(new Date())}
                  </div>
                </div>
              </div>

              {/* Test Results */}
              {fieldsByTest && Object.keys(fieldsByTest).length > 0 && (
                <div style={styles.testResultsSection}>
                  <h3 style={styles.testResultsTitle}>🧪 Test Results</h3>
                  {Object.entries(fieldsByTest).map(([testName, fields]) => (
                    <div key={testName} style={styles.testCard}>
                      <h4 style={styles.testCardTitle}>
                        🔬 {testName} Analysis
                      </h4>
                      <div style={styles.resultsGrid}>
                        {fields.map((field) => (
                          <div key={field.fieldRowId} style={styles.resultItem}>
                            <span style={styles.resultLabel}>
                              {field.label}
                            </span>
                            <span style={styles.resultValue}>
                              {field.currentValue || "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Remarks */}
              {/* {trf.remark && (
                <div style={styles.interpretationBox}>
                  <h4 style={styles.interpretationTitle}>
                    📝 Remarks / Interpretation
                  </h4>
                  <p style={styles.interpretationText}>{trf.remark}</p>
                </div>
              )} */}

              {/* Footer Signatures */}
              {/* <div style={styles.reportFooter}>
                <div style={styles.signatureLine}>
                  <div>_________________________</div>
                  <div>Lab Technician</div>
                </div>
                <div style={styles.signatureLine}>
                  <div>_________________________</div>
                  <div>Pathologist</div>
                </div>
                <div style={styles.reportFooterText}>
                  This report is generated electronically and requires no
                  physical signature.
                </div>
              </div> */}
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

// ========== Edit/Fill Modal ==========
const EditModal = ({
  trf,
  fieldsByTest,
  onSave,
  onCancel,
  onFieldChange,
  loading,
  saving,
}) => {
  if (!trf) return null;

  const getStatusBadge = () => {
    if (trf.status === "filled") {
      return (
        <span style={styles.editStatusBadgeFilled}>
          ✏️ Edit Mode (Results already filled)
        </span>
      );
    }
    return (
      <span style={styles.editStatusBadgePending}>
        📝 Fill Mode (Enter test values)
      </span>
    );
  };

  return (
    <div style={styles.modalOverlay} onClick={onCancel}>
      <div
        style={{ ...styles.modalContent, maxWidth: "1100px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {trf.status === "filled"
              ? "✏️ Edit Test Results"
              : "📝 Fill Test Values"}
          </h2>
          <button style={styles.modalCloseBtn} onClick={onCancel}>
            ×
          </button>
        </div>

        {/* Context Banner */}
        <div style={styles.editContextBanner}>
          <div style={styles.editContextInfo}>
            <span style={styles.editContextLabel}>Request:</span>
            <strong>{trf.requestName}</strong>
            <span style={styles.editContextSeparator}>•</span>
            <span style={styles.editContextLabel}>Product:</span>
            <strong>{trf.productName}</strong>
            <span style={styles.editContextSeparator}>•</span>
            <span style={styles.editContextLabel}>Lot No:</span>
            <strong>{trf.lotNo || "—"}</strong>
          </div>
          {getStatusBadge()}
        </div>

        <div style={styles.modalBody}>
          {loading ? (
            <div style={styles.modalLoaderContainer}>
              <Spinner size={40} />
              <p>Loading fields...</p>
            </div>
          ) : saving ? (
            <div style={styles.modalLoaderContainer}>
              <Spinner size={40} />
              <p>Saving changes...</p>
            </div>
          ) : (
            <div style={styles.editFormContainer}>
              {Object.entries(fieldsByTest).map(([testName, fields]) => (
                <div key={testName} style={styles.editTestCard}>
                  <div style={styles.editTestCardHeader}>
                    <span style={styles.editTestIcon}>🔬</span>
                    <h3 style={styles.editTestTitle}>{testName} Analysis</h3>
                  </div>
                  <div style={styles.editFieldsGrid}>
                    {fields.map((field) => (
                      <div key={field.fieldRowId} style={styles.editFieldGroup}>
                        <label style={styles.editFieldLabel}>
                          {field.label}
                          {field.placeholder?.toLowerCase().includes("required") && (
                            <span style={styles.requiredStar}>*</span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={field.currentValue || ""}
                          onChange={(e) =>
                            onFieldChange(
                              testName,
                              field.fieldRowId,
                              e.target.value
                            )
                          }
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                          style={styles.editFieldInput}
                          disabled={saving}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(fieldsByTest).length === 0 && (
                <div style={styles.editEmptyState}>
                  <span>📭</span>
                  <p>No test fields available for this request.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={styles.modalFooter}>
          <button
            onClick={onSave}
            style={styles.editSaveBtn}
            disabled={loading || saving}
          >
            {saving ? (
              <>
                <Spinner size={18} color="#ffffff" /> Saving...
              </>
            ) : (
              "💾 Save Changes"
            )}
          </button>
          <button
            onClick={onCancel}
            style={styles.editCancelBtn}
            disabled={loading || saving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
const EditModal1 = ({
  trf,
  fieldsByTest,
  onSave,
  onCancel,
  onFieldChange,
  loading,
  saving,
}) => {
  if (!trf) return null;
  return (
    <div style={styles.modalOverlay} onClick={onCancel}>
      <div
        style={{ ...styles.modalContent, maxWidth: "1000px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {trf.status === "filled"
              ? "✏️ Edit Results"
              : "📝 Fill Test Values"}
          </h2>
          <button style={styles.modalCloseBtn} onClick={onCancel}>
            ×
          </button>
        </div>
        <div style={styles.modalBody}>
          {loading ? (
            <div style={styles.modalLoaderContainer}>
              <Spinner size={40} />
              <p>Loading fields...</p>
            </div>
          ) : saving ? (
            <div style={styles.modalLoaderContainer}>
              <Spinner size={40} />
              <p>Saving changes...</p>
            </div>
          ) : (
            <>
              <div style={styles.infoGrid} className="compact">
                <div>
                  <strong>Request:</strong> {trf.requestName}
                </div>
                <div>
                  <strong>Product:</strong> {trf.productName}
                </div>
                <div>
                  <strong>Lot No:</strong> {trf.lotNo || "—"}
                </div>
              </div>
              {Object.entries(fieldsByTest).map(([testName, fields]) => (
                <div key={testName} style={styles.editTestSection}>
                  <h3 style={styles.editTestTitle}>🔬 {testName} Analysis</h3>
                  <div style={styles.grid2Col}>
                    {fields.map((field) => (
                      <div key={field.fieldRowId} style={styles.fieldGroup}>
                        <label style={styles.label}>{field.label}</label>
                        <input
                          type="text"
                          value={field.currentValue || ""}
                          onChange={(e) =>
                            onFieldChange(
                              testName,
                              field.fieldRowId,
                              e.target.value,
                            )
                          }
                          placeholder={field.placeholder}
                          style={styles.input}
                          disabled={saving}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(fieldsByTest).length === 0 && (
                <p>No fields to fill.</p>
              )}
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
const AllTestRequests = () => {
  const [trfList, setTrfList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTrf, setSelectedTrf] = useState(null);
  const [selectedFieldsByTest, setSelectedFieldsByTest] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [editingTrf, setEditingTrf] = useState(null);
  const [editFieldsByTest, setEditFieldsByTest] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submittingId, setSubmittingId] = useState(null);

  // PDF Modal state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfProductName, setPdfProductName] = useState("");

  // Table pagination / sort / search
  const [tableSearch, setTableSearch] = useState("");
  const [sortField, setSortField] = useState("updatedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load all products (to get PDF paths)
  const loadAllProducts = async () => {
    try {
      const response = await api.get("/products");
      if (response.data && response.data.allProducts) {
        setAllProducts(response.data.allProducts);
      }
    } catch (error) {
      console.error("Failed to load products for PDFs", error);
    }
  };

  // Load pending TRFs (not_filled + filled)
  const loadTrfList = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true);
    else setLoadingList(true);
    try {
      const response = await api.get(`/trf/pending`);
      setTrfList(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to load TRFs", error);
      alert("Could not load test requests");
    } finally {
      setLoadingList(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllProducts();
    loadTrfList();
  }, []);

  // Open PDF modal for a product
  const handleViewPdf = (sampleCode) => {
    const product = allProducts.find((p) => p?.productId === sampleCode);
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

  // Filter logic
  const filterTableData = (data) => {
    if (!tableSearch) return data;
    const searchLower = tableSearch.toLowerCase();
    return data.filter((item) => {
      return (
        item.trfCode?.toLowerCase().includes(searchLower) ||
        item.companyName?.toLowerCase().includes(searchLower) ||
        item.requestName?.toLowerCase().includes(searchLower) ||
        item.productName?.toLowerCase().includes(searchLower) ||
        getTestNamesString(item).toLowerCase().includes(searchLower) ||
        (item.status === "filled" ? "filled" : "pending").includes(searchLower)
      );
    });
  };

  // Sort logic
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
        case "tests":
          valA = getTestNamesString(a);
          valB = getTestNamesString(b);
          break;
        case "updatedAt":
          valA = new Date(a.updatedAt || a.createdAt);
          valB = new Date(b.updatedAt || b.createdAt);
          break;
        case "status":
          valA = a.status === "filled" ? 1 : 0;
          valB = b.status === "filled" ? 1 : 0;
          break;
        default:
          valA = a[field] || "";
          valB = b[field] || "";
      }
      if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
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

  useEffect(() => {
    setCurrentPage(1);
  }, [tableSearch, itemsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIndicator = ({ field }) => {
    if (sortField !== field)
      return <span className="trf-sort-indicator"></span>;
    return (
      <span className="trf-sort-indicator">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

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
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
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

  // View details
  const handleView = async (trf) => {
    setViewLoading(true);
    setSelectedTrf(trf);
    try {
      const response = await api.get(`/trf/user/${trf.id}`);
      setSelectedFieldsByTest(response.data.fieldsByTest);
    } catch (error) {
      alert("Failed to load details");
      setSelectedTrf(null);
    } finally {
      setViewLoading(false);
    }
  };

  // Open edit modal
  const handleEdit = async (trf) => {
    setEditLoading(true);
    setEditingTrf(trf);
    try {
      const response = await api.get(`/trf/user/${trf.id}`);
      setEditFieldsByTest(response.data.fieldsByTest);
    } catch (error) {
      alert("Failed to load fields for editing");
      setEditingTrf(null);
    } finally {
      setEditLoading(false);
    }
  };

  // Update field in edit modal
  const handleFieldChange = (testName, fieldRowId, value) => {
    setEditFieldsByTest((prev) => ({
      ...prev,
      [testName]: prev[testName].map((f) =>
        f.fieldRowId === fieldRowId ? { ...f, currentValue: value } : f,
      ),
    }));
  };

  // Save all edits
  const handleSaveEdit = async () => {
    if (!editingTrf) return;
    const fields = [];
    Object.values(editFieldsByTest).forEach((testFields) => {
      testFields.forEach((f) => {
        fields.push({ fieldRowId: f.fieldRowId, value: f.currentValue });
      });
    });
    const payload = { fields };
    setSaving(true);
    try {
      await api.patch(`/trf/${editingTrf.id}/fill`, payload);
      alert("Test results saved successfully!");
      setEditingTrf(null);
      setEditFieldsByTest({});
      loadTrfList(true);
    } catch (error) {
      console.error(error);
      alert("Failed to save results");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditingTrf(null);
    setEditFieldsByTest({});
  };

  // Submit TRF
  const handleSubmit = async (trfId) => {
    if (
      !window.confirm(
        "Submit this TRF? It will become read-only and moved to reports.",
      )
    )
      return;
    setSubmittingId(trfId);
    try {
      await api.post(`/trf/${trfId}/submit`);
      alert("TRF submitted successfully!");
      setTrfList((prev) => prev.filter((trf) => trf.id !== trfId));
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Submission failed");
    } finally {
      setSubmittingId(null);
    }
  };

  const getTestNames = (trf) => trf.testNames || [];

  const renderTableContent = () => {
    if (loadingList && !refreshing) {
      return (
        <div style={styles.loaderContainer}>
          <Spinner size={36} />
          <p>Loading requests...</p>
        </div>
      );
    }
    if (trfList.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <h3>No pending test request forms</h3>
          <p>All requests have been submitted or none exist yet.</p>
        </div>
      );
    }
    return (
      <>
        <div style={styles.statsBar}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span>
              📊 Pending forms: <strong>{trfList.length}</strong>
            </span>
            <button
              onClick={() => loadTrfList(true)}
              style={styles.refreshIconBtn}
              disabled={refreshing}
            >
              {refreshing ? <Spinner size={16} /> : "🔄 Refresh"}
            </button>
          </div>
          <input
            type="text"
            placeholder="🔍 Search requests..."
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
                <th
                  className="trf-sortable-th"
                  onClick={() => handleSort("tests")}
                  style={styles.th}
                >
                  Tests <SortIndicator field="tests" />
                </th>
                <th
                  className="trf-sortable-th"
                  onClick={() => handleSort("updatedAt")}
                  style={styles.th}
                >
                  Last Updated <SortIndicator field="updatedAt" />
                </th>
                <th
                  className="trf-sortable-th"
                  onClick={() => handleSort("status")}
                  style={styles.th}
                >
                  Status <SortIndicator field="status" />
                </th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedData.data.map((trf) => {
                const testNames = getTestNames(trf);
                return (
                  <tr key={trf.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <code style={styles.codeBadge}>{trf.trfCode}</code>
                    </td>
                    <td style={styles.td}>{trf.companyName}</td>
                    <td style={styles.td}>{trf.requestName}</td>
                    <td style={styles.td}>{trf.productName}</td>
                    <td style={styles.td}>
                      <div style={styles.tagsContainer}>
                        {testNames.slice(0, 2).map((name, idx) => (
                          <span key={idx} style={styles.testTag}>
                            {name}
                          </span>
                        ))}
                        {testNames.length > 2 && (
                          <span style={styles.testTagMore}>
                            +{testNames.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={styles.td}>
                      {formatDate(trf.updatedAt || trf.createdAt)}
                    </td>
                    <td style={styles.td}>
                      {trf.status === "filled" ? (
                        <span style={styles.filledBadge}>✅ Filled</span>
                      ) : (
                        <span style={styles.notFilledBadge}>⏳ Pending</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleViewPdf(trf.sampleCode)}
                        style={styles.pdfBtn}
                        title="View Product PDF"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleView(trf)}
                        style={styles.viewBtn}
                        disabled={viewLoading}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleEdit(trf)}
                        style={
                          trf.status === "filled"
                            ? styles.editBtn
                            : styles.fillBtn
                        }
                        disabled={editLoading}
                      >
                        {trf.status === "filled" ? "✏️ Edit" : "📝 Fill"}
                      </button>
                      {trf.status === "filled" && (
                        <button
                          onClick={() => handleSubmit(trf.id)}
                          style={styles.submitBtn}
                          disabled={submittingId === trf.id}
                        >
                          {submittingId === trf.id ? (
                            <Spinner size={16} />
                          ) : (
                            "✅ Submit"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {processedData.data.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    No matching requests found
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
        <h1 style={styles.mainTitle}>📋 Fill Test Request Forms</h1>
        <p style={styles.subtitle}>
          Fill or edit values, then submit final report.
        </p>
      </div>
      <div style={styles.tableWrapper}>{renderTableContent()}</div>

      {selectedTrf && (
        <ViewModal
          trf={selectedTrf}
          fieldsByTest={selectedFieldsByTest}
          onClose={() => {
            setSelectedTrf(null);
            setSelectedFieldsByTest(null);
          }}
          loading={viewLoading}
        />
      )}

      {editingTrf && (
        <EditModal
          trf={editingTrf}
          fieldsByTest={editFieldsByTest}
          onFieldChange={handleFieldChange}
          onSave={handleSaveEdit}
          onCancel={cancelEdit}
          loading={editLoading}
          saving={saving}
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

// ========== Styles ==========
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
  filledBadge: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "4px 10px",
    borderRadius: "30px",
    fontSize: "0.7rem",
    fontWeight: "600",
    display: "inline-block",
  },
  notFilledBadge: {
    background: "#fff3e3",
    color: "#b45309",
    padding: "4px 10px",
    borderRadius: "30px",
    fontSize: "0.7rem",
    fontWeight: "600",
    display: "inline-block",
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
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
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
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  fillBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    padding: "5px 12px",
    cursor: "pointer",
    fontSize: "0.7rem",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  submitBtn: {
    background: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    padding: "5px 12px",
    marginLeft: "8px",
    cursor: "pointer",
    fontSize: "0.7rem",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
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
    width: "100%",
    height: "100%",
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
    marginBottom: "20px",
  },
  testResultBlock: {
    background: "#fefefe",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "16px 20px",
    marginBottom: "20px",
  },
  testResultTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "12px",
  },
  predefinedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "8px 16px",
  },
  predefinedItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px dashed #e2e8f0",
    padding: "6px 0",
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
  label: { fontWeight: "500", fontSize: "0.8rem", color: "#475569" },
  input: {
    padding: "8px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    fontSize: "0.9rem",
    outline: "none",
    transition: "0.2s",
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
  itemsPerPage: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
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
  // New styles for improved ViewModal
  reportContainer: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px",
  },
  reportHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "2px solid #e2e8f0",
  },
  reportTitle: {
    fontSize: "1.6rem",
    fontWeight: "700",
    margin: 0,
    color: "#0f172a",
  },
  reportSubtitle: {
    fontSize: "0.8rem",
    color: "#64748b",
    marginTop: "4px",
  },
  reportLogo: {
    background: "#f1f5f9",
    padding: "8px 16px",
    borderRadius: "40px",
  },
  logoText: {
    fontWeight: "600",
    fontSize: "1rem",
  },
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
  statusBadge: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "2px 8px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "500",
  },
  statusBadgePending: {
    background: "#fff3e3",
    color: "#b45309",
    padding: "2px 8px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "500",
  },
  testResultsSection: {
    marginBottom: "24px",
  },
  testResultsTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#0f172a",
  },
  testCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    marginBottom: "20px",
    overflow: "hidden",
  },
  testCardTitle: {
    background: "#f1f5f9",
    margin: 0,
    padding: "12px 16px",
    fontSize: "1rem",
    fontWeight: "600",
    borderBottom: "1px solid #e2e8f0",
  },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "8px 16px",
    padding: "16px",
  },
  resultItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    borderBottom: "1px dashed #f1f5f9",
  },
  resultLabel: {
    fontWeight: "500",
    color: "#475569",
    fontSize: "0.85rem",
  },
  resultValue: {
    fontWeight: "600",
    color: "#0f172a",
    fontSize: "0.9rem",
    fontFamily: "monospace",
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
  interpretationText: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#78350f",
  },
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
  signatureLine: {
    textAlign: "center",
    fontSize: "0.7rem",
    color: "#475569",
  },
  reportFooterText: {
    fontSize: "0.7rem",
    color: "#94a3b8",
  },
  editContextBanner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    padding: "14px 28px",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "0.85rem",
  },
  editContextInfo: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "6px",
    color: "#334155",
  },
  editContextLabel: {
    color: "#64748b",
    marginRight: "4px",
  },
  editContextSeparator: {
    margin: "0 8px",
    color: "#cbd5e1",
  },
  editStatusBadgeFilled: {
    background: "#ede9fe",
    color: "#5b21b6",
    padding: "4px 12px",
    borderRadius: "30px",
    fontSize: "0.7rem",
    fontWeight: "500",
  },
  editStatusBadgePending: {
    background: "#dbeafe",
    color: "#1e40af",
    padding: "4px 12px",
    borderRadius: "30px",
    fontSize: "0.7rem",
    fontWeight: "500",
  },
  editFormContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  editTestCard: {
    background: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    transition: "box-shadow 0.2s, border-color 0.2s",
  },
  editTestCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "16px 24px",
    background: "#fafcff",
    borderBottom: "1px solid #eef2ff",
  },
  editTestIcon: {
    fontSize: "1.3rem",
  },
  editTestTitle: {
    fontSize: "1.05rem",
    fontWeight: "600",
    margin: 0,
    color: "#0f172a",
    letterSpacing: "-0.2px",
  },
  editFieldsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px 24px",
    padding: "24px",
  },
  editFieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  editFieldLabel: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  requiredStar: {
    color: "#ef4444",
    marginLeft: "4px",
  },
  editFieldInput: {
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "14px",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
    outline: "none",
    background: "#ffffff",
    color: "#0f172a",
  },
  editFieldInputFocus: {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59,130,246,0.1)",
  },
  editEmptyState: {
    textAlign: "center",
    padding: "48px 24px",
    background: "#f8fafc",
    borderRadius: "20px",
    color: "#64748b",
  },
  editSaveBtn: {
    background: "#059669",
    color: "#fff",
    border: "none",
    padding: "10px 28px",
    borderRadius: "40px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "background 0.2s",
  },
  editCancelBtn: {
    background: "#f1f5f9",
    color: "#334155",
    border: "1px solid #e2e8f0",
    padding: "10px 24px",
    borderRadius: "40px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "500",
    transition: "background 0.2s",
  },
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `.lm-table-row:hover { background-color: #f8fafc; }`;
  document.head.appendChild(style);
}

export default AllTestRequests;

 