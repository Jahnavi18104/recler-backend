// // Import required modules
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");


// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// // mongoose
// //   .connect("mongodb://127.0.0.1:27017/userDB", {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   })
// //   .then(() => console.log("MongoDB connected"))
// //   .catch((err) => console.error("Error connecting to MongoDB:", err));

// // Define User schema and model
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// // Secret key for JWT
// const JWT_SECRET = "your_jwt_secret";

// // Register endpoint
// app.post("/register", async (req, res) => {
//   const { name, password } = req.body;

//   if (!name || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ name });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash the password and save the new user
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, password: hashedPassword });
//     await newUser.save();

//     res.status(201).json({ message: "Registration successful" });
//   } catch (err) {
//     console.error("Error during registration:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Sign-in endpoint
// app.post("/signin", async (req, res) => {
//   const { name, password } = req.body;

//   if (!name || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     // Find user by name
//     const user = await User.findOne({ name });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Verify the password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate a JWT token
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
//     res.status(200).json({ message: "Signin successful", token });
//   } catch (err) {
//     console.error("Error during signin:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });




// //Jahnavi@333












// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const cors = require("cors");
// const path = require("path");
// const bodyParser = require("body-parser");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const fs = require("fs");

// const app = express();
// const PORT = process.env.PORT || 5000;
// const JWT_SECRET = "your_jwt_secret";

// // ✅ Middleware
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     exposedHeaders: ["Content-Disposition"],
//   })
// );
// app.use(express.json());
// app.use(bodyParser.json());
// app.use("/uploads", express.static("uploads"));

// // ✅ Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/userDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // ✅ User Schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });
// const User = mongoose.model("User", userSchema);

// // ✅ Dataset Schema
// const datasetSchema = new mongoose.Schema({
//   datasetId: String,
//   fileName: String,
//   filePath: String, // Stores the download URL
// });
// const DatasetFile = mongoose.model("DatasetFile", datasetSchema);

// // ✅ Set up Multer for file uploads
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
//     const fileDownloadUrl = `${req.protocol}://${req.get("host")}/download/${req.file.filename}`;
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

// // 📌 Fetch Uploaded Files for a Dataset
// app.get("/files/:datasetId", async (req, res) => {
//   try {
//     const files = await DatasetFile.find({ datasetId: req.params.datasetId });
//     res.json(files);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // 📥 Download File Endpoint (Forces Download)
// app.get("/download/:filename", (req, res) => {
//   const filePath = path.join(__dirname, "uploads", req.params.filename);

//   // ✅ Check if file exists
//   if (!fs.existsSync(filePath)) {
//     return res.status(404).json({ message: "File not found" });
//   }

//   // ✅ Set correct MIME type
//   const mimeType = "application/octet-stream";

//   // ✅ Set Headers to Force Download
//   res.setHeader("Content-Disposition", `attachment; filename="${req.params.filename}"`);
//   res.setHeader("Content-Type", mimeType);
//   res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

//   res.download(filePath, (err) => {
//     if (err) {
//       console.error("❌ Download Error:", err);
//       res.status(500).json({ message: "Error downloading file." });
//     }
//   });
// });

// // 🔑 Register Endpoint
// app.post("/register", async (req, res) => {
//   const { name, password } = req.body;
//   if (!name || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
//   try {
//     const existingUser = await User.findOne({ name });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, password: hashedPassword });
//     await newUser.save();
//     res.status(201).json({ message: "Registration successful" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // 🔑 Sign-in Endpoint
// app.post("/signin", async (req, res) => {
//   const { name, password } = req.body;
//   if (!name || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
//   try {
//     const user = await User.findOne({ name });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
//     res.status(200).json({ message: "Signin successful", token });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Start Server
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


















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
//   .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/userDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
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

//     const fileDownloadUrl = `${req.protocol}://${req.get("host")}/download/${req.file.filename}`;
    
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

