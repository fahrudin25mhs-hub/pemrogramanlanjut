import { Sequelize } from "sequelize";

const db = new Sequelize(
  'defaultdb',
  'avnadmin',
  'AVNS_ktuZR6H-KlqKKu7VSR-',
  {
    host: "mysql-1b97a8e2-akb-f455.h.aivencloud.com",
    dialect: "mysql",
    port: 28223,
    define: {
      timestamps: false
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

export default db;
