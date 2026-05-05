import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { MdAddToPhotos } from "react-icons/md";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: #ffffff;
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, sans-serif;
  }

  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap');

  /* Loader Styles */
  .lm-loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }

  .lm-loader {
    width: 24px;
    height: 24px;
    border: 3px solid #e2e8f0;
    border-top: 3px solid #000000;
    border-radius: 50%;
    animation: lm-spin 0.8s linear infinite;
  }

  .lm-loader-sm {
    width: 14px;
    height: 14px;
    border-width: 2px;
  }

  .lm-loader-inline {
    display: inline-block;
    margin-left: 8px;
    vertical-align: middle;
  }

  @keyframes lm-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .lm-app {
    min-height: 100vh;
    background: #ffffff;
  }

  .lm-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem 2rem 3rem;
  }

  .lm-header {
    margin-bottom: 2.5rem;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 1.5rem;
  }

  .lm-title {
    font-size: 1.8rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #0f172a;
    margin-bottom: 0.25rem;
  }

  .lm-subtitle {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 400;
  }

  .lm-tabs {
    display: flex;
    gap: 0.5rem;
    border-bottom: 1px solid #f1f5f9;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .lm-tab {
    background: transparent;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    font-family: inherit;
  }

  .lm-tab:hover {
    color: #0f172a;
  }

  .lm-tab.active {
    color: #0f172a;
    font-weight: 600;
  }

  .lm-tab.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #000000;
    border-radius: 2px 2px 0 0;
  }

  .lm-panel {
    animation: fadeIn 0.25s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .lm-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .lm-full-width {
    grid-column: span 2;
  }

  .lm-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .lm-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #475569;
  }

  .lm-input,
  .lm-select,
  .lm-textarea {
    width: 100%;
    padding: 0.85rem 1rem;
    font-size: 0.95rem;
    font-family: inherit;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.2s;
    outline: none;
    color: #0f172a;
  }

  .lm-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .lm-input:focus,
  .lm-select:focus,
  .lm-textarea:focus {
    border-color: #000000;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  .lm-input::placeholder,
  .lm-textarea::placeholder {
    color: #94a3b8;
  }

  .lm-check-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  .lm-checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    padding: 0.5rem 0;
  }

  .lm-checkbox-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #000000;
  }

  .lm-checkbox-item label {
    font-size: 0.95rem;
    color: #0f172a;
    cursor: pointer;
  }

  .lm-new-test {
    background: #f8fafc;
    border-radius: 20px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    border: 1px solid #f1f5f9;
  }

  .lm-new-test-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 1rem;
  }

  .lm-row {
    display: flex;
    gap: 1rem;
    align-items: flex-end;
    margin-bottom: 1rem;
  }

  .lm-row .lm-field {
    flex: 1;
  }

  .lm-btn-small {
    background: #000000;
    border: none;
    padding: 0.7rem 1.2rem;
    border-radius: 40px;
    font-weight: 500;
    font-size: 0.8rem;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .lm-btn-small:hover:not(:disabled) {
    background: #1e293b;
  }

  .lm-btn-small:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .lm-btn-outline {
    background: transparent;
    border: 1px solid #e2e8f0;
    padding: 0.5rem 1rem;
    border-radius: 40px;
    font-weight: 500;
    font-size: 0.75rem;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lm-btn-outline:hover:not(:disabled) {
    border-color: #000000;
    background: #f8fafc;
  }

  .lm-btn-outline:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .lm-dynamic-field-row {
    display: flex;
    gap: 0.75rem;
    align-items: flex-end;
    margin-bottom: 0.75rem;
  }

  .lm-dynamic-field-row .lm-field {
    flex: 1;
    margin-bottom: 0;
  }

  .lm-test-section {
    margin-top: 2rem;
    border-top: 1px solid #f1f5f9;
    padding-top: 1.5rem;
  }

  .lm-test-heading {
    font-size: 1.1rem;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .lm-test-fields {
    background: #ffffff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    padding: 1.2rem;
    margin-bottom: 1.5rem;
  }

  .lm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f1f5f9;
  }

  .lm-btn-secondary {
    background: transparent;
    border: 1px solid #e2e8f0;
    padding: 0.7rem 1.5rem;
    border-radius: 40px;
    font-weight: 500;
    font-size: 0.85rem;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }

  .lm-btn-secondary:hover:not(:disabled) {
    border-color: #000000;
    background: #f8fafc;
  }

  .lm-btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .lm-btn-primary {
    background: #000000;
    border: none;
    padding: 0.7rem 1.8rem;
    border-radius: 40px;
    font-weight: 500;
    font-size: 0.85rem;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .lm-btn-primary:hover:not(:disabled) {
    background: #1e293b;
    transform: scale(0.98);
  }

  .lm-btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .lm-info-card {
    background: #f8fafc;
    border-radius: 16px;
    padding: 1rem 1.2rem;
    margin-top: 1.5rem;
    border: 1px solid #f1f5f9;
    font-size: 0.85rem;
    color: #475569;
  }

  .lm-badge {
    display: inline-block;
    background: #0000000c;
    padding: 0.2rem 0.7rem;
    border-radius: 30px;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.3px;
    color: #000000;
    margin-left: 0.5rem;
  }

  .lm-table-wrapper {
    overflow-x: auto;
    border-radius: 16px;
    border: 1px solid #f1f5f9;
    background: #ffffff;
    margin-top: 1.5rem;
  }

  .lm-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    min-width: 600px;
  }

  .lm-table th {
    text-align: left;
    padding: 1rem;
    background-color: #f8fafc;
    font-weight: 600;
    color: #0f172a;
    border-bottom: 1px solid #e2e8f0;
  }

  .lm-table td {
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    vertical-align: top;
  }

  .lm-table tr:last-child td {
    border-bottom: none;
  }

  .lm-table tbody tr:hover {
    background-color: #fafcff;
  }

  .lm-test-fields-preview {
    margin: 0;
    padding-left: 1rem;
  }

  .lm-editable-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-family: inherit;
    font-size: 0.85rem;
  }

  .lm-editable-select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    font-family: inherit;
    font-size: 0.85rem;
  }

  .lm-action-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .lm-icon-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0.3rem 0.5rem;
    border-radius: 8px;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .lm-icon-btn:hover:not(:disabled) {
    background: #f1f5f9;
  }

  .lm-icon-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Modal Styles */
  .lm-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .lm-modal {
    background: white;
    border-radius: 20px;
    width: 90%;
    max-width: 1250px;
    height: 95%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 30px rgba(0,0,0,0.2);
  }
  .lm-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
  }
  .lm-modal-header h3 {
    margin: 0;
    font-size: 1.1rem;
  }
  .lm-modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #64748b;
  }
  .lm-modal-close:hover {
    color: #000;
  }
  .lm-modal-body {
    flex: 1;
    padding: 1rem;
    overflow: auto;
  }
  .lm-iframe-pdf {
    width: 100%;
    height: 100%;
    border: none;
  }

  @media (max-width: 720px) {
    .lm-container {
      padding: 1.5rem;
    }
    .lm-form-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .lm-full-width {
      grid-column: span 1;
    }
    .lm-tab {
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
    }
    .lm-title {
      font-size: 1.4rem;
    }
    .lm-row, .lm-dynamic-field-row {
      flex-direction: column;
      align-items: stretch;
    }
    .lm-btn-small {
      align-self: flex-start;
    }
    .lm-table th,
    .lm-table td {
      padding: 0.75rem;
    }
  }
