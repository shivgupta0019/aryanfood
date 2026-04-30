import React, { useState, useEffect } from "react";
import axios from "axios";
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

// ========== View Modal (read-only) with loader inside ==========
const ViewModal = ({ trf, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/trf/user/${trf.id}`)
      .then((res) => setDetails(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [trf.id]);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>📄 Test Request Report</h2>
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
                    <strong>TRF Code:</strong> {details.trf.trfCode}
                  </div>
                  <div>
                    <strong>Company:</strong> {details.trf.companyName}
                  </div>
                  <div>
                    <strong>Request:</strong> {details.trf.requestName}
                  </div>
                  <div>
                    <strong>Lab:</strong> {details.trf.labName} (
                    {details.trf.labType})
                  </div>
                  <div>
                    <strong>Product:</strong> {details.trf.productName}
                  </div>
                  <div>
                    <strong>Lot No.:</strong> {details.trf.lotNo || "—"}
                  </div>
                </div>
              </div>
              {details.fieldsByTest &&
                Object.entries(details.fieldsByTest).map(
                  ([testName, fields]) => (
                    <div key={testName} style={styles.testResultBlock}>
                      <h4>🔬 {testName} Analysis</h4>
                      <div style={styles.predefinedGrid}>
                        {fields.map((field) => (
                          <div
                            key={field.fieldRowId}
                            style={styles.predefinedItem}
                          >
                            <span>{field.label}</span>
                            <span>{field.currentValue || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              {details.trf.remark && (
                <div style={styles.modalSection}>
                  <h3>📝 Remark</h3>
                  <div style={styles.remarkBox}>{details.trf.remark}</div>
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

// ========== Edit Modal – loader inside the card ==========
const EditModal = ({
  trf,
  testData,
  onUpdateField,
  onAddCustomField,
  onSave,
  onCancel,
  saving,
  loading, // true while fetching initial data
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
                    <div style={styles.addCustomSection}>
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
                    </div>
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
  const [loadingList, setLoadingList] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTrf, setSelectedTrf] = useState(null);
  const [editingTrf, setEditingTrf] = useState(null);
  const [editTestData, setEditTestData] = useState(null);
  const [testNameToIdMap, setTestNameToIdMap] = useState({});
  const [saving, setSaving] = useState(false);
  const [editLoading, setEditLoading] = useState(false); // loader inside modal

  // Fetch test name → testId mapping
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
      const response = await api.get(`/trf/filled`);
      setTrfList(response.data);
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

  // Start edit – open modal immediately with loader
  const startEdit = async (trf) => {
    setEditingTrf(trf); // open modal
    setEditLoading(true); // show loader inside modal
    setEditTestData(null); // clear previous data
    try {
      const res = await api.get(`/trf/user/${trf.id}`);
      const { trf: trfInfo, fieldsByTest } = res.data;
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

  // Table content renderer
  const renderTableContent = () => {
    if (loadingList && !refreshing) {
      return (
        <div style={styles.loaderContainer}>
          <Spinner size={36} />
          <p>Loading reports...</p>
        </div>
      );
    }
    if (trfList.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📭</div>
          <h3>No filled test requests yet</h3>
          <p>Once users fill test values, they will appear here.</p>
        </div>
      );
    }
    return (
      <>
        <div style={styles.statsBar}>
          <span>
            ✅ Total filled forms: <strong>{trfList.length}</strong>
          </span>
          <button
            onClick={() => loadTrfs(true)}
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
                      <span style={styles.filledBadge}>✅ Filled</span>
                    </td>
                    <td style={styles.td}>
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
        <h1 style={styles.mainTitle}>📊 Filled Test Requests Reports</h1>
        <p style={styles.subtitle}>
          You can edit values, add custom fields with values, and save.
        </p>
      </div>
      <div style={styles.tableWrapper}>{renderTableContent()}</div>

      {selectedTrf && (
        <ViewModal trf={selectedTrf} onClose={() => setSelectedTrf(null)} />
      )}

      {/* Edit modal – renders immediately when editingTrf exists, shows loader inside */}
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
    </div>
  );
};

// ========== Modern, Clean Styles ==========
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
};

// Add global hover style for table rows
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `.lm-table-row:hover { background-color: #f8fafc; }`;
  document.head.appendChild(style);
}

export default AllReports;
