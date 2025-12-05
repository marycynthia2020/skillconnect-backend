"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RefreshToken.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  RefreshToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        unique: true,
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "id",
        },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "expires_at",
      },
    },
    {
      sequelize,
      modelName: "RefreshToken",
      tableName: "refresh_tokens",
      timestamps: false
    }
  );
  return RefreshToken;
};
