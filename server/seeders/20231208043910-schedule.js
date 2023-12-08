'use strict';

const { ScheduleDay } = require("../models");

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
    const scheduleDays = await ScheduleDay.findAll();

    const dummyData = [];
    for (let i = -2; i <= 7; i++) {
      const today = new Date();
      const tempDate = new Date(
        new Date(today.setHours(0,0,0)).getTime() + i * 24 * 60 * 60 * 1000
      );
      for (let j = 0; j < scheduleDays.length; j++) {
        const departureTime = new Date(
          tempDate.setHours(
            scheduleDays[j].departureTime.slice(0, 2), scheduleDays[j].departureTime.slice(3, 5)
          )
        );
        const arrivalTime = new Date(
          tempDate.setHours(
            scheduleDays[j].arrivalTime.slice(0, 2), scheduleDays[j].arrivalTime.slice(3, 5)
          )
        );

        dummyData.push({
          trainId: j + 1,
          departureStationId: scheduleDays[j].departureStationId,
          arrivalStationId: scheduleDays[j].arrivalStationId,
          departureTime,
          arrivalTime,
        });
      }
    }

    await queryInterface.bulkInsert('Schedules', dummyData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Schedules', null, {});
  }
};