// // 📌 Fetch Uploaded Files for a Dataset
// app.get("/files/:datasetId", async (req, res) => {
//   try {
//     console.log("Fetching files for datasetId:", req.params.datasetId);
//     const files = await DatasetFile.find({ datasetId: req.params.datasetId });
//     console.log("Files found:", files);
//     res.json(files);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // 📥 Download File Endpoint (opens file first, then allows download)
// app.get("/download/:filename", (req, res) => {
//   const filePath = path.join(__dirname, "uploads", req.params.filename);
//   res.sendFile(filePath, (err) => {
//     if (err) {
//       res.status(500).json({ message: "Error downloading file." });
//     }
//   });
// });

// // 🔑 Register Endpoint
// app.post("/register", async (req, res) => {
//   const { name, password } = req.body;
//   if (!name || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
//   try {
//     const existingUser = await User.findOne({ name });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, password: hashedPassword });
//     await newUser.save();
//     res.status(201).json({ message: "Registration successful" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // 🔑 Sign-in Endpoint
// app.post("/signin", async (req, res) => {
//   const { name, password } = req.body;
//   if (!name || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
//   try {
//     const user = await User.findOne({ name });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
//     res.status(200).json({ message: "Signin successful", token });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Start Server
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


















// require("dotenv").config(); // Load environment variables
// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const cors = require("cors");
// const path = require("path");
// const bodyParser = require("body-parser");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const fs = require("fs");

// const app = express();
// const PORT = process.env.PORT || 5000;
// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use environment variable

// // ✅ Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.json());
// app.use("/uploads", express.static("uploads")); // Serve uploaded files

// // ✅ Ensure "uploads" directory exists
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   console.log("📂 'uploads' directory not found, creating...");
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // ✅ Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/userDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // ✅ Define User Schema and Model
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   phone: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// // ✅ Define Dataset Schema and Model
// const datasetSchema = new mongoose.Schema({
//   datasetId: String,
//   fileName: String,
//   filePath: String, // Stores the downloadable URL
// });

// const DatasetFile = mongoose.model("DatasetFile", datasetSchema);

// // ✅ Hash Password before saving to DB
// const hashPassword = async (password) => {
//   const salt = await bcrypt.genSalt(10);
//   return bcrypt.hash(password, salt);
// };

// // ✅ Middleware to Verify JWT Token
// const verifyToken = (req, res, next) => {
//   const token = req.headers["authorization"];
//   if (!token) {
//     return res.status(403).json({ message: "Access denied. No token provided." });
//   }

//   jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Invalid token." });
//     }
//     req.user = decoded;
//     next();
//   });
// };

// // ✅ User Registration Route
// app.post("/register", async (req, res) => {
//   try {
//     const { username, email, phone, password } = req.body;

//     // Validate input fields
//     if (!username || !email || !phone || !password) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: "Username already exists." });
//     }

//     // Hash Password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, email, phone, password: hashedPassword });

//     await newUser.save();
//     res.status(201).json({ message: "✅ User registered successfully!" });

//   } catch (error) {
//     console.error("❌ Registration Error:", error);
//     res.status(500).json({ message: "Server error.", error: error.message });
//   }
// });

// // ✅ User Login Route
// app.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).json({ message: "Invalid username or password." });
//     }

//     const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
//     res.json({ message: "✅ Login successful!", token });
//   } catch (error) {
//     console.error("❌ Login Error:", error);
//     res.status(500).json({ message: "Server error." });
//   }
// });

// // ✅ Set up Multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log("📂 Uploading to:", uploadDir);
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     console.log("📄 Storing file:", file.originalname);
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });


// // ✅ Upload File Route (Protected)
// app.post("/datasets/:id/upload", verifyToken, upload.single("file"), async (req, res) => {
//   try {
//     console.log("📌 Upload request for Dataset ID:", req.params.id);
    
//     // Check if a file was received
//     if (!req.file) {
//       console.log("❌ No file uploaded!");
//       return res.status(400).json({ message: "No file uploaded. Ensure you're using 'file' as the key in the request." });
//     }

//     console.log("📁 File received:", req.file);

//     // Generate file download URL
//     const fileDownloadUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

//     // Save to MongoDB
//     const newFile = new DatasetFile({
//       datasetId: req.params.id,
//       fileName: req.file.filename,
//       filePath: fileDownloadUrl,
//     });

