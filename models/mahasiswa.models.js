import { Sequelize } from "sequelize";
import db from "../config/db.config.js";
import ref_prodi from "./prodi.models.js";

const { DataTypes } = Sequelize;

const Mahasiswa = db.define(
  "mahasiswas",
  {
    nim: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tempat_lahir: {
      type: DataTypes.STRING,
    },
    tgl_lahir: {
      type: DataTypes.DATE,
    },
    prodi_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "prodis", 
        key: "kode_prodi",
      },
    },
    th_masuk: {
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
    timestamps: false,
  }
);

ref_prodi.hasMany(Mahasiswa, { foreignKey: 'prodi_id' });
Mahasiswa.belongsTo(ref_prodi, { foreignKey: 'prodi_id' });

export default Mahasiswa;