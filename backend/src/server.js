require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: "uploads/" });
// const dbConfig = require('./config/db.config');

const app = express();

// app.use(cors(corsOptions));
const allowedOrigins = [
  "https://b2-b-saa-s-lead-mangement.vercel.app",
  "http://localhost:3000",
  "https://b2-b-saa-s-lead-mangement-main.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // This is the key to enabling credentials
};

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    console.log(MONGODB_URI);
  });

// Import and use routes
const companyRoutes = require("./routes/company.routes");
const leadRoutes = require("./routes/lead.routes");
const usersRouter = require("./routes/user.routes");
const csvRouter = require("./routes/uploadCSVRoute");

app.use("/api", csvRouter);
app.use("/api/companies", companyRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/users", usersRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
