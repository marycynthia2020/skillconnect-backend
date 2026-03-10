"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash("demousers", 10);
    await queryInterface.bulkInsert(
      "users",
      [
        {
          first_name: "Cynthia",
          last_name: "Okeke",
          email: "cynthia@gmail.com",
          phone_number: "+2347093467532",
          password,
          current_role: "artisan",
          state: "Lagos",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          first_name: "Confidence",
          last_name: "Nwankwo",
          email: "confidence@gmail.com",
          phone_number: "+2348023765412",
          password,
          current_role: "artisan",
          state: "Plateau",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          first_name: "Chris",
          last_name: "Njele",
          email: "chris@gmail.com",
          phone_number: "+2349026785643",
          password,
          current_role: "artisan",
          state: "Anambra",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          first_name: "Joseph",
          last_name: "Maraba",
          email: "joee@gmail.com",
          phone_number: "+2348054016781",
          password,
          current_role: "artisan",
          state: "Abuja",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          first_name: "Raphael",
          last_name: "Borno",
          email: "raph@gmail.com",
          phone_number: "+2349023789123",
          password,
          current_role: "client",
          state: "Imo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          first_name: "Samuel",
          last_name: "Delta",
          email: "sammy@gmail.com",
          phone_number: "+2347067542111",
          password,
          current_role: "client",
          state: "Delta",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          first_name: "Emmanuel",
          last_name: "Kaofor",
          email: "emmy@gmail.com",
          phone_number: "+2348023909090",
          password,
          current_role: "client",
          state: "Ebonyi",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          first_name: "Clement",
          last_name: "Kaofor",
          email: "clemz@gmail.com",
          phone_number: "+2347012096712",
          password,
          current_role: "client",
          state: "Akwa Ibom",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      email: [
        "clemz@gmail.com",
        "emmy@gmail.com",
        "sammy@gmail.com",
        "raph@gmail.com",
        "joee@gmail.com",
        "chris@gmail.com",
        "confidence@gmail.com",
        "cynthia@gmail.com",
      ],
    });
  },
};
