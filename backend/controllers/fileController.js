const File = require("../models/File");
// ✅ backend/controllers/fileController.js
exports.uploadFile = async (req, res) => {
  // your logic
};

exports.getAllUploads = async (req, res) => {
  // your logic
};


exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });

    const newFile = new File({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      user: req.user.id,
    });

    await newFile.save();
    res.status(201).json({ msg: "File uploaded successfully" });
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAllUploads = async (req, res) => {
  try {
    const files = await File.find().populate("user", "email").sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching uploads" });
  }
};
