const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const os = require("os");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
const PORT = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/circlio";
const certDir = path.join(__dirname, "certs");
const sslKeyPath = process.env.SSL_KEY_PATH || path.join(certDir, "dev-key.pem");
const sslCertPath = process.env.SSL_CERT_PATH || path.join(certDir, "dev-cert.pem");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
const reactBuildPath = path.join(__dirname, "..", "frontend", "dist");
const staticPath = reactBuildPath;
const hasFrontendBuild = fs.existsSync(path.join(staticPath, "index.html"));

if (hasFrontendBuild) {
  app.use(express.static(staticPath));
}

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
  if (hasFrontendBuild) {
    return res.sendFile(path.join(staticPath, "index.html"));
  }

  res.json({
    status: "ok",
    message: "Circlio backend is running. Deploy the frontend separately and use /api routes for backend requests."
  });
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

  if (!hasFrontendBuild) {
    return res.status(404).json({
      message: "Frontend build not found on this server. Deploy the React frontend separately."
    });
  }

  res.sendFile(path.join(staticPath, "index.html"), (error) => {
    if (error) {
      next(error);
    }
  });
});

const loadHttpsOptions = () => {
  try {
    if (!fs.existsSync(sslKeyPath) || !fs.existsSync(sslCertPath)) {
      return null;
    }

    return {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath)
    };
  } catch (error) {
    console.error("Could not load HTTPS certificate:", error.message);
    return null;
  }
};

const httpsOptions = loadHttpsOptions();
const protocol = httpsOptions ? "https" : "http";

const getNetworkUrls = () => Object.values(os.networkInterfaces())
  .flat()
  .filter((item) => item && item.family === "IPv4" && !item.internal)
  .map((item) => `${protocol}://${item.address}:${PORT}`);

const server = httpsOptions
  ? https.createServer(httpsOptions, app)
  : http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${protocol}://localhost:${PORT}`);
  if (!httpsOptions) {
    console.log("HTTPS disabled: add backend/certs/dev-key.pem and backend/certs/dev-cert.pem, or set SSL_KEY_PATH and SSL_CERT_PATH.");
  }
  getNetworkUrls().forEach((url) => console.log(`Phone URL: ${url}`));
});
