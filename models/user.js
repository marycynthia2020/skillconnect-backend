/**
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').ModelStatic<Model>} ModelStatic
 */

'use strict'
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
 * @extends Model
 */
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Artisan, {
        foreignKey: "userId",
        as: 'artisan'
      });

      User.hasOne(models.Client, {
        foreignKey: "userId",
        as: 'client'
      });
      User.hasOne(models.RefreshToken, {
        foreignKey: "userId",
        as: 'refreshToken'
      })
      User.hasMany(models.ArtisanSkill, {
        foreignKey: "userId",
        as: "artisanSkills"
      })
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currentRole: {
        type: DataTypes.ENUM("artisan", "client"),
        allowNull: false,
        field: 'current_role'
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female", "Undisclosed"),
        allowNull: false,
        defaultValue: "Undisclosed",
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'phone_number'
      },
      contactAddress: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'contact_address'
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photoURL: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'photo_url'

      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: false,
        defaultValue: 0.0,
      },
      rateCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'rate_count'
      },
      isUserVerified: {
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: false,
        field: 'is_user_verified'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    }
  );

  return User;
};