const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cookieParser(process.env.COOKIE_SECRET));

// Middlewares
app.use(express.json());

// CORS configuration - allow local dev and deployed frontends
const allowedOrigins = [
    "http://localhost:5173", // local Vite dev
    "https://job-portal-frontend-p1qk.onrender.com", // deployed Render frontend
    // Add more origins as needed for different environments
];

app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin (like mobile apps or curl requests)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

// Custom Middlewares
const {
    authenticateUser,
} = require("./Middleware/UserAuthenticationMiddleware");

// Routers
const JobRouter = require("./Router/JobRouter");
const UserRouter = require("./Router/UserRouter");
const AuthRouter = require("./Router/AuthRouter");
const AdminRouter = require("./Router/AdminRouter");
const ApplicationRouter = require("./Router/ApplicationRouter");

// Connecting routes
app.use("/api/v1/Jobs", authenticateUser, JobRouter);
app.use("/api/v1/Users", authenticateUser, UserRouter);
app.use("/api/v1/Auth", AuthRouter);
app.use("/api/v1/Admin", authenticateUser, AdminRouter);
app.use("/api/v1/Application", authenticateUser, ApplicationRouter);

module.exports = app;
