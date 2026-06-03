import { Sequelize } from "sequelize";
import db from "../config/db.config.js";
import Mahasiswa from "./mahasiswa.models.js";

const { DataTypes } = Sequelize;

const Pinjam = db.define(
  "pinjam",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tanggal_pinjam: {
      type: DataTypes.DATE,
    //   allowNull: false,
    },
    tanggal_kembali: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    nim: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "mahasiswas",
        key: "nim",
      },
    },
    pegawai_id: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    // timestamps: false,
  }
);
// RELASI KE MAHASISWA
Pinjam.belongsTo(Mahasiswa, {
  foreignKey: "nim",
});

Mahasiswa.hasMany(Pinjam, {
  foreignKey: "nim",
});

export default Pinjam;