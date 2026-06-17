import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend berjalan"
  });
});

export default app;