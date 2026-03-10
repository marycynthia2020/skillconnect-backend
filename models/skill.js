"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Skill.hasMany(models.ArtisanSkill, {
        foreignKey: "skillId",
        as: "artisanSkills"
      })
      
    }
  }
  Skill.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Skill",
      tableName: "skills",
      timestamps: true,
    }
  );
  return Skill;
};
