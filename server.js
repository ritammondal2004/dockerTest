

const express = require("express");
const app = express();
const path = require("path");
const { MongoClient } = require("mongodb");

const PORT = 6050;
const MONGO_URL = "mongodb://admin:qwerty@localhost:27017";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connect to MongoDB once and reuse
let db;
MongoClient.connect(MONGO_URL)
  .then(client => {
    console.log("✅ Connected to MongoDB");
    db = client.db("my-db");
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// GET users
app.get("/getUsers", async (req, res) => {
  try {
    const data = await db.collection("ritam").find({}).toArray();
    res.send(data);
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
 // client.close();
});

// POST new user
app.post("/addUser", async (req, res) => {
  try {
    const userObj = req.body;
    const result = await db.collection("ritam").insertOne(userObj);
    console.log("✅ Data inserted:", result.insertedId);
    res.send("User added");
  } catch (err) {
    res.status(500).send("Error inserting user");
  } 
  //client.close();
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
