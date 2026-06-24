import express from "express";
import cors from "cors";
import db from "./config/db.config.js";

// import model
import "./models/buku.models.js";
import "./models/mahasiswa.models.js";
import "./models/prodi.models.js";
import "./models/pinjam.models.js";
import "./models/user.models.js";
import "./models/detailpinjam.models.js";

// import routes
import Bukuroutes from "./route/buku.routes.js";
import mahasiswaroutes from "./route/mahasiswa.routes.js";
import prodiroutes from "./route/prodi.routes.js";
import pinjamroutes from "./route/pinjam.routes.js";
import userroutes from "./route/user.routes.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/buku", Bukuroutes);
app.use("/api/mahasiswa", mahasiswaroutes);
app.use("/api/prodi", prodiroutes);
app.use("/api/pinjam", pinjamroutes);
app.use("/api/user", userroutes);

// test root
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API berjalan"
  });
});

// database
try {
  await db.authenticate();
  console.log("Database OK");
  await db.sync();
  console.log("Database synced successfully");
} catch (error) {
  console.log("Database gagal:", error);
}


export default app;