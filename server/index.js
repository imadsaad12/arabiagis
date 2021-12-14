const express = require("express");
const app = express();
const cors = require("cors");
const csv = require("csv-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const Accidents = require("./models/Accident");
const fileupload = require("express-fileupload");
const path = require("path");
const util = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("./models/Users");
const { requireAuth } = require("./utilities/authMiddleware");
const results = [];
var keys = [];

mongoose
  .connect("mongodb://localhost:27017/arabiagis")
  .then(() => app.listen(4000, console.log("SERVER IS RUNNING ON PORT 4000 ")))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileupload());

app.post("/import", requireAuth, async (req, res) => {
  try {
    const file = req.files.file;
    const filename = file.name;
    const extention = path.extname(filename);
    const md5 = file.md5;
    const URL = md5 + extention;

    util
      .promisify(file.mv)("./" + URL)
      .then(() => {
        fs.createReadStream(URL)
          .pipe(csv({}))
          .on("data", (data) => results.push(data))
          .on("end", () => {
            results.map(async (r) => {
              const temp = new Accidents(r);
              await temp.save();
            });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
  res.send("done");
});

app.get("/home", requireAuth, async (req, res) => {
  const { page, size } = req.query;
  const pageNum = Number(page);
  const pageSize = Number(size);
  const totalDocs = await Accidents.countDocuments();
  const totalPages = Math.ceil(totalDocs / pageSize);
  var accidentsArray = [];
  if (pageNum === 1) {
    accidentsArray = await Accidents.find().limit(pageSize);
  } else {
    const skips = pageSize * (pageNum - 1);
    accidentsArray = await Accidents.find().skip(skips).limit(pageSize);
  }

  res.json({ keys, accidentsArray, totalPages });
});

app.post("/", async (req, res) => {
  const { Email, password } = req.body;

  const user = await Users.findOne({ Email });

  if (!user) {
    return res.send(`No user exists with email ${Email}`);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    const token = jwt.sign({ userId: user._id }, "XYZABC3366", {
      expiresIn: "7d",
    });
    res.json(token);
  } else {
    res.send("password do not matches");
  }
});

app.post("/signup", async (req, res) => {
  const { Email, password } = req.body;
 
  const user = await Users.findOne({ Email });
  if (user) {
    return res.send(`User already exists with email ${Email}`);
  }

  const hash = await bcrypt.hash(password, 10);

  const newuser = await new Users({
    Email,
    password: hash,
  }).save();

  
  const token = jwt.sign({ userId: newuser._id }, "XYZABC3366", {
    expiresIn: "7d",
  });
  res.json(token);
  
});

app.delete("/logout", async (req, res) => {
  await Accidents.remove({});
  res.send("done");
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Accidents.findByIdAndDelete(id);
  res.send("done");
});

app.get("/update/:id", async (req, res) => {
  const { id } = req.params;
  const accident = await Accidents.findById(id);

  res.json(accident);
});

app.put("/update", async (req, res) => {
  const _id = req.body._id;
  const data = req.body;
  
  Accidents.findByIdAndUpdate({ _id }, data)
    .then(async (result) => {
      res.send("done");
    })
    .catch((err) => console.log(err));
});
