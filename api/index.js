import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import champaignRouter from './routes/champaignRoutes.js'
import userRouter from './routes/userRoutes.js'
import adminRouter from './routes/adminRoutes.js'



dotenv.config();
console.log(
  "Stripe secret key loaded:",
  Boolean(process.env.STRIPE_SECRET_KEY),
);
const app = express();
const port = Number(process.env.PORT) || 8000;
const maxPortAttempts = 10;

try {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDb is connected succesfully");
} catch (error) {
  console.log("error occured during Mongodb connection");
  console.error(error.message);
  
}


app.use(cookieParser())
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


app.use('/api/champaign',champaignRouter)
app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)


app.use((err, req, res, next) => {
  const statuscode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});

const startServer = (basePort, attempt = 0) => {
  const currentPort = basePort + attempt;
  const server = app.listen(currentPort, () => {
    console.log(`server is running on port ${currentPort}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && attempt < maxPortAttempts) {
      console.warn(`Port ${currentPort} is in use. Trying ${currentPort + 1}...`);
      startServer(basePort, attempt + 1);
      return;
    }

    if (error.code === "EADDRINUSE") {
      console.error(
        `Could not find an open port between ${basePort} and ${basePort + maxPortAttempts}. Set a different PORT in .env.`
      );
      process.exit(1);
    }

    console.error("Server failed to start:", error.message);
    process.exit(1);
  });
};

startServer(port);
