'use strict';

const { Schedule } = require("../models");
const { Op } = require("sequelize");

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
    const tomorrow = new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000);

    const afterTodaySchedules = await Schedule.findAll({
      where: {
        departureTime: {[Op.gte]: tomorrow},
      }
    });
    
    let orderId = 1;
    return queryInterface.bulkInsert('Orders', [
      {
        id: orderId++,
        userId: 2,
        scheduleId: afterTodaySchedules[0].id,
        isNotified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: orderId++,
        userId: 3,
        scheduleId: afterTodaySchedules[0].id,
        isNotified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: orderId++,
        userId: 2,
        scheduleId: afterTodaySchedules[1].id,
        isNotified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: orderId++,
        userId: 3,
        scheduleId: afterTodaySchedules[2].id,
        isNotified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: orderId++,
        userId: 2,
        scheduleId: afterTodaySchedules[3].id,
        isNotified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: orderId++,
        userId: 3,
        scheduleId: afterTodaySchedules[4].id,
        isNotified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: orderId++,
        userId: 2,
        scheduleId: afterTodaySchedules[5].id,
        isNotified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: orderId++,
        userId: 3,
        scheduleId: afterTodaySchedules[6].id,
        isNotified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: orderId++,
        userId: 2,
        scheduleId: 1,
        isNotified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: orderId++,
        userId: 2,
        scheduleId: 2,
        isNotified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Orders', null, {});
  }
};
