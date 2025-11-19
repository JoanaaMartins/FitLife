const { DataTypes } = require('sequelize');
const sequelize = require('../config/connect.js');
const User = require('./userModel');

const Goal = sequelize.define('Goal', {
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
    type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    target_value: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    target_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'goals',
    timestamps: false
});

// Associations
User.hasMany(Goal, { foreignKey: 'user_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Goal.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Goal;
