const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin"); // Add this line
const { uploadFile, getAllUploads } = require("../controllers/fileController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", auth, upload.single("file"), uploadFile);
router.get("/all-uploads", auth, admin, getAllUploads); // Add admin middleware

module.exports = router;
