'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('artisans', "skills", {
      type: DataTypes.JSON,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('artisans', "skills");
  }
};