//     await newFile.save();
//     console.log("✅ File saved to database:", newFile);
//     res.status(200).json({ message: "✅ File uploaded successfully!", file: newFile });

//   } catch (error) {
//     console.error("❌ Upload Error:", error);
//     res.status(500).json({ message: "Server error. Failed to upload file.", error: error.message });
//   }
// });


// // ✅ Fetch Uploaded Files for a Dataset
// app.get("/files/:datasetId", verifyToken, async (req, res) => {
//   try {
//     const files = await DatasetFile.find({ datasetId: req.params.datasetId });
//     res.json(files);
//   } catch (error) {
//     console.error("❌ Fetch Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // ✅ File Download Endpoint
// app.get("/download/:filename", verifyToken, (req, res) => {
//   const filePath = path.join(uploadDir, req.params.filename);
//   if (!fs.existsSync(filePath)) {
//     return res.status(404).json({ message: "File not found" });
//   }
//   res.download(filePath, (err) => {
//     if (err) {
//       console.error("❌ Download Error:", err);
//       res.status(500).json({ message: "Error downloading file." });
//     }
//   });
// });

// // ✅ Start Server
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));





















// require("dotenv").config(); // Load environment variables
// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const cors = require("cors");
// const path = require("path");
// const fs = require("fs");

// const app = express();

// // ✅ Middleware
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     exposedHeaders: ["Content-Disposition"],
//   })
// );
// app.use(express.json());
// app.use("/uploads", express.static("uploads")); // Serve uploaded files

// // ✅ Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/userDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // ✅ Define Mongoose Schema
// const datasetSchema = new mongoose.Schema({
//   datasetId: String,
//   fileName: String,
//   filePath: String, // Stores the download URL
// });

// const DatasetFile = mongoose.model("DatasetFile", datasetSchema);

// // ✅ Set up Multer for file uploads
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
//     console.log("📌 Upload request for Dataset ID:", req.params.id);
//     console.log("📁 File received:", req.file);

//     if (!req.file) {
//       console.log("❌ No file uploaded!");
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // ✅ Generate the correct download URL
//     const fileDownloadUrl = `${req.protocol}://${req.get("host")}/download/${req.file.filename}`;

//     const newFile = new DatasetFile({
//       datasetId: req.params.id,
//       fileName: req.file.filename,
//       filePath: fileDownloadUrl, // Store the download URL
//     });

//     await newFile.save();
//     console.log("✅ File saved to database:", newFile);
//     res.status(200).json({ message: "✅ File uploaded successfully!", file: newFile });
//   } catch (error) {
//     console.error("❌ Upload Error:", error);
//     res.status(500).json({ message: "Server error. Failed to upload file.", error: error.message });
//   }
// });

// // 📌 Fetch Uploaded Files for a Dataset
// app.get("/files/:datasetId", async (req, res) => {
//   try {
//     const files = await DatasetFile.find({ datasetId: req.params.datasetId });
//     res.json(files);
//   } catch (error) {
//     console.error("❌ Fetch Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // 📥 Download File Endpoint (forces download)
// app.get("/download/:filename", (req, res) => {
//   const filePath = path.join(__dirname, "uploads", req.params.filename);

//   // ✅ Check if file exists
//   if (!fs.existsSync(filePath)) {
//     return res.status(404).json({ message: "❌ File not found" });
//   }

//   // ✅ Set Headers to Force Download
//   res.setHeader("Content-Disposition", `attachment; filename="${req.params.filename}"`);
//   res.setHeader("Content-Type", "application/octet-stream");
//   res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

//   res.download(filePath, (err) => {
//     if (err) {
//       console.error("❌ Download Error:", err);
//       res.status(500).json({ message: "Error downloading file." });
//     }
//   });
// });

// // ✅ Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



























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
//   .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/userDB", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected Successfully"))
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
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
// app.get("/datasets/:id", async (req, res) => {
//   try {
//     const datasetId = req.params.id;
//     const dataset = await getDatasetFromDB(datasetId); // Replace with actual DB function
//     res.set("Cache-Control", "no-store"); // ✅ Prevents caching
//     res.json({ exists: !!dataset, files: dataset ? dataset.files : [] });
//   } catch (error) {
//     console.error("Error fetching dataset:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// // ✅ Upload Route
// app.post("/datasets/:id/upload", upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const fileDownloadUrl = `/uploads/${req.file.filename}`; // Save relative path

