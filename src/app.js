// Import express
const express = require("express");

// Create an app instance
const app = express();
app.use("/test", (req, res) => {
  res.send("hrllo test");
});

app.use((req, res) => {
  res.send("hrllo from server");
});

app.listen(7777, () => {
  console.log("hello there");
});
