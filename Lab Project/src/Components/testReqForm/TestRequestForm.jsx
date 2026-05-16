import api from "../../api/axiosConfig";
import React, { useState, useEffect, useMemo, useRef } from "react";

const generateUniqueId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;

// Spinner component (same as before)
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

if (typeof document !== "undefined") {
  const style = document.createElement("style");
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
    .trf-table th {
      cursor: pointer;
      user-select: none;
      transition: background-color 0.2s;
    }
    .trf-table th:hover {
      background-color: #f1f5f9 !important;
    }
  `;
  document.head.appendChild(style);
}

const TestRequestForm = () => {
  const [allTestingFields, setAllTestingFields] = useState({});
  const [companiesData, setCompaniesData] = useState([]);
  const [allLabs, setAllLabs] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

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

  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedTests1, setSelectedTests1] = useState([]);
  const [testData, setTestData] = useState({});

  const [editingId, setEditingId] = useState(null);
  const [trfList, setTrfList] = useState([]);

  const [loadingTests, setLoadingTests] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingTrfList, setLoadingTrfList] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loadingEditId, setLoadingEditId] = useState(null);

  const [companySearch, setCompanySearch] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [labSearch, setLabSearch] = useState("");
  const [showLabDropdown, setShowLabDropdown] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const [tableSearch, setTableSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Ref to prevent auto-loading product tests during edit
  const skipProductLoadRef = useRef(false);

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

  const loadProductTests = (product) => {
    if (!product || !product.testRanges || product.testRanges.length === 0) {
      setSelectedTests([]);
      setTestData({});
      return;
    }

    const newSelectedTests = [];
    const newTestData = {};

    product.testRanges.forEach((tr) => {
      const testName = tr.testName;
      newSelectedTests.push(testName);
      const fields = [];
      tr.fields.forEach((fieldDef) => {
        if (fieldDef.isCustom) {
          fields.push({
            id: generateUniqueId(),
            fieldName: fieldDef.fieldName || fieldDef.customLabel,
            fieldValue: "",
            placeholder: fieldDef.label || "Enter value",
            isPredefined: false,
            dbFieldId: null,
          });
        } else {
          const testFields = allTestingFields[testName];
          const matchedField = testFields?.find(
            (tf) => tf.name === fieldDef.fieldName,
          );
          if (matchedField) {
            fields.push({
              id: `predefined-${matchedField.id}-${matchedField.name}`,
              fieldName: matchedField.label,
              fieldValue: "",
              placeholder: matchedField.placeholder || "Enter value",
              isPredefined: true,
              dbFieldId: matchedField.id,
            });
          } else {
            fields.push({
              id: generateUniqueId(),
              fieldName: fieldDef.fieldName,
              fieldValue: "",
              placeholder: fieldDef.label || "Enter value",
              isPredefined: false,
              dbFieldId: null,
            });
          }
        }
      });
      newTestData[testName] = { fields };
    });

    setSelectedTests(newSelectedTests);
    setSelectedTests1(newSelectedTests);
    setTestData(newTestData);
  };

  // Auto-load product tests only when productName changes from user selection (not during edit)
  useEffect(() => {
    if (!productName) {
      if (!skipProductLoadRef.current) {
        setSelectedTests([]);
        setTestData({});
      }
      return;
    }
    const selectedProduct = allProducts.find(
      (p) => p.productName === productName,
    );
    if (
      selectedProduct &&
      Object.keys(allTestingFields).length > 0 &&
      !skipProductLoadRef.current
    ) {
      loadProductTests(selectedProduct);
    } else if (selectedProduct && skipProductLoadRef.current) {
      // During edit, do nothing – the edit data is already loaded
    }
  }, [productName, allProducts, allTestingFields]);

  // Filter functions
  const filteredCompanies = companySearch
    ? companiesData.filter((comp) =>
        comp.companyName.toLowerCase().includes(companySearch.toLowerCase()),
      )
    : companiesData;

  const filteredLabs = labSearch
    ? allLabs.filter((lab) =>
        lab.labName.toLowerCase().includes(labSearch.toLowerCase()),
      )
    : allLabs;

  const filteredProducts = productSearch
    ? allProducts.filter((prod) =>
        prod.productName.toLowerCase().includes(productSearch.toLowerCase()),
      )
    : allProducts;

  // API calls
  const handleGetAllTests = async () => {
    setLoadingTests(true);
    try {
      const response = await api.get("/tests");
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
      const response = await api.get("/getCompanies");
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
      const response = await api.get("/labs");
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
      const response = await api.get("/products");
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
      const response = await api.get("/trf");
      setTrfList(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching TRF list:", error);
      alert("Failed to load TRF list");
    } finally {
      setLoadingTrfList(false);
    }
  };

  // Auto-fill helpers
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

  // Initialize missing test data (only for newly selected tests, not during edit)
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

  // Close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-dropdown="company"]'))
        setShowCompanyDropdown(false);
      if (!e.target.closest('[data-dropdown="lab"]')) setShowLabDropdown(false);
      if (!e.target.closest('[data-dropdown="product"]'))
        setShowProductDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleTest = (testName) => {
    if (selectedTests.includes(testName)) {
      setSelectedTests(selectedTests.filter((t) => t !== testName));
    } else {
      setSelectedTests([...selectedTests, testName]);
      initializeTestData(testName);
    }
  };

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

  // FIXED: loadRequestForEdit with skip flag to prevent product test reload
  const loadRequestForEdit = async (trf) => {
    setLoadingEditId(trf.id);
    skipProductLoadRef.current = true; // Prevent product load effect from overwriting
    try {
      const response = await api.get(`/trf/${trf.id}`);
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

        const fieldsArray = test.fields.map((f) => ({
          id: f.isPredefined
            ? `predefined-${f.fieldId}-${Date.now()}-${Math.random()}`
            : generateUniqueId(),
          fieldName: f.isPredefined
            ? f.label || "Predefined"
            : f.customLabel || "",
          fieldValue: "",
          placeholder: f.placeholder || "Enter value",
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
      // Reset the skip flag after a short delay to allow state updates to settle
      setTimeout(() => {
        skipProductLoadRef.current = false;
      }, 500);
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;
    setDeletingId(id);
    try {
      const response = await api.delete(`/trf/${id}`);
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
        await api.put(`/trf/${editingId}`, payload);
        alert("TRF updated successfully!");
      } else {
        const response = await api.post("/trf", payload);
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

  // Table logic (same as before)
  const getTestNamesList = (trf) => {
    const testNames = trf.selectedTests.map((t) => {
      const entry = Object.entries(allTestingFields).find(
        ([, fields]) => fields[0]?.id === t.testId,
      );
      return entry ? entry[0] : `Test_${t.testId}`;
    });
    return testNames.join(" ");
  };

  const getTestNamesForDisplay = (trf) => {
    const testNames = trf.selectedTests.map((t) => {
      const entry = Object.entries(allTestingFields).find(
        ([, fields]) => fields[0]?.id === t.testId,
      );
      return entry ? entry[0] : `Test_${t.testId}`;
    });
    return testNames;
  };

  const filterTableData = (data) => {
    if (!tableSearch) return data;
    const searchLower = tableSearch.toLowerCase();
    return data.filter((item) => {
      return (
        item.trfCode?.toLowerCase().includes(searchLower) ||
        item.companyName?.toLowerCase().includes(searchLower) ||
        item.requestName?.toLowerCase().includes(searchLower) ||
        item.labName?.toLowerCase().includes(searchLower) ||
        item.productName?.toLowerCase().includes(searchLower) ||
        getTestNamesList(item).toLowerCase().includes(searchLower)
      );
    });
  };

  const sortTableData = (data, field, direction) => {
    if (!field) return data;
    return [...data].sort((a, b) => {
      let valA, valB;
      if (field === "tests") {
        valA = getTestNamesList(a);
        valB = getTestNamesList(b);
      } else if (field === "trfCode") {
        valA = a.trfCode || "";
        valB = b.trfCode || "";
      } else if (field === "companyName") {
        valA = a.companyName || "";
        valB = b.companyName || "";
      } else if (field === "requestName") {
        valA = a.requestName || "";
        valB = b.requestName || "";
      } else if (field === "labName") {
        valA = a.labName || "";
        valB = b.labName || "";
      } else if (field === "productName") {
        valA = a.productName || "";
        valB = b.productName || "";
      } else {
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

  const processedTableData = useMemo(() => {
    if (!trfList.length) return { data: [], total: 0 };
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
    const totalPages = Math.ceil(processedTableData.total / itemsPerPage);
    const startItem =
      processedTableData.total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(
      currentPage * itemsPerPage,
      processedTableData.total,
    );

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
          Showing {startItem} to {endItem} of {processedTableData.total} entries
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

  useEffect(() => {
    handleGetAllTests();
    handleGetAllCompany();
    handleGetLab();
    handleGetProduct();
    fetchTrfList();
  }, []);

  // JSX Rendering (same as provided, but ensure no duplicate fields)
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
            <div style={{ position: "relative" }} data-dropdown="company">
              <input
                type="text"
                placeholder="Search or select company..."
                value={
                  companySearch !== ""
                    ? companySearch
                    : showCompanyDropdown
                      ? ""
                      : selectedCompanyName
                }
                onChange={(e) => {
                  setCompanySearch(e.target.value);
                  setShowCompanyDropdown(true);
                }}
                onFocus={() => setShowCompanyDropdown(true)}
                style={styles.input}
                disabled={loadingCompanies}
              />
              {showCompanyDropdown && (
                <div style={dropdownStyles}>
                  <div
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      backgroundColor: "#f9f9f9",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => {
                      setSelectedCompanyName("");
                      setCompanySearch("");
                      setShowCompanyDropdown(false);
                    }}
                  >
                    -- Clear --
                  </div>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((comp) => (
                      <div
                        key={comp.id}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                          backgroundColor:
                            selectedCompanyName === comp.companyName
                              ? "#e3f2fd"
                              : "#fff",
                        }}
                        onClick={() => {
                          setSelectedCompanyName(comp.companyName);
                          setCompanySearch("");
                          setShowCompanyDropdown(false);
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            selectedCompanyName === comp.companyName
                              ? "#e3f2fd"
                              : "#fff")
                        }
                      >
                        {comp.companyName}
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        padding: "10px",
                        color: "#999",
                        textAlign: "center",
                      }}
                    >
                      No companies found
                    </div>
                  )}
                </div>
              )}
            </div>
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
            <div style={{ position: "relative" }} data-dropdown="lab">
              <input
                type="text"
                placeholder="Search or select lab..."
                value={
                  labSearch !== ""
                    ? labSearch
                    : showLabDropdown
                      ? ""
                      : selectedLabName
                }
                onChange={(e) => {
                  setLabSearch(e.target.value);
                  setShowLabDropdown(true);
                }}
                onFocus={() => setShowLabDropdown(true)}
                style={styles.input}
                disabled={loadingLabs}
              />
              {showLabDropdown && (
                <div style={dropdownStyles}>
                  <div
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      backgroundColor: "#f9f9f9",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => {
                      setSelectedLabName("");
                      setLabSearch("");
                      setShowLabDropdown(false);
                    }}
                  >
                    -- Clear --
                  </div>
                  {filteredLabs.length > 0 ? (
                    filteredLabs.map((lab) => (
                      <div
                        key={lab.id}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                          backgroundColor:
                            selectedLabName === lab.labName
                              ? "#e3f2fd"
                              : "#fff",
                        }}
                        onClick={() => {
                          setSelectedLabName(lab.labName);
                          setLabSearch("");
                          setShowLabDropdown(false);
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            selectedLabName === lab.labName
                              ? "#e3f2fd"
                              : "#fff")
                        }
                      >
                        {lab.labName}
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        padding: "10px",
                        color: "#999",
                        textAlign: "center",
                      }}
                    >
                      No labs found
                    </div>
                  )}
                </div>
              )}
            </div>
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
            <div style={{ position: "relative" }} data-dropdown="product">
              <input
                type="text"
                placeholder="Search or select product..."
                value={productSearch !== "" ? productSearch : productName}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setShowProductDropdown(true);
                }}
                onFocus={() => setShowProductDropdown(true)}
                style={styles.input}
                disabled={loadingProducts}
              />
              {showProductDropdown && (
                <div style={dropdownStyles}>
                  <div
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      backgroundColor: "#f9f9f9",
                      borderBottom: "1px solid #eee",
                    }}
                    onClick={() => {
                      setProductName("");
                      setProductSearch("");
                      setShowProductDropdown(false);
                    }}
                  >
                    -- Clear --
                  </div>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                          borderBottom: "1px solid #eee",
                          backgroundColor:
                            productName === prod.productName
                              ? "#e3f2fd"
                              : "#fff",
                        }}
                        onClick={() => {
                          setProductName(prod.productName);
                          setProductSearch("");
                          setShowProductDropdown(false);
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            productName === prod.productName
                              ? "#e3f2fd"
                              : "#fff")
                        }
                      >
                        {prod.productName}
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        padding: "10px",
                        color: "#999",
                        textAlign: "center",
                      }}
                    >
                      No products found
                    </div>
                  )}
                </div>
              )}
            </div>
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
            <label style={styles.label}>Product Code</label>
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
        <h2 style={styles.cardTitle}>🧪 4. Define Test Proform</h2>
        {loadingTests ? (
          <div style={styles.loaderContainer}>
            <Spinner size={30} />
          </div>
        ) : (
          <>
            <div style={styles.testCheckboxGroup}>
              {Object.keys(allTestingFields).map((testKey) => {
                return selectedTests1?.includes(testKey) ? (
                  <label key={testKey} style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(testKey)}
                      onChange={() => toggleTest(testKey)}
                    />
                    {testKey}
                  </label>
                ) : null;
              })}
            </div>

            {selectedTests.map((testName) => (
              <div key={testName} style={styles.testSection}>
                <div style={styles.testHeader}>
                  <h3>🔬 {testName}</h3>
                  {/* <button
                    onClick={() => addCustomField(testName)}
                    style={styles.addCustomBtn}
                  >
                    + Add Custom Field
                  </button> */}
                </div>
                <div style={styles.grid2Col}>
                  {testData[testName]?.fields?.map((field) => (
                    <div key={field.id} style={styles.fieldGroup}>
                      {<label style={styles.label}>{field.fieldName}</label>}
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {selectedTests.length === 0 && (
              <div style={styles.emptyTestsMsg}>
                ☑️ Please select Product.
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

      {/* Action Bar */}
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

      {/* Table */}
      <div style={styles.tableWrapper}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>📋 Submitted Requests</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={styles.tableCount}>{trfList.length} requests</span>
            <input
              type="text"
              placeholder="🔍 Search requests..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              style={styles.tableSearchInput}
            />
          </div>
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
          <>
            <div style={styles.tableResponsive}>
              <table className="trf-table" style={styles.table}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort("trfCode")}>
                      ID <SortIndicator field="trfCode" />
                    </th>
                    <th onClick={() => handleSort("companyName")}>
                      Company <SortIndicator field="companyName" />
                    </th>
                    <th onClick={() => handleSort("requestName")}>
                      Request Name <SortIndicator field="requestName" />
                    </th>
                    <th onClick={() => handleSort("labName")}>
                      Lab Name <SortIndicator field="labName" />
                    </th>
                    <th onClick={() => handleSort("productName")}>
                      Product <SortIndicator field="productName" />
                    </th>
                    <th onClick={() => handleSort("tests")}>
                      Tests <SortIndicator field="tests" />
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {processedTableData.data.map((trf) => {
                    const testNames = getTestNamesForDisplay(trf);
                    const isDeleting = deletingId === trf.id;
                    const isLoadingEdit = loadingEditId === trf.id;
                    return (
                      <tr key={trf.id}>
                        <td data-label="ID" style={{ paddingLeft: "10px" }}>
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
                  {processedTableData.data.length === 0 && (
                    <tr>
                      <td
                        colSpan="7"
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
        )}
      </div>
    </div>
  );
};

const dropdownStyles = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderTop: "none",
  maxHeight: "200px",
  overflowY: "auto",
  zIndex: 10,
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

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
  tableWrapper: {
    marginTop: "32px",
    background: "#ffffff",
    borderRadius: "16px",
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
    flexWrap: "wrap",
    gap: "16px",
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
  tableSearchInput: {
    padding: "8px 16px",
    border: "1px solid #cbd5e1",
    borderRadius: "40px",
    fontSize: "0.85rem",
    width: "240px",
    outline: "none",
    fontFamily: "inherit",
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
};

if (typeof document !== "undefined") {
  const tableHoverStyle = document.createElement("style");
  tableHoverStyle.textContent = `
    .trf-table th, .trf-table td {
      padding: 14px 16px;
      text-align: left;
      vertical-align: middle;
      border-bottom: 1px solid #e2e8f0;
    }
    .trf-table th {
      background-color: #f8fafc;
      font-weight: 600;
      color: #1e293b;
    }
    .trf-table tbody tr:hover {
      background-color: #f8fafc;
    }
    .trf-table th:hover {
      background-color: #f1f5f9 !important;
    }
  `;
  document.head.appendChild(tableHoverStyle);
}

export default TestRequestForm;
