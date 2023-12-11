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
    
    return queryInterface.bulkInsert('Orders', [
      {
        userId: 1,
        scheduleId: afterTodaySchedules[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        scheduleId: afterTodaySchedules[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        scheduleId: afterTodaySchedules[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        scheduleId: afterTodaySchedules[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        scheduleId: afterTodaySchedules[3].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        scheduleId: afterTodaySchedules[4].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        scheduleId: afterTodaySchedules[5].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        scheduleId: afterTodaySchedules[6].id,
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
