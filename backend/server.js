



// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const cors = require("cors");
// const path = require("path");
// const bodyParser = require("body-parser");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const app = express();
// const PORT = process.env.PORT || 5000;
// const JWT_SECRET = "your_jwt_secret";

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());
// app.use("/uploads", express.static("uploads"));

// // ✅ Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI || "mongodb+srv://durga210804:Jahnavi333@cluster0.8c8bq.mongodb.net/userDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// // Dataset Schema
// const datasetSchema = new mongoose.Schema({
//   datasetId: String,
//   fileName: String,
//   filePath: String, // Stores the download URL
// });
// const DatasetFile = mongoose.model("DatasetFile", datasetSchema);

// // Set up Multer for file uploads
// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });
// const upload = multer({ storage });

// // ✅ Upload Route
// app.post("/datasets/:id/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const fileDownloadUrl = `/uploads/${req.file.filename}`;

//     const newFile = new DatasetFile({
//       datasetId: req.params.id,
//       fileName: req.file.filename,
//       filePath: fileDownloadUrl,
//     });

//     await newFile.save();
//     res.status(200).json({ message: "✅ File uploaded successfully!", file: newFile });
//   } catch (error) {
//     res.status(500).json({ message: "Server error. Failed to upload file.", error: error.message });
//   }
// });

// // 📌 Check if Dataset Exists
// app.get("/datasets/:id", async (req, res) => {
//   try {
//     const files = await DatasetFile.find({ datasetId: req.params.id });

//     if (files.length > 0) {
//       res.json({ exists: true, files });
//     } else {
//       res.json({ exists: false, files: [] });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching dataset", error: error.message });
//   }
// });

// // 🧠 Dummy getDatasetFromDB for compatibility
// const getDatasetFromDB = async (datasetId) => {
//   return await DatasetFile.find({ datasetId });
// };

// // 📌 Additional Dataset Fetching Route
// app.get("/datasets/:id", async (req, res) => {
//   try {
//     const datasetId = req.params.id;
//     const dataset = await getDatasetFromDB(datasetId);
//     res.set("Cache-Control", "no-store");
//     res.json({ exists: !!dataset.length, files: dataset });
//   } catch (error) {
//     console.error("Error fetching dataset:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // ✅ 🔐 SIGNIN Route (Merged from your second code block)
// app.post("/signin", async (req, res) => {
//   const { name, password } = req.body;

//   if (!name || !password) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     const user = await User.findOne({ name });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials." });
//     }

//     // Compare password (assumes plain-text for now; add bcrypt.compare for hashed)
//     const isMatch = password === user.password; // Use bcrypt.compare if using hashed passwords
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials." });
//     }

//     // Optional: Create JWT
//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

//     res.status(200).json({ message: "Sign-in successful!", token });
//   } catch (err) {
//     console.error("Signin error:", err);
//     res.status(500).json({ message: "Server error during sign-in." });
//   }
// });

// // Register route
// app.post("/register", async (req, res) => {
//   const { name, email, phone, password } = req.body;

//   if (!name || !email || !phone || !password) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     const existingUser = await User.findOne({ name });
//     if (existingUser) {
//       return res.status(409).json({ message: "User already exists." });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (error) {
//     console.error("❌ Registration Error:", error);
//     res.status(500).json({ message: "Server error during registration." });
//   }
// });


// // 🚀 Start Server
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));























require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "your_mongo_uri_here", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Mongoose Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const datasetSchema = new mongoose.Schema({
  datasetId: String,
  originalName: String,   // 👈 original name like iris.csv
  storedName: String,     // 👈 multer filename like 1739....csv
  filePath: String,
});

const DatasetFile = mongoose.model("DatasetFile", datasetSchema);

// Multer Setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized: No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

// Register Route
app.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "✅ User registered successfully!" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// Sign-in Route
app.post("/signin", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "✅ Sign-in successful!", token });
  } catch (err) {
    console.error("❌ Sign-in error:", err);
    res.status(500).json({ message: "Server error during sign-in." });
  }
});

// Upload Route
app.post("/datasets/:id/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const newFile = new DatasetFile({
      datasetId: req.params.id,
      originalName: req.file.originalname,     // ✅ Save readable name like "iris.csv"
      storedName: req.file.filename,           // ✅ Save unique name like "1739....csv"
      filePath: `uploads/${req.file.filename}`,
    });

    await newFile.save();
    res.status(200).json({ message: "✅ File uploaded successfully!", file: newFile });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ message: "Server error. Failed to upload file." });
  }
});



// Get Files by Dataset ID
app.get("/datasets/:id", async (req, res) => {
  try {
    const files = await DatasetFile.find({ datasetId: req.params.id });
    res.set("Cache-Control", "no-store");
    res.json({ exists: files.length > 0, files });
  } catch (error) {
    console.error("❌ Fetch Dataset Error:", error);
    res.status(500).json({ message: "Error fetching dataset" });
  }
});

// Protected File Download Endpoint
app.get("/download/:filename", verifyToken, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath, filename);
});


// ✅ ADDITIONAL SCHEMA + ROUTE YOU REQUESTED

// New Dataset Schema to support display of original file name
const datasetSchemaFull = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  file: {
    originalName: String,
    storedName: String,
  },
});
const Dataset = mongoose.model("Dataset", datasetSchemaFull);

// New Upload Route to save original file name
app.post('/upload', upload.single('file'), async (req, res) => {
  const { originalname, filename } = req.file;

  const dataset = new Dataset({
    name: "Iris Dataset",
    description: "Famous dataset for classification tasks",
    category: "Biology",
    file: {
      originalName: originalname,
      storedName: filename,
    },
  });

  await dataset.save();
  res.json({ success: true, dataset });
});

// Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
