export default (sequelize, DataTypes) => {
  const Measurement = sequelize.define(
    "Measurement",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      weight_kg: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      height_cm: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      body_fat_pct: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
    },
    {
      tableName: "measurements",
      timestamps: false,
      underscored: true,
    }
  );

  return Measurement;
};
