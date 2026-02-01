const { adminAuth } = require("./middlewares/adminauth");

// Create an app instance
const app = express();

// in postman use get query http://localhost:4000/user/101/piyush/p123
app.get("/user/:userid/:name/:pass", (req, res) => {
  console.log(req.params);

  res.send({
    firstname: "Piyush",
    lastname: "joshi",
  });
});

app.use("/admin", adminAuth); // middle ware used to authorised all the apis that start with admin

app.get("/admin/getdata", (req, res) => {
  res.send("get admin data");
});

// route handlers
app.get(
  "/data",
  (req, res, next) => {
    // res.send("first resppose");
    next();
  },
  (req, res) => {
    res.send("send secind response");
  }
);

app.post("/user", (req, res) => {
  console.log("Data sendddd");
  res.send("data send to db");
});

app.use("/test", (req, res) => {
  res.send("hello test");
});

app.listen(4000, () => {
  console.log("hello there");
});
