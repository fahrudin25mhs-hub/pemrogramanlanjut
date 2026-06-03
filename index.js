import express from "express";
import cors from "cors";
import db from "./config/db.config.js";

// import model agar tabel otomatis dibuat
import "./models/buku.models.js";
import "./models/mahasiswa.models.js";
import "./models/prodi.models.js";
import "./models/pinjam.models.js";

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

// API routes
app.use("/api/buku", Bukuroutes);
app.use("/api/mahasiswa", mahasiswaroutes);
app.use("/api/prodi", prodiroutes);
app.use("/api/pinjam", pinjamroutes);
app.use("/api/user", userroutes);

// database
try {
  await db.authenticate();
  console.log("Database OK");

  await db.sync({ alter: true });
  console.log("Semua tabel berhasil dibuat otomatis");
} catch (error) {
  console.log("Database gagal:", error);
}

app.listen(5100, () => {
  console.log("Server running on port 5100");
});