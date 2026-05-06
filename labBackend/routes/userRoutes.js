const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/userController");
const {
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  getUsers,
  updateUserRole,
  toggleAdmin,
  logout,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  adminTrf,
  allTrf,
  getTrfById,
  updateTrf,
  deleteTrf,
  getTrfForUserFill,
  fillTrfValues,
  getFilledTrfs,
  submitTrf,
  getPendingTrfs,
  getSubmittedTrfs,
} = require("../controllers/useTrf");

const {
  allCompanies,
  getAllCompanies,
  updateCompany,
  deleteCompany,
  allLabs,
  getAllLabs,
  updateLab,
  deleteLab,
  createProducts,
  deleteProduct,
  getAllProducts,
  getAllTest,
  createTest,
  addPdfToProduct,
  deletePdfFromProduct,
} = require("../controllers/useAdminLab");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");
const profileMiddleware = require("../middleware/profileMiddleware");
const { productUpload, imageUpload } = require("../middleware/upload");

router.post("/signup", signup);
router.post("/login", login);

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/users", authMiddleware, getUsers);
router.put("/users/:id/role", authMiddleware, updateUserRole);
router.post("/toggle-admin", authMiddleware, toggleAdmin);

router.get("/profile", profileMiddleware, (req, res, next) => {
  res.set("Cache-Control", "no-store"); 
  next();
}, getProfile);
router.put("/profile", profileMiddleware, imageUpload.single("photo"), updateProfile);

///logout
router.post("/logout", authMiddleware, logout);

//lab routes
router.post("/companies", allCompanies);
router.get("/getCompanies", getAllCompanies);
router.put("/companies/:id", updateCompany);
router.delete("/companies/:id", deleteCompany);
router.post("/labs", allLabs);
router.get("/labs", getAllLabs);
router.put("/labs/:id", updateLab);
router.delete("/labs/:id", deleteLab);
router.post("/products", createProducts);
router.get("/products", getAllProducts);
router.delete("/products/:id", deleteProduct);
// PDF routes
router.put("/products/:id/pdf", productUpload.single("pdfFile"), addPdfToProduct);
router.delete("/products/:id/pdf", deletePdfFromProduct);
router.get("/tests", getAllTest);
router.post("/create-test", createTest);


//trf
router.post("/trf", adminTrf);
router.get("/trf", allTrf);
router.get("/trf/filled", getFilledTrfs);
router.get("/trf/pending", getPendingTrfs);
router.get("/trf/submitted", getSubmittedTrfs);

//  Specific routes BEFORE parameterized routes
router.get("/trf/user/:id", getTrfForUserFill);
router.patch("/trf/:id/fill", fillTrfValues);
router.post("/trf/:id/submit", submitTrf);

// Parameterized routes LAST
router.get("/trf/:id", getTrfById);
router.put("/trf/:id", updateTrf);
router.delete("/trf/:id", deleteTrf);

module.exports = router;
