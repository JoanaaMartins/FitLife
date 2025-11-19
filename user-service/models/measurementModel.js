const { DataTypes } = require('sequelize');
const sequelize = require('../config/connect.js');
const User = require('./userModel');

const Measurement = sequelize.define('Measurement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    weight_kg: {
        type: DataTypes.DECIMAL(5,2),
        allowNull: true
    },
    height_cm: {
        type: DataTypes.DECIMAL(5,2),
        allowNull: true
    },
    body_fat_pct: {
        type: DataTypes.DECIMAL(5,2),
        allowNull: true
    }
}, {
    tableName: 'measurements',
    timestamps: false
});

// Associations
User.hasMany(Measurement, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Measurement.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Measurement;
