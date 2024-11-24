import express from "express";
import morgan from "morgan";
import "express-async-errors";

// Error handler
import { errorHandler } from "./middleware/errorHandler.js";

// Cors
import cors from "cors";

// Model import (Use .js file extension!!!)
import cookieParser from "cookie-parser";

// App Configuration
import { CORS_URL } from "./config/appConfig.js";

// Routes import
import userRoute from "./routes/user.js";

const app = express();

// Cookie parse
app.use(cookieParser());

// Parse json
app.use(express.json());

//Setting up cors
const corsConfig = {
  credentials: true,
  origin: CORS_URL,
};

app.use(cors(corsConfig));

// Morgan
app.use(morgan("dev"));

// Routes
app.use("/api", userRoute);

//Error handling
app.use(errorHandler);

export default app;
