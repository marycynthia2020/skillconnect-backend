"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "artisans",
      [{ user_id: 4 }, { user_id: 5 }, { user_id: 6 }, { user_id: 7 }],
      {
        ignoreDuplicates: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
     await queryInterface.bulkDelete('artisans', {
      user_id: [4,5,6,7]
     });
  },
};
