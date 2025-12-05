"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RevokedToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RevokedToken.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      modelName: "RevokedToken",
      tableName: "revoked_tokens",
      timestamps: false,
    }
  );
  return RevokedToken;
};
