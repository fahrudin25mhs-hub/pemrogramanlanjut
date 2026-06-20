import express from "express";
import cors from "cors";

import db from "./config/db.config.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend berhasil deploy"
  });
});

try {
  await db.authenticate();
  console.log("Database connected successfully");
} catch (error) {
  console.log("Database connection failed:", error);
}

export default app;