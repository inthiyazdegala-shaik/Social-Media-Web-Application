const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "circlio_secret";
const dataDir = path.join(__dirname, "..", "data");
const localUsersPath = path.join(dataDir, "users.json");
const localPostsPath = path.join(dataDir, "posts.json");

const samplePosts = [
  {
    id: "sample-news-metro",
    userId: "sample-news-metro",
    username: "daily.pulse",
    name: "Daily Pulse",
    place: "Breaking news",
    caption: "Metro services added extra evening trips today after heavy office-hour crowds. Commuters are reporting shorter waits on the main line.",
    likes: 4386,
    comments: 142,
    image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1000&q=80",
    likedBy: [],
    createdAt: "2026-06-25T08:30:00.000Z"
  },
  {
    id: "sample-news-tech",
    userId: "sample-news-tech",
    username: "tech.brief",
    name: "Tech Brief",
    place: "Tech news",
    caption: "A new startup hub opened applications for student founders, with mentoring, cloud credits, and weekend demo sessions planned.",
    likes: 3274,
    comments: 118,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80",
    likedBy: [],
    createdAt: "2026-06-25T07:45:00.000Z"
  },
  {
    id: "sample-earth",
    userId: "sample-earth",
    username: "earth.report",
    name: "Earth Report",
    place: "Social news",
    caption: "Local volunteers cleaned a lakefront today and shared before-after photos with the circle.",
    likes: 2842,
    comments: 96,
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80",
    likedBy: [],
    createdAt: "2026-06-20T08:00:00.000Z"
  },
  {
    id: "sample-city",
    userId: "sample-city",
    username: "city.circle",
    name: "City Circle",
    place: "Community",
    caption: "New weekend meetup: street food, clean-up drive, and open mic near the park.",
    likes: 1912,
    comments: 41,
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80",
    likedBy: [],
    createdAt: "2026-06-21T08:00:00.000Z"
  },
  {
    id: "sample-live",
    userId: "sample-live",
    username: "inthiyaz.live",
    name: "Inthiyaz Live",
    place: "Friend update",
    caption: "Sharing what is happening around my circle today.",
    likes: 3710,
    comments: 128,
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=1000&q=80",
    likedBy: [],
    createdAt: "2026-06-22T08:00:00.000Z"
  },
  {
    id: "sample-green",
    userId: "sample-green",
    username: "green.alert",
    name: "Green Alert",
    place: "Earth",
    caption: "Tip of the day: carry a bottle, skip one plastic cup, and post your small win.",
    likes: 1240,
    comments: 52,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
    likedBy: [],
    createdAt: "2026-06-23T08:00:00.000Z"
  },
  {
    id: "sample-campus",
    userId: "sample-campus",
    username: "campus.voice",
    name: "Campus Voice",
    place: "Youth circle",
    caption: "Students are collecting books for a neighborhood library this week.",
    likes: 2205,
    comments: 87,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
    likedBy: [],
    createdAt: "2026-06-24T08:00:00.000Z"
  }
];

const readJson = (filePath, fallback) => {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }

    const content = fs.readFileSync(filePath, "utf8");
    return content ? JSON.parse(content) : fallback;
  } catch (error) {
    console.error(`Could not read ${path.basename(filePath)}:`, error.message);
    return fallback;
  }
};

const writeJson = (filePath, value) => {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
};

const readUsers = () => readJson(localUsersPath, []);

const readPosts = () => {
  const posts = readJson(localPostsPath, null);

  if (posts) {
    return posts;
  }

  writeJson(localPostsPath, samplePosts);
  return samplePosts;
};

const writePosts = (posts) => writeJson(localPostsPath, posts);

const publicUser = (user) => ({
  id: user._id?.toString() || user.id,
  username: user.username,
  email: user.email,
  name: user.name || user.username,
  bio: user.bio || "Building my circle on Circlio.",
  profilePic: user.profilePic || "",
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
      : readUsers().find((localUser) => localUser.id === payload.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = publicUser(user);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired login" });
  }
};

const postForUser = (post, userId) => ({
  ...post,
  likes: Number(post.likes || 0),
  comments: Number(post.comments || 0),
  liked: (post.likedBy || []).includes(userId),
  likedBy: undefined
});

router.get("/", authRequired, (req, res) => {
  const posts = readPosts()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((post) => postForUser(post, req.user.id));

  res.json({ posts });
});

router.post("/", authRequired, (req, res) => {
  const { caption, image } = req.body;
  const cleanCaption = caption?.trim();
  const cleanImage = image?.trim();

  if (!cleanCaption && !cleanImage) {
    return res.status(400).json({ message: "Write something or choose a photo" });
  }

  const posts = readPosts();
  const post = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    userId: req.user.id,
    username: req.user.username,
    name: req.user.name || req.user.username,
    place: "Circlio",
    caption: cleanCaption || "Shared a moment with the circle.",
    likes: 0,
    comments: 0,
    image: cleanImage || "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1000&q=80",
    likedBy: [],
    createdAt: new Date().toISOString()
  };

  posts.push(post);
  writePosts(posts);
  res.status(201).json({ post: postForUser(post, req.user.id) });
});

router.post("/:id/like", authRequired, (req, res) => {
  const posts = readPosts();
  const post = posts.find((item) => item.id === req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  post.likedBy = post.likedBy || [];
  const liked = post.likedBy.includes(req.user.id);
  post.likedBy = liked
    ? post.likedBy.filter((id) => id !== req.user.id)
    : [...post.likedBy, req.user.id];
  post.likes = Math.max(0, Number(post.likes || 0) + (liked ? -1 : 1));

  writePosts(posts);
  res.json({ post: postForUser(post, req.user.id) });
});

router.get("/profiles/:username", authRequired, async (req, res) => {
  const username = req.params.username;
  const posts = readPosts();
  const userPosts = posts
    .filter((post) => post.username === username)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const localUser = readUsers().find((user) => user.username === username);
  const mongoUser = mongoose.connection.readyState === 1
    ? await User.findOne({ username })
    : null;
  const user = mongoUser ? publicUser(mongoUser) : localUser ? publicUser(localUser) : {
    id: username,
    username,
    name: userPosts[0]?.name || username,
    bio: userPosts.length ? "Sharing on Circlio." : "No posts yet.",
    profilePic: "",
    createdAt: userPosts[0]?.createdAt || new Date().toISOString()
  };

  res.json({
    user,
    posts: userPosts.map((post) => postForUser(post, req.user.id))
  });
});

module.exports = router;
