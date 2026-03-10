"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable("user_skills", "artisan_skills");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable("artisan_skills", "user_skills");
  },
};
