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
import kecamatanRoute from "./routes/kecamatan.js";
import kelurahanRoute from "./routes/kelurahan.js";
import sukRoute from "./routes/suk.js";
import sampahRoute from "./routes/sampah.js";
import transaksiRoute from "./routes/transaksi.js";

const app = express();

// Serve static from public folder
app.use(express.static("public"));

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
app.use("/api/kecamatan", kecamatanRoute);
app.use("/api/kelurahan", kelurahanRoute);
app.use("/api/SUK", sukRoute);
app.use("/api/sampah", sampahRoute);
app.use("/api/transaksi", transaksiRoute);

//Error handling
app.use(errorHandler);

export default app;
