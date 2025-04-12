// const mongoose = require("mongoose");

// const datasetFileSchema = new mongoose.Schema({
//   datasetId: String,
//   fileName: String,
//   filePath: String,
//   description: String, // ✅ Ensure this exists
// });

// const DatasetFile = mongoose.model("DatasetFile", datasetFileSchema);

// module.exports = DatasetFile;






const datasetSchema = new mongoose.Schema({
  datasetId: String,
  fileName: String,         // original name
  storedName: String,       // multer name
  filePath: String,
});
const Dataset = mongoose.model("Dataset", datasetSchemaFull);






// const datasetSchemaFull = new mongoose.Schema({
//   name: String,
//   description: String,
//   category: String,
//   file: {
//     originalName: String,
//     storedName: String,
//   },
// });

// const Dataset = mongoose.model("Dataset", datasetSchemaFull);
