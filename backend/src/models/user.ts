import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Admin", "User"),
      defaultValue: "User",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

export default User;