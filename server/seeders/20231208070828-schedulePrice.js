'use strict';

const { Schedule } = require("../models");

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

    const schedules = await Schedule.findAll();
    const economyPrice = (date) => {
      const day = date.getDay();
      if (day === 0 || day === 6) { // Sunday or Saturday
        return 250000;
      }

      return 200000;
    }
    const businessPrice = 450000
    const firstPrice = 600000

    const dummyData = [];
    let schedulePriceId = 1;
    for (const schedule of schedules) {
      for (const seatClass of ['economy', 'business', 'first']) {
        const item = {
          id: schedulePriceId++,
          scheduleId: schedule.id,
          seatClass,
          price: 
            seatClass === 'first' ? 
              firstPrice : seatClass === 'business' ? 
                businessPrice : economyPrice(schedule.departureTime),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        dummyData.push(item);
      }
    }

    await queryInterface.bulkInsert('SchedulePrices', dummyData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('SchedulePrices', null, {});
  }
};
