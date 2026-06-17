import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Deploy berhasil"
  });
});

export default app;