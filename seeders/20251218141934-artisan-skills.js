"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "artisan_skills",
      [
        {
          user_id: 4,
          skill_id: 1,
        },
        {
          user_id: 4,
          skill_id: 5,
        },
        {
          user_id: 4,
          skill_id: 8,
        },
        {
          user_id: 5,
          skill_id: 1,
        },
        {
          user_id: 5,
          skill_id: 2,
        },
        {
          user_id: 5,
          skill_id: 7,
        },
        {
          user_id: 6,
          skill_id: 3,
        },
        {
          user_id: 6,
          skill_id: 4,
        },
        {
          user_id: 6,
          skill_id: 10,
        },
        {
          user_id: 7,
          skill_id: 9,
        },
        {
          user_id: 7,
          skill_id: 6,
        },
        {
          user_id: 7,
          skill_id: 5,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.bulkDelete('artisan_skills', {
      user_id: [4, 5, 6, 7]
    });
  },
};
