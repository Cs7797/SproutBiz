import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

import cookieParser from "cookie-parser";
import session from "express-session";

import champaignRouter from "./routes/champaignRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 8000;

// Allow the frontend to call the API from a different origin.
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    );
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(cookieParser());
app.use(express.json());

import MongoStore from "connect-mongo";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  }),
);

// Ensure MongoDB is connected before processing API requests.
app.use(async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is not configured");
      }

      await mongoose.connect(process.env.MONGO_URL, {
        serverSelectionTimeoutMS: 10000,
      });
    }

    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res.status(503).json({
      success: false,
      message: "Database connection unavailable",
    });
  }
});

app.use("/api/champaign", champaignRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    statuscode: statusCode,
    message: err.message || "Internal Server Error",
  });
});

// Vercel imports the Express app; local development starts a server.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
