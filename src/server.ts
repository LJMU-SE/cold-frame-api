import express from "express";
import dotenv from "dotenv";
dotenv.config();

// Configure mongoose
import mongoose from "mongoose";
const clientOptions: mongoose.ConnectOptions = { serverApi: "1" };
const db_uri = process.env.MONGO_URI as string;

// Import reading schema
import Reading from "./schemas/readingSchema";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

const PORT = parseInt(process.env.PORT as string, 10) || 3000;

app.get("/test/", (req, res) => res.status(200).json({ message: "Hello World!" }));

interface DataBody {
    temperature: number;
    humidity: number;
    moisture: number;
    environmentState: string;
    soilState: string;
    mode: string;
}

app.post("/push-latest/", async (req, res) => {
    // Get the body
    const body = req.body as DataBody;

    console.log(`Adding Data to MongoDB: ${JSON.stringify(body)}`);

    // Add to mongodb
    try {
        await mongoose.connect(db_uri, clientOptions);

        // Add the body to the database
        const data = new Reading(body);
        await data.save();

        res.status(200).json({ message: "Data added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add data", error });
    } finally {
        await mongoose.disconnect();
    }
});

app.get("/fetch-latest/", async (req, res) => {
    try {
        const uri = process.env.MONGO_URI as string;

        if (!uri) {
            throw new Error("Mongo URI is not provided");
        }

        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);

        // Fetch the latest data
        const data = await Reading.findOne().sort({ timestamp: -1 });

        res.status(200).json(data);
    } finally {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
