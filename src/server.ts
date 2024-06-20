// Import environment variables
import dotenv from "dotenv";
dotenv.config();

// Import the logger
import Logger from "./lib/logger";

// Set up the express app
import express from "express";
const app = express();

import morganMiddleware from "./config/morgan.config";
app.use(morganMiddleware);

import bodyParser from "body-parser";
app.use(bodyParser.json());

import appRoute from "./routes/router";
app.use("/", appRoute);

// Start the app
const PORT = parseInt(process.env.PORT as string, 10) || 3000;
app.listen(PORT, () => {
    Logger.info(`Server is running at http://localhost:${PORT}`);
});
