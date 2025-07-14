const mongoose = require("mongoose");
const ExcelDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filename: String,
  data: [{}],
  uploadedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("ExcelData", ExcelDataSchema);

