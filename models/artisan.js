/**
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').ModelStatic<Model>} ModelStatic
 */

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
   /**
 * @extends Model
 */
  class Artisan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association 
      Artisan.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      })
    }
  }
  Artisan.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_verified'
      },
      about: {
        type: DataTypes.STRING(160),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Artisan",
      tableName: "artisans",
      timestamps:false
    }
  );
  return Artisan;
};
