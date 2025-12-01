'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.addColumn("artisans", "skill_3", {
          type: DataTypes.STRING,
          allowNull: true,
        });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("artisans", "skill_3");
  }
};
