// Import the router
import { Router } from "express";

// Create the router
const apiRouter = Router();

// Import the database and the reading schema
import mongoose from "mongoose";
import Reading from "../schemas/readingSchema";

// Import the logger
import Logger from "../lib/logger";

interface DataBody {
    temperature: number;
    humidity: number;
    moisture: number;
    environmentState: string;
    soilState: string;
    mode: string;
}

const connectToMongo = async () => {
    // Get the connection URI for the database
    const uri = process.env.MONGO_URI as string;
    if (!uri) throw new Error("Database URI is not provided");

    await mongoose.connect(process.env.MONGO_URI as string);
    return mongoose;
};

/**
 * API Route to fetch data from the database within the last 24 hours.
 */
apiRouter.get("/fetch-latest", async (req, res) => {
    try {
        await connectToMongo();

        // Fetch the data within the last 24 hours
        const data = await Reading.find({ timestamp: { $gte: new Date().getDate() - 1 } }).sort({ timestamp: -1 });

        // Map the data for each data type
        const output = {
            temperature: data.map((reading) => {
                return { time: reading.timestamp, temperature: reading.temperature };
            }),
            humidity: data.map((reading) => {
                return { time: reading.timestamp, humidity: reading.humidity };
            }),
            moisture: data.map((reading) => {
                return { time: reading.timestamp, moisture: reading.moisture };
            }),
            environmentState: data.map((reading) => {
                return { time: reading.timestamp, state: reading.environmentState };
            }),
            soilState: data.map((reading) => {
                return { time: reading.timestamp, state: reading.soilState };
            }),
            mode: data.map((reading) => {
                return { time: reading.timestamp, mode: reading.mode };
            }),
        };

        // Return a status of 200 and send the data as a JSON object
        res.status(200).json(output);
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ message: "Failed to fetch data", error });
        await mongoose.connection.close();
    }
});

/**
 * API Route to push data to the database.
 */
apiRouter.post("/push-latest", async (req, res) => {
    // Get the body
    const body = req.body as DataBody;

    Logger.debug(`Adding Data to MongoDB: \n${JSON.stringify(body, null, 4)}`);

    // If the body does not match the schema, throw an error
    if (!body.temperature || !body.humidity || !body.moisture || !body.environmentState || !body.soilState || !body.mode) {
        return res.status(400).json({ message: "Invalid body" });
    }

    // Add to mongodb
    try {
        await connectToMongo();

        // Add the body to the database
        const data = new Reading(body);
        await data.save();

        res.status(200).json({ message: "Data added successfully" });
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ message: "Failed to add data", error });
    } finally {
        await mongoose.connection.close();
    }
});

/**
 * API Route to clear all data from the database.
 */
apiRouter.get("/clear-all", async (req, res) => {
    try {
        await connectToMongo();

        await Reading.deleteMany({});

        res.status(200).json({ message: "All data cleared" });
    } catch (error) {
        Logger.error(error);
        res.status(500).json({ message: "Failed to clear data", error });
    } finally {
        await mongoose.connection.close();
    }
});

// Route to check the health of the API
apiRouter.get("/", (req, res) => res.status(200).json({ message: "Hello World!" }));

// Export the router
export default apiRouter;
