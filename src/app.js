// Import dependencies
const express = require("express");
// const bcrypt = require("bcrypt");
const { connectDb } = require("./config/Database");
// const User = require("./Models/users");
// const { validateSignupData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const stripeWebhookRouter = require("./routes/stripeWebhook");
const PORT = process.env.PORT || 4000;

const cors = require("cors");

const jwt = require("jsonwebtoken");

const app = express();

// this allows your react app to access your backend, credentials :true allows browser to send cookies , tokens etc..
const allowedOrigins = [
  "http://localhost",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
// middleware to call api from one origin to other(calling from frontend webservice)

console.log("WEbhoooooooook");

app.use("/api/payment/", stripeWebhookRouter); // webhook should be before express.json() because stripe needs raw body for signature verification
app.use(express.json()); // Middleware to parse JSON
app.use(cookieParser()); // middleware to parse cookies

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");


// login api when called check firs in authrouter if it gets login api then it sends the response back, similarly all api first go thrugh authrouter..

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/requests", requestRouter);
app.use("/api/users", userRouter);



// ------------------- CONNECT DB & START SERVER -------------------
connectDb()
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(PORT, () => console.log("🚀 Server running on port 4000"));
  })
  .catch((err) => {
    console.error("❌ Database connection failed", err);
  });
