import {Sequelize, DataTypes} from "sequelize";
import dotenv from "dotenv";
import instructorModel from "../models/instructorModel.js";
import classModel from "../models/classModel.js";
import reservationModel from "../models/reservationModel.js";

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


db.Instructor = instructorModel(sequelize, DataTypes);
db.Class = classModel(sequelize, DataTypes);
db.Reservation = reservationModel(sequelize, DataTypes);

// Instructor - Classes (1:N)
db.Class.belongsTo(db.Instructor, {
  foreignKey: "instructor_id",
  onDelete: "CASCADE",
  allowNull: false,
});
db.Instructor.hasMany(db.Class, {
  foreignKey: "instructor_id",
  onDelete: "CASCADE",
  allowNull: false,
});

// Class - Reservations (1:N)
db.Reservation.belongsTo(db.Class, {
  foreignKey: "class_id",
  onDelete: "CASCADE",
  allowNull: false,
});
db.Class.hasMany(db.Reservation, {
  foreignKey: "class_id",
  onDelete: "CASCADE",
  allowNull: false,
});

export default db;