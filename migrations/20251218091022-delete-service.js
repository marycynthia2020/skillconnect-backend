'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.removeColumn('artisans', 'service');
     await queryInterface.removeColumn('artisans', 'skills');
  },

  async down (queryInterface, Sequelize) {
    
  }
};
