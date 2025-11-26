import {Sequelize, DataTypes} from "sequelize";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";
import goalModel from "../models/goalModel.js";
import measurementModel from "../models/measurementModel.js";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

try {
  await sequelize.authenticate();
  console.log("Connection to the database has been established successfully.");
} catch (error) {
  console.error("❌ Unable to connect to the database:", error);
  process.exit(1);
}

const db = {}; 
db.sequelize = sequelize;

db.User = userModel(sequelize, DataTypes);
db.Measurement = measurementModel(sequelize, DataTypes);
db.Goal = goalModel(sequelize, DataTypes);

// User - Measurements (1:N)
db.Measurement.belongsTo(db.User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  allowNull: false,
});
db.User.hasMany(db.Measurements, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  allowNull: false,
});

// User - Goals (1:N)
db.Goal.belongsTo(db.User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  allowNull: false,
});
db.User.hasMany(db.Goals, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  allowNull: false,
});

export default db;