import express from "express";
import cors from "cors";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import notFoundHandler from "./app/middlewares/notFoundHandeler";
import globalErrorHandler from "./app/middlewares/globalErrorHandeler";
import config from "./app/config";

const app = express();

// Enable cookie parsing
app.use(cookieParser());

// Middleware for parsing JSON bodies
app.use(express.json());

// app.use(express.static("./uploads"));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://lokplaaza.netlify.app", "http://13.205.43.25"],
    credentials: true,
  })
);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome onboard!");
});

app.get("/api/v1/get-key", (req, res) =>
  res.status(200).json({ key: config.razorpay_api_key })
);

// Application routes
app.use("/api/v1", router);

// Catch-all route for handling 404 errors
app.use(notFoundHandler);

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
