import axios from "axios";
import React, { useState, useEffect } from "react";

const generateUniqueId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

// Simple spinner component
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

// Inject keyframe animation globally
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

const TestRequestForm = () => {
  // ========== State ==========
  const [allTestingFields, setAllTestingFields] = useState({});
  const [companiesData, setCompaniesData] = useState([]);
  const [allLabs, setAllLabs] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Form fields
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [requestName, setRequestName] = useState("");
  const [selectedLabName, setSelectedLabName] = useState("");
  const [labCode, setLabCode] = useState("");
  const [labType, setLabType] = useState("");
  const [productName, setProductName] = useState("");
  const [lotNo, setLotNo] = useState("");
  const [sampleCode, setSampleCode] = useState("");
  const [remark, setRemark] = useState("");

  // Tests
  const [selectedTests, setSelectedTests] = useState([]);
  const [testData, setTestData] = useState({});

  // Editing & Table
  const [editingId, setEditingId] = useState(null);
  const [trfList, setTrfList] = useState([]);

  // ---------- LOADING STATES ----------
  const [loadingTests, setLoadingTests] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingTrfList, setLoadingTrfList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadingEditId, setLoadingEditId] = useState(null);

  // ========== Helper: build fields for a test ==========
  const buildInitialFields = (testName) => {
    const fieldsArray = allTestingFields[testName];
    if (!fieldsArray) return [];
    return fieldsArray.map((f) => ({
      id: `predefined-${f.id}-${f.name}`,
      fieldName: f.label,
      fieldValue: "",
      placeholder: f.placeholder,
      isPredefined: true,
      dbFieldId: f.id,
    }));
  };

  // ========== API calls ==========
  const handleGetAllTests = async () => {
    setLoadingTests(true);
    try {
      const response = await axios.get("http://80.225.246.52:5137/api/tests");
      if (response.data && response.data.TESTING_FIELDS) {
        setAllTestingFields(response.data.TESTING_FIELDS);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      alert("Failed to load test definitions");
    } finally {
      setLoadingTests(false);
    }
  };

  const handleGetAllCompany = async () => {
    setLoadingCompanies(true);
    try {
      const response = await axios.get(
        "http://80.225.246.52:5137/api/getCompanies",
      );
      if (response.data && response.data.allCompanies) {
        setCompaniesData(response.data.allCompanies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleGetLab = async () => {
    setLoadingLabs(true);
    try {
      const response = await axios.get("http://80.225.246.52:5137/api/labs");
      if (response.data && response.data.allLabs) {
        setAllLabs(response.data.allLabs);
      }
    } catch (error) {
      console.error("Error fetching labs:", error);
    } finally {
      setLoadingLabs(false);
    }
  };

  const handleGetProduct = async () => {
    setLoadingProducts(true);
    try {
      const response = await axios.get(
        "http://80.225.246.52:5137/api/products",
      );
      if (response.data && response.data.allProducts) {
        setAllProducts(response.data.allProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchTrfList = async () => {
    setLoadingTrfList(true);
    try {
      const response = await axios.get("http://80.225.246.52:5137/api/trf");
      setTrfList(response.data);
    } catch (error) {
      console.error("Error fetching TRF list:", error);
      alert("Failed to load TRF list");
    } finally {
      setLoadingTrfList(false);
    }
  };

  // ========== Auto‑fill helpers ==========
  useEffect(() => {
    const selected = companiesData.find(
      (c) => c.companyName === selectedCompanyName,
    );
    setCompanyCode(selected ? selected.companyCode : "");
  }, [selectedCompanyName, companiesData]);

  useEffect(() => {
    const selected = allLabs.find((l) => l.labName === selectedLabName);
    if (selected) {
      setLabCode(selected.labCode);
      setLabType(selected.labType);
    } else {
      setLabCode("");
      setLabType("");
    }
  }, [selectedLabName, allLabs]);

  useEffect(() => {
    const selectedProduct = allProducts.find(
      (p) => p.productName === productName,
    );
    setSampleCode(selectedProduct ? selectedProduct.productId : "");
  }, [productName, allProducts]);

  // ========== Test selection ==========
  const initializeTestData = (testName) => {
    if (!testData[testName]) {
      setTestData((prev) => ({
        ...prev,
        [testName]: { fields: buildInitialFields(testName) },
      }));
    }
  };

  useEffect(() => {
    selectedTests.forEach((testName) => {
      if (!testData[testName]) initializeTestData(testName);
    });
  }, [selectedTests]);

  const toggleTest = (testName) => {
    if (selectedTests.includes(testName)) {
      setSelectedTests(selectedTests.filter((t) => t !== testName));
    } else {
      setSelectedTests([...selectedTests, testName]);
      initializeTestData(testName);
    }
  };

  // ========== Custom field management ==========
  const addCustomField = (testName) => {
    const newField = {
      id: generateUniqueId(),
      fieldName: "",
      fieldValue: "",
      placeholder: "e.g., enter parameter name",
      isPredefined: false,
      dbFieldId: null,
    };
    setTestData((prev) => ({
      ...prev,
      [testName]: {
        ...prev[testName],
        fields: [...(prev[testName]?.fields || []), newField],
      },
    }));
  };

  const updateCustomFieldName = (testName, fieldId, value) => {
    setTestData((prev) => ({
      ...prev,
      [testName]: {
        ...prev[testName],
        fields: prev[testName].fields.map((f) =>
          f.id === fieldId && !f.isPredefined ? { ...f, fieldName: value } : f,
        ),
      },
    }));
  };

  const removeCustomField = (testName, fieldId) => {
    setTestData((prev) => ({
      ...prev,
      [testName]: {
        ...prev[testName],
        fields: prev[testName].fields.filter(
          (f) => f.id !== fieldId || f.isPredefined,
        ),
      },
    }));
  };

  // ========== Form reset & edit ==========
  const resetForm = () => {
    setSelectedCompanyName("");
    setCompanyCode("");
    setRequestName("");
    setSelectedLabName("");
    setLabCode("");
    setLabType("");
    setProductName("");
    setLotNo("");
    setSampleCode("");
    setSelectedTests([]);
    setTestData({});
    setRemark("");
    setEditingId(null);
  };

  const loadRequestForEdit = async (trf) => {
    setLoadingEditId(trf.id);
    try {
      const response = await axios.get(
        `http://80.225.246.52:5137/api/trf/${trf.id}`,
      );
      const data = response.data;

      setEditingId(trf.id);
      setSelectedCompanyName(
        companiesData.find((c) => c.id === data.companyId)?.companyName || "",
      );
      setCompanyCode(
        companiesData.find((c) => c.id === data.companyId)?.companyCode || "",
      );
      setRequestName(data.requestName);
      setSelectedLabName(
        allLabs.find((l) => l.id === data.labId)?.labName || "",
      );
      setLabCode(allLabs.find((l) => l.id === data.labId)?.labCode || "");
      setLabType(allLabs.find((l) => l.id === data.labId)?.labType || "");
      setProductName(
        allProducts.find((p) => p.id === data.productId)?.productName || "",
      );
      setSampleCode(
        allProducts.find((p) => p.id === data.productId)?.productId || "",
      );
      setLotNo(data.lotNo);
      setRemark(data.remark);

      const newSelectedTests = [];
      const newTestData = {};

      for (const test of data.selectedTests) {
        let testName = null;
        for (const [name, fields] of Object.entries(allTestingFields)) {
          if (fields[0]?.id === test.testId) {
            testName = name;
            break;
          }
        }
        if (!testName) testName = `Test_${test.testId}`;
        newSelectedTests.push(testName);

        const fieldsArray = test.fields.map((f, idx) => ({
          id: f.isPredefined ? `predefined-${f.fieldId}` : generateUniqueId(),
          fieldName: f.isPredefined
            ? f.label || "Predefined"
            : f.customLabel || "",
          fieldValue: "",
          placeholder: f.placeholder,
          isPredefined: f.isPredefined,
          dbFieldId: f.isPredefined ? f.fieldId : null,
        }));
        newTestData[testName] = { fields: fieldsArray };
      }

      setSelectedTests(newSelectedTests);
      setTestData(newTestData);
    } catch (error) {
      console.error("Error loading TRF for edit:", error);
      alert("Failed to load request details");
    } finally {
      setLoadingEditId(null);
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;
    setDeletingId(id);
    try {
      const response = await axios.delete(
        `http://80.225.246.52:5137/api/trf/${id}`,
      );
      if (response.data.success) {
        alert("TRF deleted successfully");
        await fetchTrfList();
        if (editingId === id) resetForm();
      } else {
        alert(response.data.error || "Delete failed");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.error || "Failed to delete TRF");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveRequest = async () => {
    if (
      !selectedCompanyName ||
      !selectedLabName ||
      !requestName ||
      !productName
    ) {
      alert(
        "Please fill required fields: Company, Lab Name, Request Name, Product Name",
      );
      return;
    }

    const companyObj = companiesData.find(
      (c) => c.companyName === selectedCompanyName,
    );
    const labObj = allLabs.find((l) => l.labName === selectedLabName);
    const productObj = allProducts.find((p) => p.productName === productName);

    if (!companyObj || !labObj || !productObj) {
      alert("Invalid selection. Please reselect.");
      return;
    }

    const selectedTestsPayload = selectedTests.map((testName) => {
      const fieldsArrayForTest = allTestingFields[testName];
      if (!fieldsArrayForTest) throw new Error(`Test ${testName} not found`);
      const testId = fieldsArrayForTest[0]?.id;
      if (!testId) throw new Error(`No testId found for ${testName}`);
      const userFields = testData[testName]?.fields || [];

      return {
        testId: testId,
        fields: userFields.map((f) => ({
          fieldId: f.isPredefined ? f.dbFieldId : null,
          customLabel: f.fieldName,
          placeholder: f.placeholder,
          isPredefined: f.isPredefined,
        })),
      };
    });

    const payload = {
      companyId: companyObj.id,
      requestName,
      labId: labObj.id,
      productId: productObj.id,
      lotNo,
      remark,
      createdBy: "admin@example.com",
      selectedTests: selectedTestsPayload,
    };

    setSaving(true);
    try {
      if (editingId) {
        await axios.put(
          `http://80.225.246.52:5137/api/trf/${editingId}`,
          payload,
        );
        alert("TRF updated successfully!");
      } else {
        const response = await axios.post(
          "http://80.225.246.52:5137/api/trf",
          payload,
        );
        if (response.data.success) {
          alert(`TRF created: ${response.data.trfCode}`);
        }
      }
      resetForm();
      await fetchTrfList();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Failed to save TRF");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => resetForm();

  // ========== Initial load ==========
  useEffect(() => {
    handleGetAllTests();
    handleGetAllCompany();
    handleGetLab();
    handleGetProduct();
    fetchTrfList();
  }, []);

  // ========== Render ==========
  return (
    <div style={styles.container}>
      <style>{`
        @keyframes trf-spin { to { transform: rotate(360deg); } }
        @keyframes trf-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .trf-skeleton {
          background: linear-gradient(90deg, #ebebeb 25%, #f5f5f5 50%, #ebebeb 75%);
          background-size: 600px 100%;
          animation: trf-shimmer 1.4s infinite linear;
        }
      `}</style>

      <h1 style={styles.mainTitle}>📋 Admin – Define Test Proform</h1>

      {/* Card 1: Company Details */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🏢 1. Company Details</h2>
        <div style={styles.row}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Company Name *</label>
            <select
              value={selectedCompanyName}
              onChange={(e) => setSelectedCompanyName(e.target.value)}
              style={styles.input}
              disabled={loadingCompanies}
            >
              <option value="">-- Select Company --</option>
              {companiesData.map((comp) => (
                <option key={comp.id} value={comp.companyName}>
                  {comp.companyName}
                </option>
              ))}
            </select>
            {loadingCompanies && <Spinner size={16} />}
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Code</label>
            <input
              type="text"
              value={companyCode}
              readOnly
              style={{ ...styles.input, backgroundColor: "#f5f5f5" }}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Request Name *</label>
            <input
              type="text"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>
      </div>

      {/* Card 2: Laboratory Information */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🔬 2. Laboratory Information</h2>
        <div style={styles.row}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Lab Name *</label>
            <select
              value={selectedLabName}
              onChange={(e) => setSelectedLabName(e.target.value)}
              style={styles.input}
              disabled={loadingLabs}
            >
              <option value="">-- Select Lab --</option>
              {allLabs.map((lab) => (
                <option key={lab.id} value={lab.labName}>
                  {lab.labName}
                </option>
              ))}
            </select>
            {loadingLabs && <Spinner size={16} />}
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Lab Code</label>
            <input
              type="text"
              value={labCode}
              readOnly
              style={{ ...styles.input, backgroundColor: "#f5f5f5" }}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Type</label>
            <input
              type="text"
              value={labType}
              readOnly
              style={{ ...styles.input, backgroundColor: "#f5f5f5" }}
            />
          </div>
        </div>
      </div>

      {/* Card 3: Product Details */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📦 3. Product Details</h2>
        <div style={styles.row}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Product Name *</label>
            <select
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              style={styles.input}
              disabled={loadingProducts}
            >
              <option value="">-- Select Product --</option>
              {allProducts.map((prod) => (
                <option key={prod.id} value={prod.productName}>
                  {prod.productName}
                </option>
              ))}
            </select>
            {loadingProducts && <Spinner size={16} />}
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Lot No.</label>
            <input
              type="text"
              value={lotNo}
              onChange={(e) => setLotNo(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Sample Code</label>
            <input
              type="text"
              value={sampleCode}
              readOnly
              style={{ ...styles.input, backgroundColor: "#f5f5f5" }}
            />
          </div>
        </div>
      </div>

      {/* Card 4: Define Test Proform */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          🧪 4. Define Test Proform (Structure only)
        </h2>
        {loadingTests ? (
          <div style={styles.loaderContainer}>
            <Spinner size={30} />
          </div>
        ) : (
          <>
            <div style={styles.testCheckboxGroup}>
              {Object.keys(allTestingFields).map((testKey) => (
                <label key={testKey} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedTests.includes(testKey)}
                    onChange={() => toggleTest(testKey)}
                  />
                  {testKey}
                </label>
              ))}
            </div>

            {selectedTests.map((testName) => (
              <div key={testName} style={styles.testSection}>
                <div style={styles.testHeader}>
                  <h3>🔬 {testName}</h3>
                  <button
                    onClick={() => addCustomField(testName)}
                    style={styles.addCustomBtn}
                  >
                    + Add Custom Field
                  </button>
                </div>
                <div style={styles.grid2Col}>
                  {testData[testName]?.fields?.map((field) => (
                    <div key={field.id} style={styles.fieldGroup}>
                      {field.isPredefined ? (
                        <label style={styles.label}>{field.fieldName}</label>
                      ) : (
                        <input
                          type="text"
                          placeholder="Parameter name (e.g., Viscosity Index)"
                          value={field.fieldName}
                          onChange={(e) =>
                            updateCustomFieldName(
                              testName,
                              field.id,
                              e.target.value,
                            )
                          }
                          style={{
                            ...styles.input,
                            marginBottom: "6px",
                            fontWeight: 500,
                          }}
                        />
                      )}
                      <div
                        style={{
                          ...styles.input,
                          backgroundColor: "#f9f9f9",
                          color: "#888",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span
                          style={{ fontSize: "0.8rem", fontStyle: "italic" }}
                        >
                          {field.placeholder || "(Value will be filled later)"}
                        </span>
                        {!field.isPredefined && (
                          <button
                            onClick={() =>
                              removeCustomField(testName, field.id)
                            }
                            style={styles.removeIconBtn}
                            title="Remove field"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {selectedTests.length === 0 && (
              <div style={styles.emptyTestsMsg}>
                ☑️ Select at least one test category.
              </div>
            )}
          </>
        )}
      </div>

      {/* Card 5: Remark */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📝 5. Remark / Purpose</h2>
        <textarea
          rows="3"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          style={{ ...styles.input, width: "100%" }}
        />
      </div>

      {/* ===== ACTION BAR ===== */}
      <div style={styles.actionBar}>
        <button
          onClick={handleSaveRequest}
          style={styles.primaryBtn}
          disabled={saving}
        >
          {saving && <Spinner size={18} color="#ffffff" />}
          {editingId ? "Update Request" : "Create Request"}
        </button>
        {editingId && (
          <button
            onClick={cancelEdit}
            style={styles.secondaryBtn}
            disabled={saving}
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* ========== ENHANCED TABLE UI ========== */}
      <div style={styles.tableWrapper}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>📋 Submitted Requests</h2>
          <span style={styles.tableCount}>{trfList.length} requests</span>
        </div>

        {loadingTrfList ? (
          <div style={styles.loaderContainer}>
            <Spinner size={36} />
          </div>
        ) : trfList.length === 0 ? (
          <div style={styles.emptyTable}>
            <div style={styles.emptyIcon}>📭</div>
            <p>No requests created yet.</p>
            <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Fill the form above and click "Create Request"
            </p>
          </div>
        ) : (
          <div style={styles.tableResponsive}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: "10px" }}>ID</th>
                  <th>Company</th>
                  <th>Request Name</th>
                  <th>Lab Name</th>
                  <th>Product</th>
                  <th>Tests</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trfList.map((trf) => {
                  const company = companiesData.find(
                    (c) => c.id === trf.companyId,
                  );
                  const product = allProducts.find(
                    (p) => p.id === trf.productId,
                  );
                  const testNames = trf.selectedTests.map((t) => {
                    const entry = Object.entries(allTestingFields).find(
                      ([, fields]) => fields[0]?.id === t.testId,
                    );
                    return entry ? entry[0] : `Test_${t.testId}`;
                  });
                  const isDeleting = deletingId === trf.id;
                  const isLoadingEdit = loadingEditId === trf.id;

                  return (
                    <tr key={trf.id}>
                      <td style={{ paddingLeft: "10px" }} data-label="ID">
                        <code style={styles.badgeCode}>{trf.trfCode}</code>
                      </td>
                      <td data-label="Company">{trf.companyName}</td>
                      <td data-label="Request Name">{trf.requestName}</td>
                      <td data-label="Lab Name">{trf.labName}</td>
                      <td data-label="Product">{trf.productName}</td>
                      <td data-label="Tests">
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
                      <td data-label="Actions" style={styles.actionsCell}>
                        <button
                          onClick={() => loadRequestForEdit(trf)}
                          style={styles.iconBtnEdit}
                          disabled={isLoadingEdit || isDeleting}
                          title="Edit request"
                        >
                          {isLoadingEdit ? <Spinner size={16} /> : "✏️ Edit"}
                        </button>
                        <button
                          onClick={() => deleteRequest(trf.id)}
                          style={styles.iconBtnDelete}
                          disabled={isDeleting || isLoadingEdit}
                          title="Delete request"
                        >
                          {isDeleting ? <Spinner size={16} /> : "🗑️ Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== Enhanced Styles (Modern Table) ==========
const styles = {
  container: {
    maxWidth: "95vw",
    margin: "0 auto",
    padding: "40px 24px",
    background: "#ffffff",
    color: "#1e293b",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  mainTitle: {
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "32px",
    letterSpacing: "-0.3px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "24px 28px",
    marginBottom: "28px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "20px",
    paddingBottom: "8px",
    borderBottom: "2px solid #f1f5f9",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    alignItems: "flex-end",
  },
  fieldGroup: { flex: "1 1 200px", minWidth: "180px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "500",
    fontSize: "0.8rem",
    color: "#475569",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    fontSize: "0.9rem",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    outline: "none",
    transition: "0.2s",
    boxSizing: "border-box",
  },
  testCheckboxGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "28px",
    padding: "12px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    background: "#f8fafc",
    padding: "6px 16px",
    borderRadius: "40px",
    border: "1px solid #e2e8f0",
  },
  testSection: {
    background: "#fefefe",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "18px 22px",
    marginBottom: "24px",
  },
  testHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  addCustomBtn: {
    background: "#ffffff",
    border: "1px solid #1e293b",
    borderRadius: "40px",
    padding: "6px 16px",
    fontSize: "0.75rem",
    fontWeight: "500",
    cursor: "pointer",
    color: "#1e293b",
  },
  grid2Col: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  removeIconBtn: {
    background: "none",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    color: "#dc2626",
    padding: "0 0 0 8px",
  },
  emptyTestsMsg: {
    textAlign: "center",
    color: "#64748b",
    padding: "28px 12px",
    fontStyle: "italic",
  },
  actionBar: {
    display: "flex",
    gap: "16px",
    justifyContent: "flex-end",
    margin: "16px 0 32px 0",
  },
  primaryBtn: {
    background: "#0f172a",
    color: "#ffffff",
    border: "none",
    padding: "10px 24px",
    borderRadius: "40px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  secondaryBtn: {
    background: "#ffffff",
    color: "#0f172a",
    border: "1px solid #cbd5e1",
    padding: "10px 24px",
    borderRadius: "40px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  // Enhanced Table Styles
  tableWrapper: {
    marginTop: "32px",
    background: "#ffffff",
    borderRadius: "5px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
    background: "#fafcff",
  },
  tableTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    margin: 0,
  },
  tableCount: {
    fontSize: "0.85rem",
    color: "#64748b",
    background: "#f1f5f9",
    padding: "4px 12px",
    borderRadius: "30px",
  },
  tableResponsive: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.85rem",
    minWidth: "680px",
  },
  badgeCode: {
    background: "#f1f5f9",
    padding: "4px 8px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "500",
    fontFamily: "monospace",
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
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
  actionsCell: {
    whiteSpace: "nowrap",
  },
  iconBtnEdit: {
    background: "transparent",
    border: "1px solid #cbd5e1",
    borderRadius: "30px",
    padding: "6px 14px",
    marginRight: "8px",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s",
  },
  iconBtnDelete: {
    background: "transparent",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: "30px",
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s",
  },
  loaderContainer: {
    textAlign: "center",
    padding: "48px 20px",
  },
  emptyTable: {
    textAlign: "center",
    padding: "48px 20px",
    background: "#fafcff",
    color: "#64748b",
  },
  emptyIcon: {
    fontSize: "3rem",
    marginBottom: "12px",
    opacity: 0.5,
  },
};

// Add global table hover styles
if (typeof document !== "undefined") {
  const tableHoverStyle = document.createElement("style");
  tableHoverStyle.textContent = `
    .lm-table tbody tr:hover {
      background-color: #f8fafc;
    }
    .lm-table th, .lm-table td {
      padding: 14px 16px;
      text-align: left;
      vertical-align: middle;
      border-bottom: 1px solid #e2e8f0;
    }
    .lm-table th {
      background-color: #f8fafc;
      font-weight: 600;
      color: #1e293b;
    }
  `;
  document.head.appendChild(tableHoverStyle);
}

export default TestRequestForm;
