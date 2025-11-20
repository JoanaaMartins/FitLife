export default (sequelize, DataTypes) => {
  const Instructor = sequelize.define(
    "Instructor",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      specialty: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: 'instructors',
      timestamps: false,
      underscored: true,
    }
  );
  return Instructor;
};