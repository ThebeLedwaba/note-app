const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/notes", noteRoutes);

mongoose.connect("mongodb://localhost:27017/noteApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});