//     const newFile = new DatasetFile({
//       datasetId: req.params.id,
//       fileName: req.file.filename,
//       filePath: fileDownloadUrl, // Stores "/uploads/filename"
//     });

//     await newFile.save();
//     res.status(200).json({ message: "✅ File uploaded successfully!", file: newFile });
//   } catch (error) {
//     res.status(500).json({ message: "Server error. Failed to upload file.", error: error.message });
//   }
// });


// // 📥 Download File Endpoint (forces file download)
// app.get("/download/:filename", (req, res) => {
//   const filePath = path.join(__dirname, "uploads", req.params.filename);

//   // Send file as download response
//   res.download(filePath, req.params.filename, (err) => {
//     if (err) {
//       res.status(500).json({ message: "Error downloading file." });
//     }
//   });
// });


// // 📌 Fetch Uploaded Files for a Dataset
// app.get("/files/:datasetId", async (req, res) => {
//   try {
//     console.log("Fetching files for datasetId:", req.params.datasetId);
//     const files = await DatasetFile.find({ datasetId: req.params.datasetId });
//     console.log("Files found:", files);
//     res.json(files);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // 📥 Download File Endpoint (forces file download)
// app.get("/download/:filename", (req, res) => {
//   const filePath = path.join(__dirname, "uploads", req.params.filename);
  
//   res.download(filePath, req.params.filename, (err) => {
//     if (err) {
//       res.status(500).json({ message: "Error downloading file." });
//     }
//   });
// });

// // 🔑 Register Endpoint
// app.post("/register", async (req, res) => {
//   const { name, password } = req.body;
//   if (!name || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
//   try {
//     const existingUser = await User.findOne({ name });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, password: hashedPassword });
//     await newUser.save();
//     res.status(201).json({ message: "Registration successful" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // 🔑 Sign-in Endpoint
// app.post("/signin", async (req, res) => {
//   const { name, password } = req.body;
//   if (!name || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
//   try {
//     const user = await User.findOne({ name });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
//     res.status(200).json({ message: "Signin successful", token });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Start Server
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
const DatasetFile = require("./models/DatasetFile");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "your_jwt_secret";

// Middleware
app.use(cors({
  origin: "https://your-frontend.onrender.com",
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Dataset Schema
// const datasetSchema = new mongoose.Schema({
//   datasetId: String,
//   fileName: String,
//   filePath: String, // Stores the file URL
//   description: String, // ✅ New field to store description
// });

// const DatasetFile = mongoose.model("DatasetFile", datasetSchema);

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// ✅ Upload Route
app.post("/datasets/:id/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { description } = req.body; // ✅ Ensure description is received
    console.log("Received Description:", description); // ✅ Debug log

    const fileDownloadUrl = `/uploads/${req.file.filename}`;

    const newFile = new DatasetFile({
      datasetId: req.params.id,
      fileName: req.file.filename,
      filePath: fileDownloadUrl,
      description: description, // ✅ Store description
    });

    await newFile.save();
    res.status(200).json({ message: "✅ File uploaded successfully!", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "Server error. Failed to upload file.", error: error.message });
  }
});



// 📌 Check if Dataset Exists
// router.get("/datasets/:id", async (req, res) => {
//   try {
//     const files = await DatasetFile.find({ datasetId: req.params.id });

//     res.json({
//       files: files.map(file => ({
//         fileName: file.fileName,
//         filePath: file.filePath,
//         description: file.description || "No description available",
//       })),
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving files", error: error.message });
//   }
// });


// 📌 Additional Dataset Fetching Route
app.get("/datasets/:id", async (req, res) => {
  try {
    const datasetId = req.params.id;
    const files = await DatasetFile.find({ datasetId });

    res.set("Cache-Control", "no-store"); // ✅ Prevents caching
    res.json({ exists: files.length > 0, files }); // ✅ Ensure correct response
  } catch (error) {
    console.error("Error fetching dataset:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/signin", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Signin successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



app.post("/register", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