`;

// Helper to generate unique codes
const generateCode = (prefix = "ARY") => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${datePart}-${random}`;
};

function convertToIST(utcDateString) {
  if (!utcDateString) return "";
  const date = new Date(utcDateString);
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formatter = new Intl.DateTimeFormat("en-IN", options);
  const parts = formatter.formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")} ${get("dayPeriod")}`;
}

const CircularLoader = ({ size = "md", inline = false }) => {
  const sizeClass = size === "sm" ? "lm-loader-sm" : "";
  return (
    <div
      className={`lm-loader ${sizeClass} ${inline ? "lm-loader-inline" : ""}`}
    />
  );
};

export default function LabManagement() {
  const [activeTab, setActiveTab] = useState("company");
  const [allTestingFilds, setAllTestingFilds] = useState({});

  // ---------- Company State ----------
  const [companyData, setCompanyData] = useState({
    companyName: "",
    gst: "",
    address: "",
    phone: "",
    adminName: "",
  });
  const [savedCompanies, setSavedCompanies] = useState([]);
  const [editingCompanyId, setEditingCompanyId] = useState(null);
  const [editingCompanyData, setEditingCompanyData] = useState(null);
  const [companyFetchLoading, setCompanyFetchLoading] = useState(false);
  const [companySaveLoading, setCompanySaveLoading] = useState(false);
  const [companyDeleteLoading, setCompanyDeleteLoading] = useState(null);
  const [companyEditSaveLoading, setCompanyEditSaveLoading] = useState(false);

  // ---------- Lab State ----------
  const [labData, setLabData] = useState({
    labName: "",
    gst: "",
    address: "",
    phone: "",
    adminName: "",
    labType: "",
  });
  const [savedLabs, setSavedLabs] = useState([]);
  const [editingLabId, setEditingLabId] = useState(null);
  const [editingLabData, setEditingLabData] = useState(null);
  const [labFetchLoading, setLabFetchLoading] = useState(false);
  const [labSaveLoading, setLabSaveLoading] = useState(false);
  const [labDeleteLoading, setLabDeleteLoading] = useState(null);
  const [labEditSaveLoading, setLabEditSaveLoading] = useState(false);

  // ---------- Product State (with PDF) ----------
  const [productData, setProductData] = useState({ productName: "" });
  const [savedProducts, setSavedProducts] = useState([]);
  const [productFetchLoading, setProductFetchLoading] = useState(false);
  const [productSaveLoading, setProductSaveLoading] = useState(false);
  const [productDeleteLoading, setProductDeleteLoading] = useState(null);
  const [pdfUploadLoading, setPdfUploadLoading] = useState(null);
  const [pdfDeleteLoading, setPdfDeleteLoading] = useState(null);
  // PDF Modal
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");
  const [currentPdfName, setCurrentPdfName] = useState("");

  // ---------- Testing State ----------
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [testValues, setTestValues] = useState({});
  const [savedTests, setSavedTests] = useState([]);
  const [editingTestId, setEditingTestId] = useState(null);
  const [editingTestData, setEditingTestData] = useState(null);
  const [newTestLabel, setNewTestLabel] = useState("");
  const [newTestFields, setNewTestFields] = useState([
    { name: "", label: "", placeholder: "" },
  ]);
  const [testFetchLoading, setTestFetchLoading] = useState(false);
  const [testCreateLoading, setTestCreateLoading] = useState(false);

  // Helper to get full PDF URL without /api prefix
  const getPdfFullUrl = (relativePath) => {
    if (!relativePath) return null;
    if (relativePath.startsWith("http")) return relativePath;
    // Extract backend origin from axios baseURL (e.g., http://localhost:5000/api -> http://localhost:5000)
    const backendBase =
      api.defaults.baseURL?.replace(/\/api$/, "") || "http://localhost:5000";
    const cleanBase = backendBase.replace(/\/$/, "");
    const path = relativePath.startsWith("/")
      ? relativePath
      : `/${relativePath}`;
    return `${cleanBase}${path}`;
  };

  // ---------- Company API Calls ----------
  const handleGetAllCompany = async () => {
    setCompanyFetchLoading(true);
    try {
      const response = await api.get("/getCompanies");
      if (response.data && response.data.allCompanies) {
        setSavedCompanies(response.data.allCompanies);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      alert("Failed to load companies.");
    } finally {
      setCompanyFetchLoading(false);
    }
  };

  const handleSaveCompany = async () => {
    if (!companyData.companyName.trim()) {
      alert("Company Name is required.");
      return;
    }
    setCompanySaveLoading(true);
    try {
      const generatedCode = generateCode("ARY");
      const payload = {
        companyName: companyData.companyName,
        gst: companyData.gst,
        address: companyData.address,
        phone: companyData.phone,
        adminName: companyData.adminName,
        companyCode: generatedCode,
      };
      const response = await api.post("/companies", payload);
      if (response.data && response.data.allCompanies) {
        setSavedCompanies(response.data.allCompanies);
        alert("Company saved successfully!");
      }
      setCompanyData({
        companyName: "",
        gst: "",
        address: "",
        phone: "",
        adminName: "",
      });
    } catch (error) {
      console.error("Error saving company:", error);
      const errorMsg = error.response?.data?.error || "Failed to save company.";
      alert(errorMsg);
    } finally {
      setCompanySaveLoading(false);
    }
  };

  const saveEditCompany = async () => {
    if (!editingCompanyData.companyName.trim()) {
      alert("Company Name required.");
      return;
    }
    setCompanyEditSaveLoading(true);
    try {
      const response = await api.put(`/companies/${editingCompanyId}`, {
        companyName: editingCompanyData.companyName,
        gst: editingCompanyData.gst,
        address: editingCompanyData.address,
        phone: editingCompanyData.phone,
        adminName: editingCompanyData.adminName,
        companyCode: editingCompanyData.companyCode,
      });
      if (response.data && response.data.allCompanies) {
        setSavedCompanies(response.data.allCompanies);
        alert("Company updated successfully!");
      }
      setEditingCompanyId(null);
      setEditingCompanyData(null);
    } catch (error) {
      console.error("Error updating company:", error);
      alert(error.response?.data?.error || "Failed to update company.");
    } finally {
      setCompanyEditSaveLoading(false);
    }
  };

  const deleteCompany = async (id) => {
    if (!window.confirm("Delete this company record?")) return;
    setCompanyDeleteLoading(id);
    try {
      const response = await api.delete(`/companies/${id}`);
      if (response.data && response.data.allCompanies) {
        setSavedCompanies(response.data.allCompanies);
        alert("Company deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      alert(error.response?.data?.error || "Failed to delete company.");
    } finally {
      setCompanyDeleteLoading(null);
    }
  };

  // ---------- Lab API Calls ----------
  const handleGetLab = async () => {
    setLabFetchLoading(true);
    try {
      const response = await api.get("/labs");
      if (response.data && response.data.allLabs) {
        setSavedLabs(response.data.allLabs);
      }
    } catch (error) {
      console.error("Error fetching labs:", error);
      alert("Failed to load labs.");
    } finally {
      setLabFetchLoading(false);
    }
  };

  const handleSaveLab = async () => {
    if (!labData.labName.trim()) {
      alert("Lab Name is required.");
      return;
    }
    if (!labData.labType) {
      alert("Please select Lab Type.");
      return;
    }
    setLabSaveLoading(true);
    try {
      const generatedCode = generateCode("LAB");
      const response = await api.post("/labs", {
        labName: labData.labName,
        gst: labData.gst,
        address: labData.address,
        phone: labData.phone,
        adminName: labData.adminName,
        labType: labData.labType,
        labCode: generatedCode,
      });
      if (response.data && response.data.allLabs) {
        setSavedLabs(response.data.allLabs);
        alert("Lab saved successfully!");
      }
      setLabData({
        labName: "",
        gst: "",
        address: "",
        phone: "",
        adminName: "",
        labType: "",
      });
    } catch (error) {
      console.error("Error saving lab:", error);
      alert(error.response?.data?.error || "Failed to save lab.");
    } finally {
      setLabSaveLoading(false);
    }
  };

  const saveEditLab = async () => {
    if (!editingLabData.labName.trim()) {
      alert("Lab Name required.");
      return;
    }
    setLabEditSaveLoading(true);
    try {
      const response = await api.put(`/labs/${editingLabId}`, {
        labName: editingLabData.labName,
        gst: editingLabData.gst,
        address: editingLabData.address,
        phone: editingLabData.phone,
        adminName: editingLabData.adminName,
        labType: editingLabData.labType,
        labCode: editingLabData.labCode,
      });
      if (response.data && response.data.allLabs) {
        setSavedLabs(response.data.allLabs);
        alert("Lab updated successfully!");
      }
      setEditingLabId(null);
      setEditingLabData(null);
    } catch (error) {
      console.error("Error updating lab:", error);
      alert(error.response?.data?.error || "Failed to update lab.");
    } finally {
      setLabEditSaveLoading(false);
    }
  };

  const deleteLab = async (id) => {
    if (!window.confirm("Delete this lab record?")) return;
    setLabDeleteLoading(id);
    try {
      const response = await api.delete(`/labs/${id}`);
      if (response.data && response.data.allLabs) {
        setSavedLabs(response.data.allLabs);
        alert("Lab deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting lab:", error);
      alert(error.response?.data?.error || "Failed to delete lab.");
    } finally {
      setLabDeleteLoading(null);
    }
  };

  // ---------- Product API Calls with PDF support ----------
  const handleGetProduct = async () => {
    setProductFetchLoading(true);
    try {
      const response = await api.get("/products");
      if (response.data && response.data.allProducts) {
        setSavedProducts(response.data.allProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products.");
    } finally {
      setProductFetchLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!productData.productName.trim()) {
      alert("Product Name is required.");
      return;
    }
    setProductSaveLoading(true);
    try {
      const generatedId = generateCode("SMP");
      const response = await api.post("/products", {
        productName: productData.productName,
        productId: generatedId,
      });
      if (response.data && response.data.allProducts) {
        setSavedProducts(response.data.allProducts);
        alert("Product saved successfully!");
        setProductData({ productName: "" });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.response?.data?.error || "Failed to save product.");
    } finally {
      setProductSaveLoading(false);
    }
  };

  const addPdfToProduct = async (productId, file) => {
    if (!file) return;
    setPdfUploadLoading(productId);
    try {
      const formData = new FormData();
      formData.append("pdfFile", file);
      const response = await api.put(`/products/${productId}/pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data && response.data.allProducts) {
        setSavedProducts(response.data.allProducts);
        alert("PDF added successfully!");
      }
    } catch (error) {
      console.error("Error adding PDF:", error);
      alert(error.response?.data?.error || "Failed to add PDF.");
    } finally {
      setPdfUploadLoading(null);
    }
  };

  const deletePdfFromProduct = async (productId) => {
    if (!window.confirm("Remove PDF from this product?")) return;
    setPdfDeleteLoading(productId);
    try {
      const response = await api.delete(`/products/${productId}/pdf`);
      if (response.data && response.data.allProducts) {
        setSavedProducts(response.data.allProducts);
        alert("PDF removed successfully!");
      }
    } catch (error) {
      console.error("Error deleting PDF:", error);
      alert(error.response?.data?.error || "Failed to delete PDF.");
    } finally {
      setPdfDeleteLoading(null);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product? This will also delete its PDF."))
      return;
    setProductDeleteLoading(id);
    try {
      const response = await api.delete(`/products/${id}`);
      if (response.data && response.data.allProducts) {
        setSavedProducts(response.data.allProducts);
        alert("Product deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    } finally {
      setProductDeleteLoading(null);
    }
  };

  // ---------- Testing API ----------
  const fetchAllTests = async () => {
    setTestFetchLoading(true);
    try {
      const response = await api.get("/tests");
      if (response.data && response.data.TESTING_FIELDS) {
        setAllTestingFilds(response.data.TESTING_FIELDS);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      alert("Failed to load tests.");
    } finally {
      setTestFetchLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(allTestingFilds).length > 0) {
      const tests = Object.keys(allTestingFilds).map((key) => ({
        id: key,
        label: key,
        fields: allTestingFilds[key],
      }));
      setAvailableTests(tests);
    } else {
      setAvailableTests([]);
    }
  }, [allTestingFilds]);

  const handleToggleTest = (testId) => {
    setSelectedTestIds((prev) =>
      prev.includes(testId)
        ? prev.filter((id) => id !== testId)
        : [...prev, testId],
    );
    if (!selectedTestIds.includes(testId)) {
      const test = availableTests.find((t) => t.id === testId);
      if (test) {
        const initialValues = {};
        test?.fields?.forEach((field) => {
          initialValues[field?.name] = "";
        });
        setTestValues((prev) => ({ ...prev, [testId]: initialValues }));
      }
    }
  };

  const handleTestFieldChange = (testId, fieldName, value) => {
    setTestValues((prev) => ({
      ...prev,
      [testId]: { ...(prev[testId] || {}), [fieldName]: value },
    }));
  };

  const addCustomField = () =>
    setNewTestFields([
      ...newTestFields,
      { name: "", label: "", placeholder: "" },
    ]);

  const removeCustomField = (index) => {
    const updated = [...newTestFields];
    updated.splice(index, 1);
    setNewTestFields(updated);
  };

  const updateCustomField = (index, key, value) => {
    const updated = [...newTestFields];
    updated[index][key] = value;
    setNewTestFields(updated);
  };

  const handleAddNewTest = async () => {
    if (!newTestLabel.trim()) return;
    const invalid = newTestFields.some(
      (f) => !f.name.trim() || !f.label.trim(),
    );
    if (invalid) {
      alert("Please fill in both Name and Label for each field.");
      return;
    }
    setTestCreateLoading(true);
    try {
      const payload = {
        test_name: newTestLabel.trim(),
        fields: newTestFields.map((f) => ({
          name: f.name.trim(),
          label: f.label.trim(),
          placeholder: f.placeholder || "",
        })),
      };
      const res = await api.post("/create-test", payload);
      if (res.status !== 200 && res.status !== 201) {
        alert(res.data?.error || "Failed to create test");
        return;
      }
      await fetchAllTests();
      setNewTestLabel("");
      setNewTestFields([{ name: "", label: "", placeholder: "" }]);
      alert("Test created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating test");
    } finally {
      setTestCreateLoading(false);
    }
  };

  const resetTesting = () => {
    setSelectedTestIds([]);
    setTestValues({});
    setNewTestLabel("");
    setNewTestFields([{ name: "", label: "", placeholder: "" }]);
  };

  const handleSaveTesting = () => {
    if (selectedTestIds.length === 0) {
      alert("Please select at least one test.");
      return;
    }
    const selectedTestsData = selectedTestIds.map((id) => {
      const test = availableTests.find((t) => t.id === id);
      return {
        testId: id,
        testLabel: test?.label,
        fields:
          test?.fields.map((f) => ({
            label: f.label,
            value: testValues[id]?.[f.name] || "",
          })) || [],
      };
    });
    const newEntry = {
      id: Date.now(),
      savedAt: new Date().toLocaleString(),
      tests: selectedTestsData,
    };
    setSavedTests((prev) => [newEntry, ...prev]);
    alert(`Saved ${selectedTestsData.length} test(s).`);
    setSelectedTestIds([]);
    setTestValues({});
  };

  const startEditTest = (entry) => {
    setEditingTestId(entry.id);
    setEditingTestData(JSON.parse(JSON.stringify(entry)));
  };

  const cancelEditTest = () => {
    setEditingTestId(null);
    setEditingTestData(null);
  };

  const saveEditTest = () => {
    setSavedTests((prev) =>
      prev.map((t) =>
        t.id === editingTestId
          ? { ...editingTestData, savedAt: new Date().toLocaleString() }
          : t,
      ),
    );
    cancelEditTest();
  };

  const deleteTestEntry = (id) => {
    if (window.confirm("Delete this test configuration?"))
      setSavedTests((prev) => prev.filter((t) => t.id !== id));
  };

  const updateEditingTestField = (testIndex, fieldIndex, newValue) => {
    const updated = { ...editingTestData };
    updated.tests[testIndex].fields[fieldIndex].value = newValue;
    setEditingTestData(updated);
  };

  // Initial data load
  useEffect(() => {
    handleGetAllCompany();
    handleGetLab();
    handleGetProduct();
    fetchAllTests();
  }, []);

  const renderTableLoader = () => (
    <tr>
      <td colSpan={10} className="lm-loader-container">
        <CircularLoader />
      </td>
    </tr>
  );

  const openPdfModal = (pdfPath, productName) => {
    const fullUrl = getPdfFullUrl(pdfPath);
    console.log("fullUrl", fullUrl);

    setCurrentPdfUrl(fullUrl);
    setCurrentPdfName(productName || "PDF Document");
    setPdfModalOpen(true);
  };

  const closePdfModal = () => {
    setPdfModalOpen(false);
    setCurrentPdfUrl("");
    setCurrentPdfName("");
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div className="lm-app">
        <div className="lm-container">
          <div className="lm-header">
            <h1 className="lm-title">Lab Management System</h1>
            <p className="lm-subtitle">
              Manage companies, labs, products, and test configurations
            </p>
          </div>

          <div className="lm-tabs">
            <button
              className={`lm-tab ${activeTab === "company" ? "active" : ""}`}
              onClick={() => setActiveTab("company")}
            >
              Company
            </button>
            <button
              className={`lm-tab ${activeTab === "lab" ? "active" : ""}`}
              onClick={() => setActiveTab("lab")}
            >
              Lab
            </button>
            <button
              className={`lm-tab ${activeTab === "product" ? "active" : ""}`}
              onClick={() => setActiveTab("product")}
            >
              Product
            </button>
            <button
              className={`lm-tab ${activeTab === "testing" ? "active" : ""}`}
              onClick={() => setActiveTab("testing")}
            >
              Testing
            </button>
          </div>

          {/* COMPANY TAB */}
          {activeTab === "company" && (
            <div className="lm-panel">
              <div className="lm-form-grid">
                <div className="lm-field">
                  <label className="lm-label">Company Name</label>
                  <input
                    className="lm-input"
                    value={companyData.companyName}
                    onChange={(e) =>
                      setCompanyData((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="lm-field">
                  <label className="lm-label">GST Number</label>
                  <input
                    className="lm-input"
                    value={companyData.gst}
                    onChange={(e) =>
                      setCompanyData((prev) => ({
                        ...prev,
                        gst: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="lm-field lm-full-width">
                  <label className="lm-label">Address</label>
                  <textarea
                    className="lm-textarea"
                    value={companyData.address}
                    onChange={(e) =>
                      setCompanyData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="lm-field">
                  <label className="lm-label">Phone Number</label>
                  <input
                    className="lm-input"
                    value={companyData.phone}
                    onChange={(e) =>
                      setCompanyData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="lm-field">
                  <label className="lm-label">Admin Name</label>
                  <input
                    className="lm-input"
                    value={companyData.adminName}
                    onChange={(e) =>
                      setCompanyData((prev) => ({
                        ...prev,
                        adminName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="lm-actions">
                <button
                  className="lm-btn-secondary"
                  onClick={() =>
                    setCompanyData({
                      companyName: "",
                      gst: "",
                      address: "",
                      phone: "",
                      adminName: "",
                    })
                  }
                  disabled={companySaveLoading}
                >
                  Clear
                </button>
                <button
                  className="lm-btn-primary"
                  onClick={handleSaveCompany}
                  disabled={companySaveLoading}
                >
                  {companySaveLoading && <CircularLoader size="sm" inline />}
                  Save Company
                </button>
              </div>
              <div className="lm-table-wrapper">
                <table className="lm-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>GST</th>
                      <th>Phone</th>
                      <th>Admin</th>
                      <th>Address</th>
                      <th>Saved At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyFetchLoading
                      ? renderTableLoader()
                      : savedCompanies.map((comp) => (
                          <tr key={comp.id}>
                            {editingCompanyId === comp.id ? (
                              <>
                                <td>{comp.companyCode}</td>
                                <td>
                                  <input
                                    className="lm-editable-input"
                                    value={editingCompanyData.companyName}
                                    onChange={(e) =>
                                      setEditingCompanyData({
                                        ...editingCompanyData,
                                        companyName: e.target.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="lm-editable-input"
                                    value={editingCompanyData.gst}
                                    onChange={(e) =>
                                      setEditingCompanyData({
                                        ...editingCompanyData,
                                        gst: e.target.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="lm-editable-input"
                                    value={editingCompanyData.phone}
                                    onChange={(e) =>
                                      setEditingCompanyData({
                                        ...editingCompanyData,
                                        phone: e.target.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="lm-editable-input"
                                    value={editingCompanyData.adminName}
                                    onChange={(e) =>
                                      setEditingCompanyData({
                                        ...editingCompanyData,
                                        adminName: e.target.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>
                                  <textarea
                                    className="lm-editable-input"
                                    rows={2}
                                    value={editingCompanyData.address}
                                    onChange={(e) =>
                                      setEditingCompanyData({
                                        ...editingCompanyData,
                                        address: e.target.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>{comp.savedAt}</td>
                                <td className="lm-action-buttons">
                                  <button
                                    className="lm-icon-btn"
                                    onClick={saveEditCompany}
                                    disabled={companyEditSaveLoading}
                                  >
                                    {companyEditSaveLoading ? (
                                      <CircularLoader size="sm" inline />
                                    ) : (
                                      "💾"
                                    )}
                                  </button>
                                  <button
                                    className="lm-icon-btn"
                                    onClick={() => {
                                      setEditingCompanyId(null);
                                      setEditingCompanyData(null);
                                    }}
                                    disabled={companyEditSaveLoading}
                                  >
                                    ✖️
                                  </button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{comp.companyCode}</td>
                                <td>{comp.companyName}</td>
                                <td>{comp.gst}</td>
                                <td>{comp.phone}</td>
                                <td>{comp.adminName}</td>
                                <td>{comp.address}</td>
                                <td>{convertToIST(comp.savedAt)}</td>
                                <td className="lm-action-buttons">
                                  <button
                                    className="lm-icon-btn"
                                    onClick={() => {
                                      setEditingCompanyId(comp.id);
                                      setEditingCompanyData({ ...comp });
                                    }}
                                    disabled={
                                      companyDeleteLoading === comp.id ||
                                      companyEditSaveLoading
                                    }
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className="lm-icon-btn"
                                    onClick={() => deleteCompany(comp.id)}
                                    disabled={companyDeleteLoading === comp.id}
                                  >
                                    {companyDeleteLoading === comp.id ? (
                                      <CircularLoader size="sm" inline />
                                    ) : (
                                      "🗑️"
                                    )}
                                  </button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LAB TAB */}
          {activeTab === "lab" && (
            <div className="lm-panel">
              <div className="lm-form-grid">
                <div className="lm-field">
                  <label className="lm-label">Lab Name</label>
                  <input
                    className="lm-input"
                    value={labData.labName}
                    onChange={(e) =>
                      setLabData((prev) => ({
                        ...prev,
                        labName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="lm-field">
                  <label className="lm-label">GST Number</label>
                  <input
                    className="lm-input"
                    value={labData.gst}
                    onChange={(e) =>
                      setLabData((prev) => ({ ...prev, gst: e.target.value }))
                    }
                  />
                </div>
                <div className="lm-field lm-full-width">
                  <label className="lm-label">Address</label>
                  <textarea
                    className="lm-textarea"
                    value={labData.address}
                    onChange={(e) =>
                      setLabData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="lm-field">
                  <label className="lm-label">Phone</label>
                  <input
                    className="lm-input"
                    value={labData.phone}
                    onChange={(e) =>
                      setLabData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="lm-field">
                  <label className="lm-label">Admin Name</label>
                  <input
                    className="lm-input"
                    value={labData.adminName}
                    onChange={(e) =>
                      setLabData((prev) => ({
                        ...prev,
                        adminName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="lm-field">
                  <label className="lm-label">Lab Type</label>
                  <select
                    className="lm-select"
                    value={labData.labType}
                    onChange={(e) =>
                      setLabData((prev) => ({
                        ...prev,
                        labType: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select type</option>
                    <option value="internal">Internal</option>
                    <option value="thirdparty">Third Party</option>
                  </select>
                </div>
              </div>
              <div className="lm-actions">
                <button
                  className="lm-btn-secondary"
                  onClick={() =>
                    setLabData({
                      labName: "",
                      gst: "",
                      address: "",
                      phone: "",
                      adminName: "",
                      labType: "",
                    })
                  }
                  disabled={labSaveLoading}
                >
                  Clear
                </button>
                <button
                  className="lm-btn-primary"
                  onClick={handleSaveLab}
                  disabled={labSaveLoading}
                >
                  {labSaveLoading && <CircularLoader size="sm" inline />}
                  Save Lab
                </button>
              </div>
              <div className="lm-table-wrapper">
                <table className="lm-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>GST</th>
                      <th>Phone</th>
                      <th>Admin</th>
                      <th>Type</th>
                      <th>Address</th>
                      <th>Saved At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labFetchLoading
                      ? renderTableLoader()
                      : savedLabs.map((lab) => (
                          <tr key={lab.id}>
                            {editingLabId === lab.id ? (
                              <>
                                <td>{lab.labCode}</td>
                                <td>
                                  <input
                                    className="lm-editable-input"
                                    value={editingLabData.labName}
                                    onChange={(e) =>
                                      setEditingLabData({
                                        ...editingLabData,
                                        labName: e.target.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="lm-editable-input"
                                    value={editingLabData.gst}
                                    onChange={(e) =>
                                      setEditingLabData({
                                        ...editingLabData,
                                        gst: e.target.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="lm-editable-input"
                                    value={editingLabData.phone}
                                    onChange={(e) =>
                                      setEditingLabData({
                                        ...editingLabData,
                                        phone: e.target.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    className="lm-editable-input"
                                    value={editingLabData.adminName}
                                    onChange={(e) =>
                                      setEditingLabData({
                                        ...editingLabData,
                                        adminName: e.target.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>
                                  <select
                                    className="lm-editable-select"
                                    value={editingLabData.labType}
                                    onChange={(e) =>
                                      setEditingLabData({
                                        ...editingLabData,
                                        labType: e.target.value,
                                      })
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option value="internal">Internal</option>
                                    <option value="thirdparty">
                                      Third Party
                                    </option>
                                  </select>
                                </td>
                                <td>
                                  <textarea
                                    className="lm-editable-input"
                                    rows={2}
                                    value={editingLabData.address}
                                    onChange={(e) =>
                                      setEditingLabData({
                                        ...editingLabData,
                                        address: e.target.value,
                                      })
                                    }
                                  />
                                </td>
                                <td>{lab.savedAt}</td>
                                <td className="lm-action-buttons">
                                  <button
                                    className="lm-icon-btn"
                                    onClick={saveEditLab}
                                    disabled={labEditSaveLoading}
                                  >
                                    {labEditSaveLoading ? (
                                      <CircularLoader size="sm" inline />
                                    ) : (
                                      "💾"
                                    )}
                                  </button>
                                  <button
                                    className="lm-icon-btn"
                                    onClick={() => {
                                      setEditingLabId(null);
                                      setEditingLabData(null);
                                    }}
                                    disabled={labEditSaveLoading}
                                  >
                                    ✖️
                                  </button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{lab.labCode}</td>
                                <td>{lab.labName}</td>
                                <td>{lab.gst}</td>
                                <td>{lab.phone}</td>
                                <td>{lab.adminName}</td>
                                <td>
                                  {lab.labType === "internal"
                                    ? "Internal"
                                    : "Third Party"}
                                </td>
                                <td>{lab.address}</td>
                                <td>{convertToIST(lab.savedAt)}</td>
                                <td className="lm-action-buttons">
                                  <button
                                    className="lm-icon-btn"
                                    onClick={() => {
                                      setEditingLabId(lab.id);
                                      setEditingLabData({ ...lab });
                                    }}
                                    disabled={
                                      labDeleteLoading === lab.id ||
                                      labEditSaveLoading
                                    }
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    className="lm-icon-btn"
                                    onClick={() => deleteLab(lab.id)}
                                    disabled={labDeleteLoading === lab.id}
                                  >
                                    {labDeleteLoading === lab.id ? (
                                      <CircularLoader size="sm" inline />
                                    ) : (
                                      "🗑️"
                                    )}
                                  </button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCT TAB with PDF modal */}
          {activeTab === "product" && (
            <div className="lm-panel">
              <div className="lm-form-grid">
                <div className="lm-field lm-full-width">
                  <label className="lm-label">Product Name</label>
                  <input
                    className="lm-input"
                    value={productData.productName}
                    onChange={(e) =>
                      setProductData({ productName: e.target.value })
                    }
                    placeholder="Enter product name"
                  />
                </div>
              </div>
              <div className="lm-actions">
                <button
                  className="lm-btn-secondary"
                  onClick={() => setProductData({ productName: "" })}
                  disabled={productSaveLoading}
                >
                  Clear
                </button>
                <button
                  className="lm-btn-primary"
                  onClick={handleSaveProduct}
                  disabled={productSaveLoading}
                >
                  {productSaveLoading && <CircularLoader size="sm" inline />}
                  Save Product
                </button>
              </div>
              <div className="lm-table-wrapper">
                <table className="lm-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Product ID</th>
                      <th>PDF Document</th>
                      <th>Saved At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productFetchLoading
                      ? renderTableLoader()
                      : savedProducts.map((prod) => (
                          <tr key={prod.id}>
                            <td>{prod.productName}</td>
                            <td>{prod.productId}</td>
                            <td>
                              {prod.pdf_path ? (
                                <div className="lm-action-buttons">
                                  <button
                                    className="lm-icon-btn"
                                    onClick={() =>
                                      openPdfModal(
                                        prod.pdf_path,
                                        prod.productName,
                                      )
                                    }
                                  >
                                    <MdOutlinePictureAsPdf size={25} />
                                  </button>
                                  <button
                                    className="lm-icon-btn"
                                    onClick={() =>
                                      deletePdfFromProduct(prod.id)
                                    }
                                    disabled={pdfDeleteLoading === prod.id}
                                    style={{ color: "#dc2626" }}
                                  >
                                    {pdfDeleteLoading === prod.id ? (
                                      <CircularLoader
                                        size="sm"
                                        inline
                                        size={25}
                                      />
                                    ) : (
                                      <MdOutlineDeleteOutline size={25} />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="lm-icon-btn"
                                  onClick={() => {
                                    const input =
                                      document.createElement("input");
                                    input.type = "file";
                                    input.accept = "application/pdf";
                                    input.onchange = (e) => {
                                      if (e.target.files[0])
                                        addPdfToProduct(
                                          prod.id,
                                          e.target.files[0],
                                        );
                                    };
                                    input.click();
                                  }}
                                  disabled={pdfUploadLoading === prod.id}
                                >
                                  {pdfUploadLoading === prod.id ? (
                                    <CircularLoader
                                      size="sm"
                                      inline
                                      size={25}
                                    />
                                  ) : (
                                    <MdAddToPhotos size={25} />
                                  )}
                                </button>
                              )}
                            </td>
                            <td>{convertToIST(prod.savedAt)}</td>
                            <td className="lm-action-buttons">
                              <button
                                className="lm-icon-btn"
                                onClick={() => deleteProduct(prod.id)}
                                disabled={productDeleteLoading === prod.id}
                                style={{ color: "#dc2626" }}
                              >
                                {productDeleteLoading === prod.id ? (
                                  <CircularLoader size="sm" inline />
                                ) : (
                                  "🗑️"
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TESTING TAB */}
          {activeTab === "testing" && (
            <div className="lm-panel">
              <div className="lm-field lm-full-width">
                <label className="lm-label">Select Testing Types</label>
                <div className="lm-check-group">
                  {testFetchLoading ? (
                    <div className="lm-loader-container">
                      <CircularLoader />
                    </div>
                  ) : (
                    availableTests.map((test) => (
                      <div key={test.id} className="lm-checkbox-item">
                        <input
                          type="checkbox"
                          id={test.id}
                          checked={selectedTestIds.includes(test.id)}
                          onChange={() => handleToggleTest(test.id)}
                        />
                        <label htmlFor={test.id}>{test.label}</label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="lm-new-test">
                <div className="lm-new-test-title">➕ Create New Test</div>
                <div className="lm-row">
                  <div className="lm-field">
                    <label className="lm-label">Test Name</label>
                    <input
                      className="lm-input"
                      value={newTestLabel}
                      onChange={(e) => setNewTestLabel(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label className="lm-label">
                    Test Fields (Name, Label, Placeholder)
                  </label>
                  {newTestFields.map((field, idx) => (
                    <div key={idx} className="lm-dynamic-field-row">
                      <div className="lm-field">
                        <input
                          className="lm-input"
                          placeholder="Field name"
                          value={field.name}
                          onChange={(e) =>
                            updateCustomField(idx, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="lm-field">
                        <input
                          className="lm-input"
                          placeholder="Label"
                          value={field.label}
                          onChange={(e) =>
                            updateCustomField(idx, "label", e.target.value)
                          }
                        />
                      </div>
                      <div className="lm-field">
                        <input
                          className="lm-input"
                          placeholder="Placeholder"
                          value={field.placeholder}
                          onChange={(e) =>
                            updateCustomField(
                              idx,
                              "placeholder",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <button
                        className="lm-btn-outline"
                        onClick={() => removeCustomField(idx)}
                        disabled={
                          newTestFields.length === 1 || testCreateLoading
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    className="lm-btn-outline"
                    onClick={addCustomField}
                    style={{ marginTop: "0.5rem" }}
                    disabled={testCreateLoading}
                  >
                    + Add Field
                  </button>
                </div>
                <button
                  className="lm-btn-small"
                  onClick={handleAddNewTest}
                  disabled={!newTestLabel.trim() || testCreateLoading}
                >
                  {testCreateLoading && <CircularLoader size="sm" inline />}
                  Create Test
                </button>
              </div>

              {selectedTestIds.length > 0 && (
                <div className="lm-test-section">
                  <div className="lm-test-heading">📋 Test Parameters</div>
                  {selectedTestIds.map((testId) => {
                    const test = availableTests.find((t) => t.id === testId);
                    if (!test) return null;
                    const values = testValues[testId] || {};
                    return (
                      <div key={testId} className="lm-test-fields">
                        <h3
                          style={{
                            marginBottom: "1rem",
                            fontSize: "1rem",
                            fontWeight: 600,
                          }}
                        >
                          {test.label}
                        </h3>
                        <div className="lm-form-grid">
                          {test.fields.map((field) => (
                            <div key={field.name} className="lm-field">
                              <label className="lm-label">{field.label}</label>
                              <input
                                className="lm-input"
                                placeholder={field.placeholder}
                                value={values[field.name] || ""}
                                onChange={(e) =>
                                  handleTestFieldChange(
                                    testId,
                                    field.name,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="lm-actions">
                <button className="lm-btn-secondary" onClick={resetTesting}>
                  Clear All
                </button>
                <button
                  className="lm-btn-primary"
                  onClick={handleSaveTesting}
                  disabled={selectedTestIds.length === 0}
                >
                  Apply Testing
                </button>
              </div>

              {savedTests.length > 0 && (
                <div className="lm-table-wrapper">
                  <table className="lm-table">
                    <thead>
                      <tr>
                        <th>Saved At</th>
                        <th>Test(s) & Values</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedTests.map((entry) => (
                        <tr key={entry.id}>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {entry.savedAt}
                          </td>
                          <td>
                            {editingTestId === entry.id
                              ? editingTestData.tests.map((test, ti) => (
                                  <div
                                    key={ti}
                                    style={{ marginBottom: "1rem" }}
                                  >
                                    <strong>{test.testLabel}</strong>
                                    <ul className="lm-test-fields-preview">
                                      {test.fields.map((field, fi) => (
                                        <li key={fi}>
                                          {field.label}:{" "}
                                          <input
                                            className="lm-editable-input"
                                            style={{
                                              width: "auto",
                                              display: "inline-block",
                                              marginLeft: "0.5rem",
                                            }}
                                            value={field.value}
                                            onChange={(e) =>
                                              updateEditingTestField(
                                                ti,
                                                fi,
                                                e.target.value,
                                              )
                                            }
                                          />
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))
                              : entry.tests.map((test, idx) => (
                                  <div
                                    key={idx}
                                    style={{ marginBottom: "0.75rem" }}
                                  >
                                    <strong>{test.testLabel}</strong>
                                    <ul className="lm-test-fields-preview">
                                      {test.fields.map((field, fidx) => (
                                        <li key={fidx}>
                                          {field.label}: {field.value || "—"}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                          </td>
                          <td className="lm-action-buttons">
                            {editingTestId === entry.id ? (
                              <>
                                <button
                                  className="lm-icon-btn"
                                  onClick={saveEditTest}
                                >
                                  💾
                                </button>
                                <button
                                  className="lm-icon-btn"
                                  onClick={cancelEditTest}
                                >
                                  ✖️
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="lm-icon-btn"
                                  onClick={() => startEditTest(entry)}
                                >
                                  ✏️
                                </button>
                                <button
                                  className="lm-icon-btn"
                                  onClick={() => deleteTestEntry(entry.id)}
                                >
                                  🗑️
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PDF Modal */}
      {pdfModalOpen && (
        <div className="lm-modal-overlay" onClick={closePdfModal}>
          <div className="lm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lm-modal-header">
              <h3>{currentPdfName}</h3>
              <button className="lm-modal-close" onClick={closePdfModal}>
                <IoCloseSharp size={25} />
              </button>
            </div>
            <div className="lm-modal-body">
              <iframe
                className="lm-iframe-pdf"
                src={currentPdfUrl}
                title="PDF Viewer"
                frameBorder="0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
