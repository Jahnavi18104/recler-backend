const mongoose = require("mongoose");

const datasetFileSchema = new mongoose.Schema({
  datasetId: String,
  fileName: String,
  filePath: String,
  description: String, // ✅ Ensure this exists
});

const DatasetFile = mongoose.model("DatasetFile", datasetFileSchema);

module.exports = DatasetFile;
