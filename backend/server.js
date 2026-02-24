const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const propertyRoutes = require("./routes/propertyRoutes");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({ message: "Metro Estate API is running" });
});

app.use("/api/properties", propertyRoutes);

// ─── Start Server ───────────────────────────────────────────
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
