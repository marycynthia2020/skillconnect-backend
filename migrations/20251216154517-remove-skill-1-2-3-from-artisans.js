"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("artisans", "skill_1");
    await queryInterface.removeColumn("artisans", "skill_2");
    await queryInterface.removeColumn("artisans", "skill_3");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("artisans", "skill_1", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("artisans", "skill_2", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("artisans", "skill_3", {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
};
