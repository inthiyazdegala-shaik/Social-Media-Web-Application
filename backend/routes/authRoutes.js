const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "circlio_secret";
const dataDir = path.join(__dirname, "..", "data");
const localUsersPath = path.join(dataDir, "users.json");

const readLocalUsers = () => {
  try {
    if (!fs.existsSync(localUsersPath)) {
      return [];
    }

    const content = fs.readFileSync(localUsersPath, "utf8");
    return content ? JSON.parse(content) : [];
  } catch (error) {
    console.error("Could not read local users:", error.message);
    return [];
  }
};

const writeLocalUsers = (users) => {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(localUsersPath, JSON.stringify(users, null, 2));
};

const createToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  name: user.name,
  bio: user.bio,
  profilePic: user.profilePic,
  createdAt: user.createdAt
});

const publicDevUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  name: user.name,
  bio: user.bio,
  profilePic: user.profilePic,
  createdAt: user.createdAt
});

const authRequired = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      return res.status(401).json({ message: "Login required" });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = mongoose.connection.readyState === 1
      ? await User.findById(payload.userId)
      : readLocalUsers().find((localUser) => localUser.id === payload.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired login" });
  }
};

const usingMongo = () => mongoose.connection.readyState === 1;

router.get("/test", (req, res) => {
  res.json({ message: "Auth Route Working" });
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    const cleanUsername = username?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !password) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = usingMongo()
      ? await User.findOne({ $or: [{ email: cleanEmail }, { username: cleanUsername }] })
      : readLocalUsers().find((user) => user.email === cleanEmail || user.username === cleanUsername);

    if (existingUser) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = usingMongo()
      ? await User.create({
          username: cleanUsername,
          email: cleanEmail,
          name: name?.trim() || cleanUsername,
          password: hashedPassword
        })
      : {
          id: `${Date.now()}`,
          username: cleanUsername,
          email: cleanEmail,
          name: name?.trim() || cleanUsername,
          password: hashedPassword,
          bio: "Building my circle on Circlio.",
          profilePic: "",
          createdAt: new Date()
        };

    if (!usingMongo()) {
      const localUsers = readLocalUsers();
      localUsers.push(user);
      writeLocalUsers(localUsers);
    }

    res.status(201).json({
      message: usingMongo() ? "Account created" : "Account created in local storage. MongoDB can be started later.",
      token: createToken(usingMongo() ? user._id : user.id),
      user: usingMongo() ? publicUser(user) : publicDevUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: "Could not create account" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const cleanIdentifier = identifier?.trim();

    if (!cleanIdentifier || !password) {
      return res.status(400).json({ message: "Username/email and password are required" });
    }

    const user = usingMongo()
      ? await User.findOne({ $or: [{ email: cleanIdentifier.toLowerCase() }, { username: cleanIdentifier }] })
      : readLocalUsers().find((localUser) => localUser.email === cleanIdentifier.toLowerCase() || localUser.username === cleanIdentifier);

    if (!user) {
      return res.status(401).json({ message: "Invalid login details" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid login details" });
    }

    res.json({
      message: usingMongo() ? "Logged in" : "Logged in with local storage. MongoDB can be started later.",
      token: createToken(usingMongo() ? user._id : user.id),
      user: usingMongo() ? publicUser(user) : publicDevUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: "Could not log in" });
  }
});

router.get("/me", authRequired, (req, res) => {
  res.json({ user: usingMongo() ? publicUser(req.user) : publicDevUser(req.user) });
});

module.exports = router;
