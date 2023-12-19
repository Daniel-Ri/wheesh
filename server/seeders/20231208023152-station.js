'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   let stationId = 1;
    return queryInterface.bulkInsert('Stations', [
      {
        id: stationId++,
        name: 'Halim',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: stationId++,
        name: 'Karawang',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: stationId++,
        name: 'Padalarang',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: stationId++,
        name: 'Tegalluar',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Stations', null, {});
  }
};
