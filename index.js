import express from "express";

const app = express();

app.get("/", async (req, res) => {
  try {
    const mysql2 = await import("mysql2");

    res.json({
      status: "success",
      mysql2_loaded: true,
      message: "mysql2 berhasil dimuat"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
});

export default app;