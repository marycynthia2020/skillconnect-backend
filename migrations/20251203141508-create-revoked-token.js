"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("revoked_tokens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("revoked_tokens");
  },
};
