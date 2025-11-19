// config/connect.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE || "users_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false, 
  }
);

try {
  await sequelize.authenticate();
  console.log("Sequelize: Conectado ao MySQL com sucesso!");
} catch (error) {
  console.error("Sequelize: Não foi possível conectar ao banco de dados:", error);
}

export default sequelize;
