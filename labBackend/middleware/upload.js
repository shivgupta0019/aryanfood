const multer = require("multer");
const path = require("path");
const fs = require("fs");

const productUploadDir = path.join(__dirname, "../uploads/products");
const profileUploadDir = path.join(__dirname, "../uploads/profile");

for (const dir of [productUploadDir, profileUploadDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const createStorage = (destinationDir) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, destinationDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const productUpload = multer({
  storage: createStorage(productUploadDir),
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const imageUpload = multer({
  storage: createStorage(profileUploadDir),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {
  productUpload,
  imageUpload,
};
