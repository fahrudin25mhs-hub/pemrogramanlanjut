import express from "express";
import multer from "multer";
import {
  getAllPinjam,
  getDetailPinjam,
  getLoansByStudentID,
  tambahPinjam,
  updatePinjam,
  deletePinjam,
  insertPinjam,
  cariBukuDipinjamMahasiswa
} from "../controllers/Pinjam.controller.js";
import {
  kembalikanSatuBuku,
  kembalikanSemuaBuku
} from "../controllers/Pinjam.controller.js";
import {
  kembalikanSebagianBuku,
  laporanPengembalian
} from "../controllers/Pinjam.controller.js";
import { authenticateToken } from "../middleware/VerifyTokens.js";





const router = express.Router();
const upload = multer();
router.get("/", authenticateToken, getAllPinjam);
router.get("/:nim", authenticateToken, getLoansByStudentID)
router.get("/detail/:id", authenticateToken, getDetailPinjam);
router.post("/", upload.none(), authenticateToken, insertPinjam);
router.patch("/:id", upload.none(), authenticateToken, updatePinjam);
router.delete("/:id", authenticateToken, deletePinjam);
router.put("/kembali/:pinjam_id/:buku_id", authenticateToken, kembalikanSatuBuku); //kembalikan satu buku
router.put("/kembali-semua/:pinjam_id", authenticateToken, kembalikanSemuaBuku);  //kembalikan semua buku 
router.get("/mahasiswa/:nim", authenticateToken, cariBukuDipinjamMahasiswa);
router.get("/mahasiswa/:nim", authenticateToken, cariBukuDipinjamMahasiswa);
router.post("/kembali/:pinjam_id", authenticateToken, kembalikanSebagianBuku);
router.get("/laporan/pengembalian", authenticateToken, laporanPengembalian);


export default router;