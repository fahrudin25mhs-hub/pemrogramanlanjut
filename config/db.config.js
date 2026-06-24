import mysql from "mysql2";
import { Sequelize } from "sequelize";

console.log("MYSQL2 =", typeof mysql);

const db = new Sequelize(
  "test",
  "test",
  "test",
  {
    dialect: "mysql",
    dialectModule: mysql
  }
);

export default db;