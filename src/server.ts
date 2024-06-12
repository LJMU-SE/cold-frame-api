import express from "express";

const app = express();
const PORT = 3000;

app.get("/test/", (req, res) => res.status(200).json({ message: "Hello World!" }));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
