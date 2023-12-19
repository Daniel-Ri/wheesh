'use strict';

const { Train } = require("../models");

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

    const trains = await Train.findAll();
    const dummyData = [];
    let carriageId = 1;
    for (const train of trains) {
      for (let i = 1; i <= 8; i++) {
        const item = {
          id: carriageId++,
          trainId: train.id,
          carriageNumber: i,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        dummyData.push(item);
      }
    }

    await queryInterface.bulkInsert('Carriages', dummyData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Carriages', null, {});
  }
};
