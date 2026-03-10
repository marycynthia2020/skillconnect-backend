"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "clients",
      [{ user_id: 8 }, { user_id: 9 }, { user_id: 10 }, { user_id: 11 }],
      {
        ignoreDuplicates: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("clients", {
      user_id: [8, 9, 10, 11],
    });
  },
};
