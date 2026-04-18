import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import profileRoutes from "./routes/profileRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/profile", profileRoutes);

// test route
app.get("/", (req, res) => {
  res.send("CoLivX API running");
});

// connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});