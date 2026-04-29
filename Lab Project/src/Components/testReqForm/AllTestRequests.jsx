import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

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

// Add keyframe animation once
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
  `;
  document.head.appendChild(style);
}

// Helper: format date
const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString();
};

// ========== View Modal (Read-only) - loader inside card ==========
const ViewModal = ({ trf, fieldsByTest, onClose, loading }) => {
  if (!trf) return null;
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>📄 Test Request Form</h2>
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
            <>
              <div style={styles.modalSection}>
                <h3>🏢 Company & Request</h3>
                <div style={styles.infoGrid}>
                  <div>
                    <strong>TRF Code:</strong> {trf.trfCode}
                  </div>
                  <div>
                    <strong>Company:</strong> {trf.companyName} (
                    {trf.companyCode})
                  </div>
                  <div>
                    <strong>Request Name:</strong> {trf.requestName}
                  </div>
                  <div>
                    <strong>Lab:</strong> {trf.labName} ({trf.labCode}) –{" "}
                    {trf.labType}
                  </div>
                  <div>
                    <strong>Product:</strong> {trf.productName}
                  </div>
                  <div>
                    <strong>Lot No.:</strong> {trf.lotNo || "—"}
                  </div>
                  <div>
                    <strong>Sample Code:</strong> {trf.sampleCode || "—"}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    {trf.status === "filled" ? "✅ Filled" : "❌ Not Filled"}
                  </div>
                  <div>
                    <strong>Created:</strong> {formatDate(trf.createdAt)}
                  </div>
                  <div>
                    <strong>Last Updated:</strong> {formatDate(trf.updatedAt)}
                  </div>
                </div>
              </div>
              {fieldsByTest && Object.keys(fieldsByTest).length > 0 && (
                <div style={styles.modalSection}>
                  <h3>🧪 Test Results</h3>
                  {Object.entries(fieldsByTest).map(([testName, fields]) => (
                    <div key={testName} style={styles.testResultBlock}>
                      <h4 style={styles.testResultTitle}>
                        🔬 {testName} Analysis
                      </h4>
                      <div style={styles.predefinedGrid}>
                        {fields.map((field) => (
                          <div
                            key={field.fieldRowId}
                            style={styles.predefinedItem}
                          >
                            <span>{field.label}</span>
                            <span style={{ fontWeight: 500 }}>
                              {field.currentValue || "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {trf.remark && (
                <div style={styles.modalSection}>
                  <h3>📝 Remark</h3>
                  <div style={styles.remarkBox}>{trf.remark}</div>
                </div>
              )}
            </>
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

// ========== Edit/Fill Modal - loader inside card ==========
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
  const [loadingList, setLoadingList] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // View modal
  const [selectedTrf, setSelectedTrf] = useState(null);
  const [selectedFieldsByTest, setSelectedFieldsByTest] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  // Edit modal
  const [editingTrf, setEditingTrf] = useState(null);
  const [editFieldsByTest, setEditFieldsByTest] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load all TRFs
  const loadTrfList = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true);
    else setLoadingList(true);
    try {
      const response = await axios.get(`${API_BASE}/trf`);
      setTrfList(response.data);
    } catch (error) {
      console.error("Failed to load TRFs", error);
      alert("Could not load test requests");
    } finally {
      setLoadingList(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTrfList();
  }, []);

  // View details
  const handleView = async (trf) => {
    setViewLoading(true);
    setSelectedTrf(trf);
    try {
      const response = await axios.get(`${API_BASE}/trf/user/${trf.id}`);
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
      const response = await axios.get(`${API_BASE}/trf/user/${trf.id}`);
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
      await axios.patch(`${API_BASE}/trf/${editingTrf.id}/fill`, payload);
      alert("Test results saved successfully!");
      setEditingTrf(null);
      setEditFieldsByTest({});
      loadTrfList(true); // refresh list
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

  // Helper to get test names
  const getTestNames = (trf) => {
    if (trf.testNames) return trf.testNames;
    if (trf.selectedTests && trf.selectedTests[0]?.testName) {
      return trf.selectedTests.map((t) => t.testName);
    }
    return [];
  };

  // Render table content (loader inside card)
  const renderTableContent = () => {
    if (loadingList && !refreshing) {
      return (
        <div style={styles.loaderContainer}>
          <Spinner size={36} />
          <p style={{ marginTop: 16 }}>Loading requests...</p>
        </div>
      );
    }

    if (trfList.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <h3>No test request forms found</h3>
          <p>Please create a test request from the admin panel first.</p>
        </div>
      );
    }

    return (
      <>
        <div style={styles.statsBar}>
          <span>
            📊 Total forms: <strong>{trfList.length}</strong>
          </span>
          <button
            onClick={() => loadTrfList(true)}
            style={styles.refreshIconBtn}
            disabled={refreshing}
          >
            {refreshing ? <Spinner size={16} /> : "🔄 Refresh"}
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>TRF Code</th>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Request Name</th>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Tests</th>
                <th style={styles.th}>Last Updated</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trfList.map((trf) => {
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>📋 Fill Test Request Forms</h1>
        <p style={styles.subtitle}>
          Click <strong>Fill the Form</strong> to enter test values. Once saved,
          status changes to <strong>Filled</strong>.
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
    </div>
  );
};

// ========== Styles (with modal loader container) ==========
const styles = {
  container: {
    maxWidth: "1280px",
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
    background: "#ffffff",
  },
  statsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    background: "#fafcff",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "0.9rem",
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
  emptyState: {
    textAlign: "center",
    padding: "64px 24px",
    background: "#f8fafc",
    borderRadius: "24px",
  },
  emptyIcon: { fontSize: "4rem", marginBottom: "16px", opacity: 0.6 },
  // Modal styles with loader container inside
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
    maxHeight: "85vh",
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
};

// Add global hover style for table rows
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    .lm-table-row:hover {
      background-color: #f8fafc;
    }
  `;
  document.head.appendChild(style);
}

export default AllTestRequests;
