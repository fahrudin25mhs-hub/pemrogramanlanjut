import express from "express";
import db from "./config/db.config.js";

const app = express();

app.get("/", async (req, res) => {
  try {
    await db.authenticate();

    res.json({
      status: "success",
      message: "Database connected"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

export default app;