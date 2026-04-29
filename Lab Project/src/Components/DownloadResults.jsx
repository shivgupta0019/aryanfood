import React, { useState, useEffect, useRef } from "react";
import "./DownloadResults.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DownloadResults() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showLabDropdown, setShowLabDropdown] = useState(false);
  const [showFieldsDropdown, setShowFieldsDropdown] = useState(false);
  const [selectedFields, setSelectedFields] = useState({});
  const [results, setResults] = useState(null);
  const [dynamicFieldDefinitions, setDynamicFieldDefinitions] = useState(null);

  // Refs for handling outside clicks
  const labDropdownRef = useRef(null);
  const fieldsDropdownRef = useRef(null);

  // Testing Type Fields - Extracted from Central Lab Master form
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
      {
        name: "salmonella",
        label: "Salmonella",
        placeholder: "e.g. Absent/25g",
      },
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
    Pesticide: [
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
      {
        name: "solventUsed",
        label: "Solvent Used",
        placeholder: "e.g. Xylene",
      },
      {
        name: "stabilityTest",
        label: "Stability Test",
        placeholder: "e.g. Stable at 54°C",
      },
      {
        name: "phOfSolution",
        label: "pH of Solution",
        placeholder: "e.g. 6.5",
      },
    ],
  };

  // Field definitions extracted from Central Lab Master form
  const fieldDefinitions = {
    "Lab Info": [
      { key: "code", label: "Lab Code" },
      { key: "labname", label: "Lab Name" },
      { key: "location", label: "Location" },
      { key: "labtype", label: "Lab Type" },
    ],
    "🧪 Lab Test": [
      { key: "labCode", label: "Lab Code" },
      { key: "companyCode", label: "Company Code" },
      { key: "companyName", label: "Company Name" },
      { key: "labTestCode", label: "Lab Test Code" },
      { key: "testLocation", label: "Test Location" },
      { key: "testingCompanyName", label: "Testing Company Name" },
      { key: "testingType", label: "Testing Type" },
      ...Object.entries(TESTING_FIELDS).flatMap(([type, fields]) =>
        fields.map((f) => ({
          key: f.name,
          label: `${type}: ${f.label}`,
        })),
      ),
    ],
    "🔬 Scientist": [
      { key: "userId", label: "User ID" },
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "labCode", label: "Lab Code" },
    ],
    "⚙️ Instrument": [
      { key: "instrumentId", label: "Instrument ID" },
      { key: "instrumentName", label: "Instrument Name" },
      { key: "model", label: "Model" },
      { key: "calibrationDate", label: "Calibration Date" },
      { key: "nextCalibrationDate", label: "Next Calibration Date" },
    ],
    "📦 Raw Material": [
      { key: "materialCode", label: "Material Code" },
      { key: "materialName", label: "Material Name" },
      { key: "category", label: "Category" },
      { key: "supplier", label: "Supplier" },
      { key: "storageCondition", label: "Storage Condition" },
    ],
  };

  // Load labs from localStorage
  useEffect(() => {
    const storedLabs = JSON.parse(localStorage.getItem("centrallab")) || [];
    console.log("Loaded labs:", storedLabs);
    setLabs(storedLabs);
  }, []);

  // Function to get unique testing types used in a lab
  const getLabTestingTypes = (lab) => {
    const tests = lab.tests || [];
    const types = new Set();
    tests.forEach((test) => {
      if (test.testingType) {
        types.add(test.testingType);
      }
    });
    return Array.from(types);
  };

  // Function to generate dynamic field definitions based on lab's testing types
  const generateDynamicFieldDefs = (lab) => {
    const usedTypes = getLabTestingTypes(lab);

    // Get only the testing fields for the types used in this lab
    const testingFieldsForLab =
      usedTypes.length > 0
        ? usedTypes.flatMap((type) =>
            (TESTING_FIELDS[type] || []).map((f) => ({
              key: f.name,
              label: `${type}: ${f.label}`,
            })),
          )
        : []; // If no testing types, show no fields

    return {
      "Lab Info": fieldDefinitions["Lab Info"],
      "🧪 Lab Test": [
        { key: "labCode", label: "Lab Code" },
        { key: "companyCode", label: "Company Code" },
        { key: "companyName", label: "Company Name" },
        { key: "labTestCode", label: "Lab Test Code" },
        { key: "testLocation", label: "Test Location" },
        { key: "testingCompanyName", label: "Testing Company Name" },
        { key: "testingType", label: "Testing Type" },
        ...testingFieldsForLab,
      ],
      "🔬 Scientist": fieldDefinitions["🔬 Scientist"],
      "⚙️ Instrument": fieldDefinitions["⚙️ Instrument"],
      "📦 Raw Material": fieldDefinitions["📦 Raw Material"],
    };
  };

  // Initialize selectedFields when lab is selected
  useEffect(() => {
    if (selectedLab) {
      // Generate dynamic field definitions based on lab's testing types
      const dynamicDefs = generateDynamicFieldDefs(selectedLab);
      setDynamicFieldDefinitions(dynamicDefs);

      const initialFields = {};
      Object.values(dynamicDefs).forEach((fields) => {
        fields.forEach((field) => {
          initialFields[field.key] = false;
        });
      });
      setSelectedFields(initialFields);

      console.log("Lab testing types:", getLabTestingTypes(selectedLab));
      console.log("Dynamic field definitions:", dynamicDefs);
    }
  }, [selectedLab]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        labDropdownRef.current &&
        !labDropdownRef.current.contains(event.target)
      ) {
        setShowLabDropdown(false);
      }
      if (
        fieldsDropdownRef.current &&
        !fieldsDropdownRef.current.contains(event.target)
      ) {
        setShowFieldsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLabSelect = (lab) => {
    console.log("Lab selected:", lab);
    setSelectedLab(lab);
    setShowLabDropdown(false);
    setResults(null);
  };

  const handleFieldToggle = (fieldKey) => {
    setSelectedFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  const handleSelectAll = (isChecked) => {
    const defs = dynamicFieldDefinitions || fieldDefinitions;
    const newSelectedFields = {};

    Object.values(defs).forEach((fields) => {
      fields.forEach((field) => {
        newSelectedFields[field.key] = isChecked;
      });
    });

    setSelectedFields(newSelectedFields);
  };

  const handleShowResult = () => {
    const checkedFields = Object.keys(selectedFields).filter(
      (key) => selectedFields[key],
    );

    if (checkedFields.length === 0) {
      alert("Please select at least one field");
      return;
    }

    // Get data from the selected lab (nested in the lab from CentralLabForm)
    const testsForLab = selectedLab.tests || [];
    const scientistsForLab = selectedLab.scientists || [];
    const instrumentsForLab = selectedLab.instruments || [];
    const materialsForLab = selectedLab.materials || [];

    console.log("✅ Data from Central Lab Master:");
    console.log("Lab Code:", selectedLab.code);
    console.log("Tests from Lab:", testsForLab);
    console.log("Scientists from Lab:", scientistsForLab);
    console.log("Instruments from Lab:", instrumentsForLab);
    console.log("Materials from Lab:", materialsForLab);

    const organizedResults = {
      "Lab Info": [selectedLab],
      "🧪 Lab Test": testsForLab,
      "🔬 Scientist": scientistsForLab,
      "⚙️ Instrument": instrumentsForLab,
      "📦 Raw Material": materialsForLab,
    };

    setResults({
      checkedFields,
      organizedResults,
    });
  };

  const handleReset = () => {
    setSelectedLab(null);
    setShowFieldsDropdown(false);
    setSelectedFields({});
    setResults(null);
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("Lab Data Report", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;

    // Lab Info Header
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text(`Lab: ${selectedLab.labname}`, margin, yPosition);
    yPosition += 6;
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text(`Location: ${selectedLab.location}`, margin, yPosition);
    yPosition += 8;

    // Date
    const today = new Date().toLocaleDateString();
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Generated on: ${today}`, margin, yPosition);
    doc.setTextColor(0);
    yPosition += 10;

    // Helper function to add section
    const addSection = (title, data, fields) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(title, margin, yPosition);
      yPosition += 8;

      const tableData = data.map((record) =>
        fields.map((fieldKey) => {
          const value = record[fieldKey];
          return value !== undefined && value !== null && value !== ""
            ? String(value)
            : "N/A";
        }),
      );

      autoTable(doc, {
        startY: yPosition,
        head: [fields.map((f) => getFieldLabelForPDF(f))],
        body: tableData,
        margin: { left: margin, right: margin },
        columnStyles: {
          0: { cellWidth: contentWidth / (fields.length || 1) },
        },
        styles: {
          fontSize: 9,
          cellPadding: 4,
          textColor: 0,
          lineColor: 200,
          lineWidth: 0.1,
          fontName: "helvetica",
        },
        headStyles: {
          fontStyle: "bold",
          fillColor: [102, 126, 234],
          textColor: 255,
          lineColor: 50,
          lineWidth: 0.5,
          fontName: "helvetica",
        },
        alternateRowStyles: {
          fillColor: [245, 248, 255],
        },
      });

      yPosition = doc.lastAutoTable.finalY + 15;
    };

    // Helper function to add Lab Tests in 2-row format
    const addLabTestSection = (title, data, fields) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text(title, margin, yPosition);
      yPosition += 8;

      const baseFields = [
        "labCode",
        "companyCode",
        "companyName",
        "labTestCode",
        "testLocation",
        "testingCompanyName",
        "testingType",
      ];

      const baseFieldsSelected = fields.filter((f) => baseFields.includes(f));
      const testingTypeFieldsSelected = fields.filter(
        (f) => !baseFields.includes(f),
      );

      // Add each test record as two rows
      data.forEach((record, recordIdx) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }

        // Row 1: Base Test Fields
        if (baseFieldsSelected.length > 0) {
          const baseData = [
            baseFieldsSelected.map((fieldKey) => {
              const value = record[fieldKey];
              return value !== undefined && value !== null && value !== ""
                ? String(value)
                : "N/A";
            }),
          ];

          autoTable(doc, {
            startY: yPosition,
            head: [baseFieldsSelected.map((f) => getFieldLabelForPDF(f))],
            body: baseData,
            margin: { left: margin, right: margin },
            styles: {
              fontSize: 8,
              cellPadding: 3,
              textColor: 0,
              lineColor: 150,
              lineWidth: 0.1,
              fontName: "helvetica",
            },
            headStyles: {
              fontStyle: "bold",
              fillColor: [43, 99, 235],
              textColor: 255,
              lineColor: 30,
              lineWidth: 0.5,
              fontName: "helvetica",
            },
            bodyStyles: {
              fillColor: [240, 248, 255],
            },
          });

          yPosition = doc.lastAutoTable.finalY;
        }

        // Row 2: Testing Type Fields
        if (testingTypeFieldsSelected.length > 0) {
          const testingData = [
            testingTypeFieldsSelected.map((fieldKey) => {
              const value = record[fieldKey];
              return value !== undefined && value !== null && value !== ""
                ? String(value)
                : "N/A";
            }),
          ];

          autoTable(doc, {
            startY: yPosition,
            head: [
              testingTypeFieldsSelected.map((f) => getFieldLabelForPDF(f)),
            ],
            body: testingData,
            margin: { left: margin, right: margin },
            styles: {
              fontSize: 8,
              cellPadding: 3,
              textColor: 0,
              lineColor: 150,
              lineWidth: 0.1,
              fontName: "helvetica",
            },
            headStyles: {
              fontStyle: "bold",
              fillColor: [217, 119, 6],
              textColor: 255,
              lineColor: 30,
              lineWidth: 0.5,
              fontName: "helvetica",
            },
            bodyStyles: {
              fillColor: [255, 251, 240],
            },
          });

          yPosition = doc.lastAutoTable.finalY;
        }

        yPosition += 8; // Add space between records
      });
    };

    // Add sections
    const checkedFieldsSections = {};
    results.checkedFields.forEach((field) => {
      const section = getFieldSection(field);
      if (section) {
        if (!checkedFieldsSections[section]) {
          checkedFieldsSections[section] = [];
        }
        checkedFieldsSections[section].push(field);
      }
    });

    if (
      checkedFieldsSections["Lab Info"] &&
      results.organizedResults["Lab Info"]
    ) {
      addSection(
        "Lab Info",
        results.organizedResults["Lab Info"],
        checkedFieldsSections["Lab Info"],
      );
    }

    if (
      checkedFieldsSections["🧪 Lab Test"] &&
      results.organizedResults["🧪 Lab Test"]
    ) {
      addLabTestSection(
        "Lab Tests",
        results.organizedResults["🧪 Lab Test"],
        checkedFieldsSections["🧪 Lab Test"],
      );
    }

    if (
      checkedFieldsSections["🔬 Scientist"] &&
      results.organizedResults["🔬 Scientist"]
    ) {
      addSection(
        "Scientists",
        results.organizedResults["🔬 Scientist"],
        checkedFieldsSections["🔬 Scientist"],
      );
    }

    if (
      checkedFieldsSections["⚙️ Instrument"] &&
      results.organizedResults["⚙️ Instrument"]
    ) {
      addSection(
        "Instruments",
        results.organizedResults["⚙️ Instrument"],
        checkedFieldsSections["⚙️ Instrument"],
      );
    }

    if (
      checkedFieldsSections["📦 Raw Material"] &&
      results.organizedResults["📦 Raw Material"]
    ) {
      addSection(
        "Raw Materials",
        results.organizedResults["📦 Raw Material"],
        checkedFieldsSections["📦 Raw Material"],
      );
    }

    // Footer with page numbers
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(128);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      });
    }

    // Download PDF
    const fileName = `lab-report-${selectedLab.code}-${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  };

  const getFieldLabel = (fieldKey) => {
    // Check dynamic definitions first if available
    const defs = dynamicFieldDefinitions || fieldDefinitions;
    for (const fields of Object.values(defs)) {
      const field = fields.find((f) => f.key === fieldKey);
      if (field) return field.label;
    }
    return fieldKey;
  };

  // Get clean field label for PDF (without type prefix to avoid encoding issues)
  const getFieldLabelForPDF = (fieldKey) => {
    const label = getFieldLabel(fieldKey);
    // Remove type prefixes like "ETO: ", "Micro: ", etc. from labels
    const testingTypePrefix = [
      "ETO: ",
      "Micro: ",
      "Physical: ",
      "Chemical: ",
      "Pesticide: ",
    ];
    let cleanLabel = label;
    for (const prefix of testingTypePrefix) {
      if (label.startsWith(prefix)) {
        cleanLabel = label.substring(prefix.length);
        break;
      }
    }
    return cleanLabel;
  };

  const getFieldSection = (fieldKey) => {
    // Check dynamic definitions first if available
    const defs = dynamicFieldDefinitions || fieldDefinitions;
    for (const [section, fields] of Object.entries(defs)) {
      if (fields.find((f) => f.key === fieldKey)) {
        return section;
      }
    }
    return null;
  };

  const selectedCount = Object.values(selectedFields).filter(Boolean).length;

  // Separate base fields and testing type fields for Lab Test section
  const getBaseTestFields = () => {
    return [
      "labCode",
      "companyCode",
      "companyName",
      "labTestCode",
      "testLocation",
      "testingCompanyName",
      "testingType",
    ];
  };

  const isTestingTypeField = (fieldKey) => {
    for (const testingFields of Object.values(TESTING_FIELDS)) {
      if (testingFields.some((f) => f.name === fieldKey)) {
        return true;
      }
    }
    return false;
  };

  const renderLabTestSection = (section, records, checkedFieldsInSection) => {
    const baseFields = getBaseTestFields();
    const baseFieldsSelected = checkedFieldsInSection.filter((f) =>
      baseFields.includes(f),
    );
    const testingTypeFieldsSelected = checkedFieldsInSection.filter((f) =>
      isTestingTypeField(f),
    );

    return (
      <div
        key={section}
        className="results-section"
        style={{ marginBottom: "20px" }}
      >
        <h3 className="results-section-title">
          {section} ({records.length})
        </h3>
        {checkedFieldsInSection.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#999",
              background: "#f9f9f9",
              borderRadius: "8px",
              border: "1px dashed #ddd",
            }}
          >
            No fields selected for this section
          </div>
        ) : records.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#999",
              background: "#f9f9f9",
              borderRadius: "8px",
              border: "1px dashed #ddd",
            }}
          >
            No records found for this section
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            {records.map((record, recordIdx) => (
              <div
                key={recordIdx}
                style={{
                  marginBottom: "16px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #ddd",
                }}
              >
                {/* Row 1: Base Test Fields */}
                {baseFieldsSelected.length > 0 && (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 12,
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "#e8f1ff",
                          fontWeight: 700,
                          borderBottom: "2px solid #2563eb",
                        }}
                      >
                        {baseFieldsSelected.map((fieldKey) => (
                          <th
                            key={fieldKey}
                            style={{
                              textAlign: "left",
                              padding: "10px",
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {getFieldLabel(fieldKey)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ background: "#fff" }}>
                        {baseFieldsSelected.map((fieldKey) => (
                          <td
                            key={fieldKey}
                            style={{
                              padding: "10px",
                              borderRight: "1px solid #eee",
                            }}
                          >
                            {(() => {
                              const value = record[fieldKey];
                              return value !== undefined &&
                                value !== null &&
                                value !== ""
                                ? String(value)
                                : "N/A";
                            })()}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                )}

                {/* Row 2: Testing Type Fields */}
                {testingTypeFieldsSelected.length > 0 && (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 12,
                      borderTop: "1px solid #ddd",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "#fef9e7",
                          fontWeight: 700,
                          borderBottom: "2px solid #d97706",
                        }}
                      >
                        {testingTypeFieldsSelected.map((fieldKey) => (
                          <th
                            key={fieldKey}
                            style={{
                              textAlign: "left",
                              padding: "10px",
                              borderRight: "1px solid #ddd",
                            }}
                          >
                            {getFieldLabel(fieldKey)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ background: "#fffbf0" }}>
                        {testingTypeFieldsSelected.map((fieldKey) => (
                          <td
                            key={fieldKey}
                            style={{
                              padding: "10px",
                              borderRight: "1px solid #eee",
                            }}
                          >
                            {(() => {
                              const value = record[fieldKey];
                              return value !== undefined &&
                                value !== null &&
                                value !== ""
                                ? String(value)
                                : "N/A";
                            })()}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTableSection = (section, records, checkedFieldsInSection) => {
    return (
      <div
        key={section}
        className="results-section"
        style={{ marginBottom: "20px" }}
      >
        <h3 className="results-section-title">
          {section} ({records.length})
        </h3>
        {checkedFieldsInSection.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#999",
              background: "#f9f9f9",
              borderRadius: "8px",
              border: "1px dashed #ddd",
            }}
          >
            {records.length === 0
              ? "No records found for this section"
              : "No fields selected for this section"}
          </div>
        ) : records.length === 0 ? (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "#999",
              background: "#f9f9f9",
              borderRadius: "8px",
              border: "1px dashed #ddd",
            }}
          >
            No records found for this section
          </div>
        ) : (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f0f4ff",
                    fontWeight: 700,
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  {checkedFieldsInSection.map((fieldKey) => (
                    <th
                      key={fieldKey}
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {getFieldLabel(fieldKey)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record, idx) => (
                  <tr
                    key={idx}
                    style={{
                      background: idx % 2 === 0 ? "#fff" : "#f9f9f9",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {checkedFieldsInSection.map((fieldKey) => (
                      <td
                        key={fieldKey}
                        style={{
                          padding: "10px",
                          borderRight: "1px solid #eee",
                        }}
                      >
                        {(() => {
                          // Get value from record
                          const value = record[fieldKey];
                          return value !== undefined &&
                            value !== null &&
                            value !== ""
                            ? String(value)
                            : "N/A";
                        })()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="download-results-wrapper">
      <div className="download-results-container">
        {/* Header */}
        <div className="header-section">
          <h1 className="main-title" style={{ color: "black" }}>
            📊 Lab Data Report Generator
          </h1>
          <p className="subtitle">
            Select a lab and fields to generate your report
          </p>
        </div>

        {/* Main Card */}
        <div className="main-card">
          {/* Select Inputs Row */}
          <div className="select-inputs-row">
            {/* First Select: Labs */}
            <div className="select-wrapper" ref={labDropdownRef}>
              <label className="select-label">Select Lab *</label>
              <div className="custom-select">
                <div
                  className={`select-toggle ${selectedLab ? "selected" : ""}`}
                  onClick={() => setShowLabDropdown(!showLabDropdown)}
                >
                  <span className="select-value">
                    {selectedLab
                      ? `${selectedLab.labname} (${selectedLab.location})`
                      : "Choose a lab..."}
                  </span>
                  <span className="select-icon">▼</span>
                </div>

                {showLabDropdown && (
                  <div className="dropdown-menu">
                    {labs.length === 0 ? (
                      <div className="dropdown-empty">No labs available</div>
                    ) : (
                      labs.map((lab, idx) => (
                        <div
                          key={idx}
                          className="dropdown-option"
                          onClick={() => handleLabSelect(lab)}
                        >
                          <div className="option-name">{lab.labname}</div>
                          <div className="option-location">{lab.location}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Second Select: Fields (with Checkboxes) */}
            <div className="select-wrapper" ref={fieldsDropdownRef}>
              <label className="select-label">Select Fields *</label>
              <div
                className={`custom-select ${!selectedLab ? "disabled" : ""}`}
              >
                <div
                  className={`select-toggle ${
                    selectedCount > 0 ? "selected" : ""
                  } ${!selectedLab ? "disabled" : ""}`}
                  onClick={() =>
                    selectedLab && setShowFieldsDropdown(!showFieldsDropdown)
                  }
                >
                  <span className="select-value">
                    {selectedCount > 0
                      ? `${selectedCount} field${selectedCount > 1 ? "s" : ""} selected`
                      : "Select fields..."}
                  </span>
                  <span className="select-icon">▼</span>
                </div>

                {showFieldsDropdown && selectedLab && (
                  <div className="dropdown-menu fields-dropdown-menu">
                    {/* Select All Option */}
                    <div
                      style={{
                        padding: "12px 16px",
                        borderBottom: "2px solid #e5e7eb",
                        backgroundColor: "#f0f4ff",
                        position: "sticky",
                        top: 0,
                        zIndex: 20,
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          cursor: "pointer",
                          fontWeight: 700,
                          color: "#667eea",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={
                            selectedCount ===
                              Object.keys(selectedFields).length &&
                            selectedCount > 0
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                            accentColor: "#667eea",
                          }}
                        />
                        <span>Select All Fields</span>
                      </label>
                    </div>

                    {Object.entries(
                      dynamicFieldDefinitions || fieldDefinitions,
                    ).map(([section, fields]) => (
                      <div key={section} className="dropdown-section">
                        <div className="section-title">{section}</div>
                        {section === "🧪 Lab Test" && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#666",
                              padding: "4px 8px",
                              marginBottom: "6px",
                              fontStyle: "italic",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            📌 Testing Types:{" "}
                            {getLabTestingTypes(selectedLab).length > 0
                              ? getLabTestingTypes(selectedLab).join(", ")
                              : "No tests configured"}
                          </div>
                        )}
                        <div className="section-fields">
                          {fields.map((field) => (
                            <label key={field.key} className="checkbox-option">
                              <input
                                type="checkbox"
                                checked={selectedFields[field.key] || false}
                                onChange={() => handleFieldToggle(field.key)}
                                className="checkbox-input"
                              />
                              <span className="checkbox-text">
                                {field.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Button */}
          {selectedLab && selectedCount > 0 && (
            <button className="btn-show-result" onClick={handleShowResult}>
              ✓ Show Result
            </button>
          )}
        </div>

        {/* Results Section */}
        {results && (
          <div className="results-card" style={{ marginTop: "30px" }}>
            <div className="results-header">
              <h2>📋 Results</h2>
              <div className="lab-info-badge">
                <span className="badge-text">{selectedLab.labname}</span>
                <span className="badge-location">{selectedLab.location}</span>
              </div>
            </div>

            <div className="results-by-section">
              {/* Lab Info - Always show */}
              {renderTableSection(
                "Lab Info",
                results.organizedResults["Lab Info"],
                results.checkedFields.filter(
                  (f) => getFieldSection(f) === "Lab Info",
                ),
              )}

              {/* Lab Test - Using special two-row layout */}
              {renderLabTestSection(
                "🧪 Lab Test Entries",
                results.organizedResults["🧪 Lab Test"],
                results.checkedFields.filter(
                  (f) => getFieldSection(f) === "🧪 Lab Test",
                ),
              )}

              {/* Scientists - Always show */}
              {renderTableSection(
                "🔬 Scientists",
                results.organizedResults["🔬 Scientist"],
                results.checkedFields.filter(
                  (f) => getFieldSection(f) === "🔬 Scientist",
                ),
              )}

              {/* Instruments - Always show */}
              {renderTableSection(
                "⚙️ Instruments",
                results.organizedResults["⚙️ Instrument"],
                results.checkedFields.filter(
                  (f) => getFieldSection(f) === "⚙️ Instrument",
                ),
              )}

              {/* Raw Materials - Always show */}
              {renderTableSection(
                "📦 Raw Materials",
                results.organizedResults["📦 Raw Material"],
                results.checkedFields.filter(
                  (f) => getFieldSection(f) === "📦 Raw Material",
                ),
              )}
            </div>

            <div
              style={{ display: "flex", gap: "12px", justifyContent: "center" }}
            >
              <button
                className="btn-show-result"
                onClick={generatePDFReport}
                style={{
                  background:
                    "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                }}
              >
                🖨️ Print Result (PDF)
              </button>
              <button className="btn-reset" onClick={handleReset}>
                ← Back to Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
