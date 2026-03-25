const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const eventRoutes = require("./routes/eventRoute");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Event Booking System API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});