'use strict';

const { Carriage } = require("../models");

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
    const carriages = await Carriage.findAll();
    const firstSeatLetters = ['A', 'C', 'F'];
    const firstSeatNumber = 3;
    const businessSeatLetters = ['A', 'C', 'D', 'F'];
    const businessSeatNumber = 7;
    const economySeatLetters = ['A', 'B', 'C', 'D', 'F'];
    const economySeatNumber = 18;

    const dummyData = [];
    let seatId = 1;
    for (const carriage of carriages) {
      const carriageNumber = carriage.carriageNumber;
      if (carriageNumber === 1 || carriageNumber === 8) {
        for (let i = 1; i <= firstSeatNumber; i++) {
          for (const letter of firstSeatLetters) {
            const item = {
              id: seatId++,
              carriageId: carriage.id,
              seatNumber: i + letter,
              seatClass: 'first',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            dummyData.push(item);
          }
        }
        for (let i = firstSeatNumber + 1; i <= firstSeatNumber + businessSeatNumber; i++) {
          for (const letter of businessSeatLetters) {
            const item = {
              id: seatId++,
              carriageId: carriage.id,
              seatNumber: i + letter,
              seatClass: 'business',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            dummyData.push(item);
          }
        }

      } else {
        for (let i = 1; i <= economySeatNumber; i++) {
          for (const letter of economySeatLetters) {
            const item = {
              id: seatId++,
              carriageId: carriage.id,
              seatNumber: i + letter,
              seatClass: 'economy',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            dummyData.push(item);
          }
        } 
      }
    }

    const batchSize = 100;
    const currentDummyData = [];
    for (let i = 0; i < dummyData.length; i += batchSize) {
      const batch = dummyData.slice(i, i + batchSize);
      currentDummyData.push(batch);
    }

    for (const dataBatch of currentDummyData) {
      await queryInterface.bulkInsert('Seats', dataBatch);
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Seats', null, {});
  }
};
