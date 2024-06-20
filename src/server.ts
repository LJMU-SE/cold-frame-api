import express from "express";

const app = express();
const PORT = 3000;

app.get("/test/", (req, res) => res.status(200).json({ message: "Hello World!" }));

app.get("/fetch-latest/", (req, res) => {
    res.status(200).json({ temperature: 25, humidity: 50, moisture: 75, environmentState: "Good", soilState: "Good", mode: "Auto" });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
