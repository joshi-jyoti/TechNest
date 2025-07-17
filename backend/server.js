require("dotenv").config();
const express = require("express");
const cors=require("cors");
const path=require("path");
const connectDB = require("./config/db");

 const authRoutes = require("./routes/authRoutes");
const blogPostRoutes = require("./routes/blogPostRoutes");
const commentRoutes = require("./routes/commentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

//Middlewares to handle CORS
app.use(
    cors({
        orign: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

connectDB();

// Middleware to parse JSON requests
app.use(express.json());

//Routes
 app.use("/api/auth", authRoutes);
app.use("/api/posts", blogPostRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/dashboard-summary", dashboardRoutes);
app.use("/api/ai", aiRoutes);

// Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

//start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});