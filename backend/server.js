const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const os = require("os");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/circlio";

app.use(cors());
app.use(express.json({ limit: "10mb" }));
const reactBuildPath = path.join(__dirname, "..", "frontend", "dist");
const staticPath = reactBuildPath;

app.use(express.static(staticPath));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON body" });
  }

  next(err);
});

mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    console.log("Using local JSON storage in backend/data/users.json");
  });

app.get("/", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "mongodb" : "local-json"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get(/.*/, (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(staticPath, "index.html"), (error) => {
    if (error) {
      next(error);
    }
  });
});

const getNetworkUrls = () => Object.values(os.networkInterfaces())
  .flat()
  .filter((item) => item && item.family === "IPv4" && !item.internal)
  .map((item) => `http://${item.address}:${PORT}`);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
  getNetworkUrls().forEach((url) => console.log(`Phone URL: ${url}`));
});
