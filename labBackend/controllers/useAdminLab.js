// routes/companies.js
const oracledb = require("oracledb");
const path = require("path");
const fs = require("fs");
const { dbConfig } = require("../config/db");
// Oracle DB connection pool (configure once in app.js)
// Assume pool is available as req.app.locals.pool or similar
// Helper to fetch all products including PDF fields
async function getAllProductsWithPdf(connection) {
  const sql = `
    SELECT 
      p.id, p.product_name, p.product_id, p.pdf_path, p.pdf_original_name,
      p.created_at, p.updated_at,
      ptr.test_id, ptr.field_id, ptr.min_value, ptr.max_value, ptr.unit, ptr.custom_label, ptr.is_custom,
      t.test_name,
      tf.field_name AS predefined_field_name, tf.label
    FROM product p
    LEFT JOIN product_test_ranges ptr ON p.id = ptr.product_id
    LEFT JOIN tests t ON ptr.test_id = t.id
    LEFT JOIN test_fields tf ON ptr.field_id = tf.id
    ORDER BY p.id DESC
  `;
  const result = await connection.execute(sql, [], {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  });

  const productsMap = new Map();
  for (const row of result.rows) {
    const id = row.ID;
    if (!productsMap.has(id)) {
      productsMap.set(id, {
        id: row.ID,
        productName: row.PRODUCT_NAME,
        productId: row.PRODUCT_ID,
        pdf_path: row.PDF_PATH,
        pdf_original_name: row.PDF_ORIGINAL_NAME,
        savedAt: row.UPDATED_AT || row.CREATED_AT,
        testRanges: [],
      });
    }
    const product = productsMap.get(id);
    if (row.TEST_ID) {
      let testEntry = product.testRanges.find(
        (tr) => tr.testId === row.TEST_ID,
      );
      if (!testEntry) {
        testEntry = {
          testId: row.TEST_ID,
          testName: row.TEST_NAME,
          fields: [],
        };
        product.testRanges.push(testEntry);
      }
      testEntry.fields.push({
        fieldId: row.FIELD_ID,
        fieldName: row.IS_CUSTOM ? row.CUSTOM_LABEL : row.PREDEFINED_FIELD_NAME,
        label: row.LABEL,
        minValue: row.MIN_VALUE,
        maxValue: row.MAX_VALUE,
        unit: row.UNIT,
        isCustom: row.IS_CUSTOM === 1,
        customLabel: row.CUSTOM_LABEL,
      });
    }
  }
  return Array.from(productsMap.values());
}

