import { Sequelize } from "sequelize";

console.log("sequelize imported");

const db = new Sequelize(
  "test",
  "test",
  "test",
  {
    dialect: "mysql"
  }
);

export default db;