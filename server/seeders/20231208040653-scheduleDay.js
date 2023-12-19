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
    let scheduleDayId = 1;
    const dummyData = require('../data/scheduleDay.json').map((item) => {
      item.id = scheduleDayId++,
      item.createdAt = new Date();
      item.updatedAt = new Date();

      return item;
    })
    await queryInterface.bulkInsert('ScheduleDays', dummyData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('ScheduleDays', null, {});
  }
};
