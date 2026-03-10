"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ArtisanSkill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ArtisanSkill.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
      })

      ArtisanSkill.belongsTo(models.Skill, {
        foreignKey: "skillId",
        as: "skill",
      })
    }
  }
  ArtisanSkill.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull:false,
        field: "user_id",
        references: {
          model: "users",
          key: "id"
        }
      },
      skillId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "skill_id",
        references: {
          model: "skills",
          key: "id"
        }
      }
    },
    {
      sequelize,
      modelName: "ArtisanSkill",
      tableName: "artisan_skills",
      timestamps: false,
    }
  );
  return ArtisanSkill;
};
