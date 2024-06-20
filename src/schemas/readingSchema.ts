import mongoose from "mongoose";

const ReadingSchema = new mongoose.Schema({
    temperature: {
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true,
    },
    moisture: {
        type: Number,
        required: true,
    },
    environmentState: {
        type: String,
        required: true,
    },
    soilState: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Reading", ReadingSchema);
