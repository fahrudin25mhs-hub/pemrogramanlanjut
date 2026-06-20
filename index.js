import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend berhasil deploy"
  });
});

export default app;