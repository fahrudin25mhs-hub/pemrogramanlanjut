import mahasiswa from "../models/mahasiswa.models.js";
import { Sequelize } from "sequelize";
import ref_prodi from "../models/prodi.models.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await mahasiswa.findAll({
      include: {model:ref_prodi,
        attributes: ['nama_prodi']},
    });
    res.json(products);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const tambahdatabaru = async (req, res) => {
  try {
    const products = await mahasiswa.create(req.body);
    res.json({ "message": "data mahasiswa berhasil disimpan" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const carimahasiswaBynim = async (req, res) => {
  try {
    const products = await mahasiswa.findAll({
      where: {
        nim: req.params.id
      }
    });
    res.json(products[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const updatemahasiswa = async (req, res) => {
  try {
    const products = await mahasiswa.update(req.body, {
      where: {
        nim: req.params.id
      }
    });
    res.json({ "message": "data mahasiswa berhasil update" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

export const deletemahasiswa = async (req, res) => {
  try {
    const products = await mahasiswa.destroy({
      where: {
        nim: req.params.id
      }
    });
    res.json({ "message": "data mahasiswa berhasil dihapus" });
  } catch (error) {
    res.json({ message: error.message });
  }
};