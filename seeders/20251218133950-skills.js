"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "skills",
      [
        { title: "tiler", createdAt: new Date(), updatedAt: new Date() },
        {
          title: "plumbing services",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "auto services",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { title: "carpentry", createdAt: new Date(), updatedAt: new Date() },
        {
          title: "phone repairs",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { title: "bag making", createdAt: new Date(), updatedAt: new Date() },
        {
          title: "salon services",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "makeup artist",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { title: "beaders", createdAt: new Date(), updatedAt: new Date() },
        { title: "electricians", createdAt: new Date(), updatedAt: new Date() },
      ],
      {
        ignoreDuplicates: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("skills", {
      title: [
        "beaders",
        "electricians",
        "makeup artist",
        "salon services",
        "bag making",
        "phone repairs",
        "carpentry",
        "auto services",
        "plumbing services",
        "tiler",
      ],
    });
  },
};
