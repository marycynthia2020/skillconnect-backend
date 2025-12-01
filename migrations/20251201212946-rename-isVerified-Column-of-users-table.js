'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('artisans', 'isVerified', 'is_verified')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('artisans', 'is_verified', 'isVerified',)
  }
};