exports.getProductRanges = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      SELECT 
        t.test_name,
        ptr.field_id,
        CASE WHEN ptr.is_custom = 1 THEN ptr.custom_label ELSE tf.field_name END AS field_name,
        CASE WHEN ptr.is_custom = 1 THEN ptr.custom_label ELSE tf.label END AS label,
        ptr.min_value, 
        ptr.max_value, 
        ptr.unit
      FROM product_test_ranges ptr
      JOIN tests t ON t.id = ptr.test_id
      LEFT JOIN test_fields tf ON tf.id = ptr.field_id
      WHERE ptr.product_id = :productId
    `;
    const result = await connection.execute(
      sql,
      { productId },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      },
    );

    // Group by test_name
    const testRanges = [];
    const map = new Map();
    for (const row of result.rows) {
      const testName = row.TEST_NAME;
      if (!map.has(testName)) {
        map.set(testName, { testName, fields: [] });
      }
      map.get(testName).fields.push({
        fieldId: row.FIELD_ID,
        fieldName: row.FIELD_NAME,
        label: row.LABEL, // ✅ added label
        minValue: row.MIN_VALUE,
        maxValue: row.MAX_VALUE,
        unit: row.UNIT,
      });
    }
    res.json({ testRanges: Array.from(map.values()) });
  } catch (err) {
    console.error("Error fetching product ranges:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};
exports.updateProductRanges = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const { productName, testRanges } = req.body; // ← productName added

  if (isNaN(productId)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // 1. Check product exists
    const productCheck = await connection.execute(
      `SELECT id FROM product WHERE id = :id`,
      { id: productId },
    );
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    await connection.execute(`BEGIN NULL; END;`, [], { autoCommit: false });

    // 2. Update product name if provided
    if (productName && productName.trim()) {
      await connection.execute(
        `UPDATE product SET product_name = :name, updated_at = CURRENT_TIMESTAMP WHERE id = :id`,
        { name: productName.trim(), id: productId },
        { autoCommit: false },
      );
      console.log(
        `Updated product name to "${productName}" for ID ${productId}`,
      );
    }

    // 3. Delete old ranges
    const delResult = await connection.execute(
      `DELETE FROM product_test_ranges WHERE product_id = :id`,
      { id: productId },
      { autoCommit: false },
    );
    console.log(`Deleted ${delResult.rowsAffected} old range records`);

    // 4. Insert new ranges
    if (testRanges && Array.isArray(testRanges)) {
      for (const tr of testRanges) {
        // Get test_id from test_name
        const testIdResult = await connection.execute(
          `SELECT id FROM tests WHERE test_name = :testName`,
          { testName: tr.testName },
        );
        if (testIdResult.rows.length === 0) {
          console.warn(`Test "${tr.testName}" not found – skipping`);
          continue;
        }
        const testId = testIdResult.rows[0][0];

        for (const f of tr.fields) {
          let fieldId = null;
          let customLabelValue = null;

          if (f.isCustom) {
            customLabelValue = f.customLabel || f.fieldName;
          } else {
            // Predefined field – lookup field_id
            let fieldIdResult = await connection.execute(
              `SELECT id FROM test_fields WHERE test_id = :testId AND field_name = :fieldName`,
              { testId, fieldName: f.fieldName },
            );
            if (fieldIdResult.rows.length === 0) {
              fieldIdResult = await connection.execute(
                `SELECT id FROM test_fields WHERE test_id = :testId AND label = :label`,
                { testId, label: f.fieldName },
              );
            }
            if (fieldIdResult.rows.length > 0) {
              fieldId = fieldIdResult.rows[0][0];
            } else {
              console.warn(
                `Field "${f.fieldName}" not found for test "${tr.testName}" – skipping`,
              );
              continue;
            }
          }

          await connection.execute(
            `INSERT INTO product_test_ranges 
             (product_id, test_id, field_id, custom_label, min_value, max_value, unit, is_custom)
             VALUES (:pid, :tid, :fid, :customLabel, :minv, :maxv, :unit, :isCustom)`,
            {
              pid: productId,
              tid: testId,
              fid: fieldId,
              customLabel: customLabelValue,
              minv: f.minValue || null,
              maxv: f.maxValue || null,
              unit: f.unit || null,
              isCustom: f.isCustom ? 1 : 0,
            },
            { autoCommit: false },
          );
        }
      }
    }

    await connection.commit();
    console.log(`Successfully updated product ${productId} (name + ranges)`);

    // 5. Return updated product list
    const allProducts = await getAllProductsWithPdf(connection);
    res.status(200).json({
      message: "Product name and ranges updated successfully",
      allProducts,
    });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Error in updateProductRanges:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};
// Testing Table CRUD Oprations
exports.createTest = async (req, res) => {
  let connection;
  try {
    const { test_name, fields } = req.body;

    if (!test_name || !fields || fields.length === 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    connection = await oracledb.getConnection(dbConfig);

    // 🔹 Step 1: Insert Test
    const insertTestSql = `
      INSERT INTO tests (test_name)
      VALUES (:test_name)
      RETURNING id INTO :id
    `;

    const result = await connection.execute(
      insertTestSql,
      {
        test_name,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: false },
    );

    const testId = result.outBinds.id[0];

    // 🔹 Step 2: Insert Fields
    for (const field of fields) {
      await connection.execute(
        `
        INSERT INTO test_fields (test_id, field_name, label, placeholder)
        VALUES (:test_id, :field_name, :label, :placeholder)
        `,
        {
          test_id: testId,
          field_name: field.name,
          label: field.label,
          placeholder: field.placeholder || "",
        },
        { autoCommit: false },
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Test created successfully",
      testId,
    });
  } catch (err) {
    console.error(err);
    if (connection) await connection.rollback();
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};
exports.getAllTest = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const selectSql = `
      SELECT 
        t.id,
        t.test_name,
        f.field_name,
        f.label,
        f.placeholder
      FROM test_fields f
      JOIN tests t ON f.test_id = t.id
      ORDER BY t.test_name
    `;

    const result = await connection.execute(selectSql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const TESTING_FIELDS = {};

    result.rows.forEach((row) => {
      const testName = row.TEST_NAME; // ✅ correct
      const field = {
        id: row.ID,
        name: row.FIELD_NAME,
        label: row.LABEL,
        placeholder: row.PLACEHOLDER,
      };

      if (!TESTING_FIELDS[testName]) {
        TESTING_FIELDS[testName] = [];
      }

      TESTING_FIELDS[testName].push(field);
    });

    res.status(200).json({
      message: "Data fetched successfully",
      TESTING_FIELDS,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

// Product Table CRUD Oprations
exports.deletePdfFromProduct = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const selectSql = `SELECT pdf_path FROM product WHERE id = :id`;
    const result = await connection.execute(selectSql, [productId], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const pdfPath = result.rows[0].PDF_PATH;
    if (pdfPath) {
      const fullPath = path.join(__dirname, "../", pdfPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    const updateSql = `UPDATE product SET pdf_path = NULL, pdf_original_name = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = :id`;
    await connection.execute(updateSql, [productId], { autoCommit: true });

    const allProducts = await getAllProductsWithPdf(connection);
    res.status(200).json({ message: "PDF deleted successfully", allProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete PDF" });
  } finally {
    if (connection) await connection.close();
  }
};
exports.addPdfToProduct = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No PDF file uploaded" });

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Check if product exists and get old PDF
    const checkSql = `SELECT pdf_path FROM product WHERE id = :id`;
    const checkResult = await connection.execute(checkSql, [productId], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete old PDF if exists (optional: replace)
    const oldPath = checkResult.rows[0].PDF_PATH;
    if (oldPath) {
      const fullOldPath = path.join(__dirname, "../", oldPath);
      if (fs.existsSync(fullOldPath)) fs.unlinkSync(fullOldPath);
    }

    const pdfPath = `/uploads/products/${file.filename}`;
    const pdfOriginalName = file.originalname;

    const updateSql = `
            UPDATE product
            SET pdf_path = :path, pdf_original_name = :name, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        `;
    await connection.execute(
      updateSql,
      {
        path: pdfPath,
        name: pdfOriginalName,
        id: productId,
      },
      { autoCommit: true },
    );

    const allProducts = await getAllProductsWithPdf(connection);
    res.status(200).json({ message: "PDF added successfully", allProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add PDF" });
  } finally {
    if (connection) await connection.close();
  }
};
exports.deleteProduct = async (req, res) => {
  const productIdNum = parseInt(req.params.id, 10);
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // First get pdf_path if exists
    const selectPdf = `SELECT pdf_path FROM product WHERE id = :id`;
    const pdfResult = await connection.execute(selectPdf, [productIdNum], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    const pdfPath = pdfResult.rows[0]?.PDF_PATH;

    // Delete product
    const deleteSql = `DELETE FROM product WHERE id = :id`;
    const result = await connection.execute(deleteSql, [productIdNum], {
      autoCommit: true,
    });
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Delete PDF file if exists
    if (pdfPath) {
      const fullPath = path.join(__dirname, "../", pdfPath); // adjust relative path
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    const allProducts = await getAllProductsWithPdf(connection);
    res
      .status(200)
      .json({ message: "Product deleted successfully", allProducts });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

exports.getAllProducts = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const allProducts = await getAllProductsWithPdf(connection);
    res.status(200).json({ allProducts }); // status 200 is more appropriate
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) await connection.close();
  }
};

exports.createProducts = async (req, res) => {
  const { productName, productId, testRanges } = req.body;

  if (!productName?.trim())
    return res.status(400).json({ error: "Product Name required." });
  if (!productId?.trim())
    return res.status(400).json({ error: "Product ID required." });

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    await connection.execute(`BEGIN NULL; END;`, [], { autoCommit: false });

    // Insert product
    const insertSql = `
      INSERT INTO product (product_name, product_id)
      VALUES (:productName, :productId)
      RETURNING id, created_at INTO :outId, :outCreatedAt
    `;
    const result = await connection.execute(
      insertSql,
      {
        productName: productName.trim(),
        productId: productId.trim(),
        outId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        outCreatedAt: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
      },
      { autoCommit: false },
    );
    const newProductId = result.outBinds.outId[0];

    // Insert test ranges if provided
    if (testRanges && Array.isArray(testRanges)) {
      for (const tr of testRanges) {
        // tr.testName is the name (e.g., "Chemical Analysis")
        const testIdResult = await connection.execute(
          `SELECT id FROM tests WHERE test_name = :testName`,
          { testName: tr.testName },
        );
        if (testIdResult.rows.length === 0) {
          throw new Error(`Test "${tr.testName}" not found`);
        }
        const testId = testIdResult.rows[0][0];

        const fields = tr.fields || [];
        for (const f of fields) {
          // For predefined fields, field_name is used; for custom, field_name is custom field name
          let fieldId = null;
          if (f.isCustom !== true) {
            // predefined – get field_id from test_fields table
            const fieldIdResult = await connection.execute(
              `SELECT id FROM test_fields WHERE test_id = :testId AND field_name = :fieldName`,
              { testId, fieldName: f.fieldName },
            );
            if (fieldIdResult.rows.length > 0) {
              fieldId = fieldIdResult.rows[0][0];
            } else {
              // Custom fields may not exist in test_fields – we store custom_label directly
              // For custom, we set fieldId = null and store custom_label
            }
          }

          await connection.execute(
            `INSERT INTO product_test_ranges 
             (product_id, test_id, field_id, custom_label, min_value, max_value, unit, is_custom)
             VALUES (:pid, :tid, :fid, :customLabel, :minv, :maxv, :unit, :isCustom)`,
            {
              pid: newProductId,
              tid: testId,
              fid: fieldId,
              customLabel: f.isCustom ? f.fieldName : null,
              minv: f.minValue || null,
              maxv: f.maxValue || null,
              unit: f.unit || null,
              isCustom: f.isCustom ? 1 : 0,
            },
            { autoCommit: false },
          );
        }
      }
    }

    await connection.commit();

    const allProducts = await getAllProductsWithPdf(connection);
    res.status(201).json({ message: "Product saved", allProducts });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) await connection.close();
  }
};
// Lab Table CRUD Oprations
exports.deleteLab = async (req, res) => {
  const labId = parseInt(req.params.id, 10);

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const deleteSql = `DELETE FROM lab WHERE id = :id`;
    const result = await connection.execute(deleteSql, [labId], {
      autoCommit: true,
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Lab not found." });
    }

    // Fetch all remaining labs (latest first)
    const selectSql = `
      SELECT *
      FROM lab
      ORDER BY id DESC
    `;
    const allRows = await connection.execute(selectSql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const allLabs = allRows.rows.map((row) => ({
      id: row.ID,
      labCode: row.LAB_CODE,
      labName: row.LAB_NAME,
      gst: row.GST,
      address: row.ADDRESS,
      phone: row.PHONE,
      adminName: row.ADMIN_NAME,
      labType: row.LAB_TYPE,
      savedAt: row?.UPDATED_AT || row?.CREATED_AT,
    }));

    res.status(200).json({
      message: "Lab deleted successfully",
      allLabs,
    });
  } catch (err) {
    console.error("Error deleting lab:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error(e);
      }
    }
  }
};

exports.updateLab = async (req, res) => {
  const labId = parseInt(req.params.id, 10);
  const { labName, gst, address, phone, adminName, labType, labCode } =
    req.body;

  // Validation
  if (!labName || !labName.trim()) {
    return res.status(400).json({ error: "Lab Name is required." });
  }
  if (!labType || !["internal", "thirdparty"].includes(labType)) {
    return res
      .status(400)
      .json({ error: "Valid lab type (internal/thirdparty) is required." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const updateSql = `
      UPDATE lab
      SET lab_name = :labName,
          gst = :gst,
          address = :address,
          phone = :phone,
          admin_name = :adminName,
          lab_type = :labType,
          lab_code = :labCode,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      RETURNING created_at INTO :outCreatedAt
    `;

    const result = await connection.execute(
      updateSql,
      {
        id: labId,
        labName: labName.trim(),
        gst: gst || null,
        address: address || null,
        phone: phone || null,
        adminName: adminName || null,
        labType: labType,
        labCode: labCode ? labCode.trim() : null,
        outCreatedAt: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
      },
      { autoCommit: true },
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Lab not found." });
    }

    // Fetch all labs (latest first) to return fresh list
    const selectSql = `
      SELECT *
      FROM lab
      ORDER BY id DESC
    `;
    const allRows = await connection.execute(selectSql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const allLabs = allRows.rows.map((row) => ({
      id: row.ID,
      labCode: row.LAB_CODE,
      labName: row.LAB_NAME,
      gst: row.GST,
      address: row.ADDRESS,
      phone: row.PHONE,
      adminName: row.ADMIN_NAME,
      labType: row.LAB_TYPE,
      savedAt: row?.UPDATED_AT || row?.CREATED_AT,
    }));

    res.status(200).json({
      message: "Lab updated successfully",
      allLabs,
    });
  } catch (err) {
    console.error("Error updating lab:", err);
    if (err.errorNum === 1) {
      // ORA-00001: unique constraint (lab_code)
      return res.status(409).json({ error: "Lab Code already exists." });
    }
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error(e);
      }
    }
  }
};

exports.getAllLabs = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Fetch all labs (ordered latest first)
    const selectSql = `
      SELECT *
      FROM lab
      ORDER BY id DESC
    `;
    const allRows = await connection.execute(selectSql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const allLabs = allRows.rows.map((row) => ({
      id: row.ID,
      labCode: row.LAB_CODE,
      labName: row.LAB_NAME,
      gst: row.GST,
      address: row.ADDRESS,
      phone: row.PHONE,
      adminName: row.ADMIN_NAME,
      labType: row.LAB_TYPE,
      savedAt: row?.UPDATED_AT || row?.CREATED_AT,
    }));

    res.status(201).json({
      message: "Lab saved successfully",

      allLabs,
    });
  } catch (err) {
    console.error("Error saving lab:", err);
    if (err.errorNum === 1) {
      // ORA-00001: unique constraint (lab_code)
      return res
        .status(409)
        .json({ error: "Lab Code already exists. Please regenerate." });
    }
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error(e);
      }
    }
  }
};
exports.allLabs = async (req, res) => {
  const { labName, gst, address, phone, adminName, labType, labCode } =
    req.body;

  // Validation
  if (!labName || !labName.trim()) {
    return res.status(400).json({ error: "Lab Name is required." });
  }
  if (!labCode || !labCode.trim()) {
    return res.status(400).json({ error: "Lab Code is required." });
  }
  if (!labType || !["internal", "thirdparty"].includes(labType)) {
    return res
      .status(400)
      .json({ error: "Valid lab type (internal/thirdparty) is required." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    const insertSql = `
      INSERT INTO lab (lab_name, gst, address, phone, admin_name, lab_type, lab_code)
      VALUES (:labName, :gst, :address, :phone, :adminName, :labType, :labCode)
      RETURNING id, created_at INTO :outId, :outCreatedAt
    `;

    const result = await connection.execute(
      insertSql,
      {
        labName: labName.trim(),
        gst: gst || null,
        address: address || null,
        phone: phone || null,
        adminName: adminName || null,
        labType: labType, // matches frontend field name
        labCode: labCode.trim(),
        outId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        outCreatedAt: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
      },
      { autoCommit: true },
    );

    const newLab = {
      id: result.outBinds.outId[0],
      labCode: labCode.trim(),
      labName: labName.trim(),
      gst: gst || "",
      address: address || "",
      phone: phone || "",
      adminName: adminName || "",
      labType: labType,
      savedAt: result.outBinds.outCreatedAt[0]
        ? new Date(result.outBinds.outCreatedAt[0]).toLocaleString()
        : new Date().toLocaleString(),
    };

    // Fetch all labs (ordered latest first)
    const selectSql = `
      SELECT *
      FROM lab
      ORDER BY id DESC
    `;
    const allRows = await connection.execute(selectSql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const allLabs = allRows.rows.map((row) => ({
      id: row.ID,
      labCode: row.LAB_CODE,
      labName: row.LAB_NAME,
      gst: row.GST,
      address: row.ADDRESS,
      phone: row.PHONE,
      adminName: row.ADMIN_NAME,
      labType: row.LAB_TYPE,
      savedAt: row?.UPDATED_AT || row?.CREATED_AT,
    }));

    res.status(201).json({
      message: "Lab saved successfully",
      newLab,
      allLabs,
    });
  } catch (err) {
    console.error("Error saving lab:", err);
    if (err.errorNum === 1) {
      // ORA-00001: unique constraint (lab_code)
      return res
        .status(409)
        .json({ error: "Lab Code already exists. Please regenerate." });
    }
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error(e);
      }
    }
  }
};

// Company Table CRUD Oprations

exports.deleteCompany = async (req, res) => {
  const companyId = parseInt(req.params.id, 10);

  // Validate ID
  if (isNaN(companyId)) {
    return res.status(400).json({ error: "Invalid company ID." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // ✅ Fix: use object for named bind parameter
    const deleteSql = `DELETE FROM company WHERE id = :id`;
    const result = await connection.execute(
      deleteSql,
      { id: companyId },
      { autoCommit: true },
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Company not found." });
    }

    // Fetch remaining companies (latest first)
    const selectSql = `
      SELECT *
      FROM company
      ORDER BY id DESC
    `;
    const allRows = await connection.execute(selectSql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    const allCompanies = allRows.rows.map((row) => ({
      id: row.ID,
      companyCode: row.COMPANY_CODE,
      companyName: row.COMPANY_NAME,
      gst: row.GST,
      address: row.ADDRESS,
      phone: row.PHONE,
      adminName: row.ADMIN_NAME,
      savedAt: row.UPDATED_AT || row.CREATED_AT, // ensure column names exist
    }));

    res.status(200).json({
      message: "Company deleted successfully",
      allCompanies,
    });
  } catch (err) {
    console.error("Error deleting company:", err);

    // Optionally handle specific Oracle errors (e.g., foreign key constraint)
    if (err.errorNum === 2292) {
      // ORA-02292: integrity constraint violated
      return res.status(409).json({
        error: "Cannot delete company because it has related records.",
      });
    }

    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error(e);
      }
    }
  }
};

exports.updateCompany = async (req, res) => {
  const companyId = parseInt(req.params.id, 10);
  const { companyName, gst, address, phone, adminName, companyCode } = req.body;

  if (!companyName || !companyName.trim()) {
    return res.status(400).json({ error: "Company Name is required." });
  }
  if (!companyCode || !companyCode.trim()) {
    return res.status(400).json({ error: "Company Code is required." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Update the company
    const updateSql = `
      UPDATE company
      SET company_name = :companyName,
          gst = :gst,
          address = :address,
          phone = :phone,
          admin_name = :adminName,
          company_code = :companyCode,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = :id
      RETURNING created_at INTO :outCreatedAt
    `;

    const result = await connection.execute(
      updateSql,
      {
        id: companyId,
        companyName: companyName.trim(),
        gst: gst || null,
        address: address || null,
        phone: phone || null,
        adminName: adminName || null,
        companyCode: companyCode.trim(),
        outCreatedAt: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
      },
      { autoCommit: true },
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Company not found." });
    }

    // Fetch all companies (latest first)
    const selectSql = `
      SELECT *
      FROM company
      ORDER BY id DESC
    `;
    const allRows = await connection.execute(selectSql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    const allCompanies = allRows.rows.map((row) => ({
      id: row.ID,
      companyCode: row.COMPANY_CODE,
      companyName: row.COMPANY_NAME,
      gst: row.GST,
      address: row.ADDRESS,
      phone: row.PHONE,
      adminName: row.ADMIN_NAME,
      savedAt: row?.UPDATED_AT || row?.CREATED_AT,
    }));

    res.status(200).json({
      message: "Company updated successfully",
      allCompanies,
    });
  } catch (err) {
    console.error("Error updating company:", err);
    if (err.errorNum === 1) {
      return res.status(409).json({ error: "Company Code already exists." });
    }
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error(e);
      }
    }
  }
};

exports.getAllCompanies = async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Fetch all companies (latest first)
    const selectSql = `
      SELECT *
      FROM company
      ORDER BY id DESC
    `;
    const allRows = await connection.execute(selectSql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const allCompanies = allRows.rows.map((row) => ({
      id: row?.ID,
      companyCode: row?.COMPANY_CODE,
      companyName: row?.COMPANY_NAME,
      gst: row?.GST,
      address: row?.ADDRESS,
      phone: row?.PHONE,
      adminName: row?.ADMIN_NAME,
      savedAt: row?.UPDATED_AT || row?.CREATED_AT,
    }));

    res.status(201).json({
      message: "Company saved successfully",

      allCompanies,
    });
  } catch (err) {
    console.error("Error saving company:", err);
    if (err.errorNum === 1) {
      // ORA-00001: unique constraint violated
      return res
        .status(409)
        .json({ error: "Company Code already exists. Please regenerate." });
    }
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error(e);
      }
    }
  }
};

exports.allCompanies = async (req, res) => {
  const { companyName, gst, address, phone, adminName, companyCode } = req.body;

  if (!companyName || !companyName.trim()) {
    return res.status(400).json({ error: "Company Name is required." });
  }
  if (!companyCode || !companyCode.trim()) {
    return res.status(400).json({ error: "Company Code is required." });
  }

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // ✅ Separate IN and OUT bind names
    const insertSql = `
      INSERT INTO company (company_name, gst, address, phone, admin_name, company_code)
      VALUES (:companyName, :gst, :address, :phone, :adminName, :companyCode)
      RETURNING id, created_at INTO :outId, :outCreatedAt
    `;

    const result = await connection.execute(
      insertSql,
      {
        // IN binds (simple values)
        companyName: companyName.trim(),
        gst: gst || null,
        address: address || null,
        phone: phone || null,
        adminName: adminName || null,
        companyCode: companyCode.trim(),
        // OUT binds (explicit objects)
        outId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        outCreatedAt: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
      },
      { autoCommit: true },
    );

    const newCompany = {
      id: result.outBinds.outId[0],
      companyCode: companyCode.trim(),
      companyName: companyName.trim(),
      gst: gst || "",
      address: address || "",
      phone: phone || "",
      adminName: adminName || "",
      savedAt: result.outBinds.outCreatedAt[0]
        ? new Date(result.outBinds.outCreatedAt[0]).toLocaleString()
        : new Date().toLocaleString(),
    };

    // Fetch all companies (latest first)
    const selectSql = `
      SELECT *
      FROM company
      ORDER BY id DESC
    `;
    const allRows = await connection.execute(selectSql, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });

    const allCompanies = allRows.rows.map((row) => ({
      id: row?.ID,
      companyCode: row?.COMPANY_CODE,
      companyName: row?.COMPANY_NAME,
      gst: row?.GST,
      address: row?.ADDRESS,
      phone: row?.PHONE,
      adminName: row?.ADMIN_NAME,
      savedAt: row?.UPDATED_AT || row?.CREATED_AT,
    }));

    res.status(201).json({
      message: "Company saved successfully",
      newCompany,
      allCompanies,
    });
  } catch (err) {
    console.error("Error saving company:", err);
    if (err.errorNum === 1) {
      // ORA-00001: unique constraint violated
      return res
        .status(409)
        .json({ error: "Company Code already exists. Please regenerate." });
    }
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (e) {
        console.error(e);
      }
    }
  }
};
