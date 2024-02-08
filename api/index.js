const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const Post = require("./models/Post");
require('dotenv').config();

const app = express();
const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";

const corsOperation = {
  credentials: true,
  origin: "https://blogify-tau-five.vercel.app/",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOperation));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((e) => {
    console.log(e);
  });

  app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if(!password){
      return res.status(400).json({message:"Empty Password!"});
    }
    try {
      const userDoc = await User.create({
        username,
        password: bcrypt.hashSync(password, salt),
      });
      res.json(userDoc);
    } catch (e) {
      res.status(400).json(e);
    }
  });

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc ? userDoc.password : "");
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) {
        throw err;
      }
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Wrong Credentials");
  }
});

app.get("/profile", (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
  } catch (e) {
    console.log("Yet to Login");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", " ").json("ok");
});

app.post("/post", upload.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  console.log(path);
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,  
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

app.put("/post", upload.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    console.log(path);
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);

    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }

    try {
      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;
      postDoc.cover = newPath ? newPath : postDoc.cover;

      await postDoc.save(); // Use the save method to persist changes

      res.json(postDoc);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});

app.get("/post", async (req, res) => {
  const posts = await Post.find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findOne({ _id: id }).populate("author", [
    "username",
  ]);
  res.json(postDoc);
});

app.get("/",async(req,res,next)=>{
  res.status(200).json({"message":"Working"});
});


app.get("/ping",async(req,res,next)=>{
  res.status(200).json({"message":"pong"});
});
app.listen(process.env.API_PORT);

// mongodb+srv://Blog:mOd8HQQhHoa2gQk8@cluster0.xby3ou4.mongodb.net/?retryWrites=true&w=majority
