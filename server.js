const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/assignment9";

app.use(express.json());
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.json({ message: "Users API is running" });
});

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
