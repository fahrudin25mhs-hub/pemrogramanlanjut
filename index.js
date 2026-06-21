import express from "express";
import db from "./config/db.config.js";

const app = express();

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "db.config.js berhasil di-load"
  });
});

export default app;