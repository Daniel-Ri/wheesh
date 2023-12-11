'use strict';

const { Schedule, Order, Train, Carriage, Seat } = require("../models");
const { Op } = require("sequelize");
const { getRandomDOB, generateRandomId, generateRandomName, generateRandomEmail, generateOrderedSeatItem, select80PercentRandomly } = require("../utils/handleValue");
const crypto = require('crypto');

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

    const dummyData = [];
    
    /* 1: Order half all seats */
    let order = await Order.findByPk(1);
    let firstScheduleId = order.scheduleId;
    let schedule = await Schedule.findByPk(firstScheduleId, {
      include: [
        {
          model: Train,
          include: [
            {
              model: Carriage,
              where: {carriageNumber: {[Op.lte]: 4}},
              include: [
                {model: Seat}
              ]
            }
          ]
        }
      ]
    });

    let carriages = schedule.toJSON().Train.Carriages;
    let seatIds = carriages.map((carriage) => {
      return carriage.Seats.map((seat) => seat.id);
    });
    seatIds = seatIds.flat();

    for (const seatId of seatIds)
      dummyData.push(generateOrderedSeatItem(order.id, seatId));

    /* 2: Order half all seats */
    schedule = await Schedule.findByPk(firstScheduleId, {
      include: [
        {
          model: Train,
          include: [
            {
              model: Carriage,
              where: {carriageNumber: {[Op.gt]: 4}},
              include: [
                {model: Seat}
              ]
            }
          ]
        }
      ]
    });

    carriages = schedule.toJSON().Train.Carriages;
    seatIds = carriages.map((carriage) => {
      return carriage.Seats.map((seat) => seat.id);
    });
    seatIds = seatIds.flat();
    for (const seatId of seatIds)
      dummyData.push(generateOrderedSeatItem(2, seatId));
    
    /* 3: Order all first class seats */
    order = await Order.findByPk(3);
    let scheduleId = order.scheduleId;
    schedule = await Schedule.findByPk(scheduleId, {
      include: [
        {
          model: Train,
          include: [
            {
              model: Carriage,
              include: [
                {
                  model: Seat,
                  where: { seatClass: 'first' }
                }
              ]
            }
          ]
        }
      ]
    });

    carriages = schedule.toJSON().Train.Carriages;
    seatIds = carriages.map((carriage) => {
      return carriage.Seats.map((seat) => seat.id);
    });
    seatIds = seatIds.flat();
    for (const seatId of seatIds)
      dummyData.push(generateOrderedSeatItem(order.id, seatId));

    /* 4: Order all business class seats */
    order = await Order.findByPk(4);
    scheduleId = order.scheduleId;
    schedule = await Schedule.findByPk(scheduleId, {
      include: [
        {
          model: Train,
          include: [
            {
              model: Carriage,
              include: [
                {
                  model: Seat,
                  where: { seatClass: 'business' }
                }
              ]
            }
          ]
        }
      ]
    });

    carriages = schedule.toJSON().Train.Carriages;
    seatIds = carriages.map((carriage) => {
      return carriage.Seats.map((seat) => seat.id);
    });
    seatIds = seatIds.flat();
    for (const seatId of seatIds)
      dummyData.push(generateOrderedSeatItem(order.id, seatId));

    /* 5: Order all economy class seats */
    order = await Order.findByPk(5);
    scheduleId = order.scheduleId;
    schedule = await Schedule.findByPk(scheduleId, {
      include: [
        {
          model: Train,
          include: [
            {
              model: Carriage,
              include: [
                {
                  model: Seat,
                  where: { seatClass: 'economy' }
                }
              ]
            }
          ]
        }
      ]
    });

    carriages = schedule.toJSON().Train.Carriages;
    seatIds = carriages.map((carriage) => {
      return carriage.Seats.map((seat) => seat.id);
    });
    seatIds = seatIds.flat();
    for (const seatId of seatIds)
      dummyData.push(generateOrderedSeatItem(order.id, seatId));

    /* 6: Order 80% of first class seats */
    order = await Order.findByPk(6);
    scheduleId = order.scheduleId;
    schedule = await Schedule.findByPk(scheduleId, {
      include: [
        {
          model: Train,
          include: [
            {
              model: Carriage,
              include: [
                {
                  model: Seat,
                  where: { seatClass: 'first' }
                }
              ]
            }
          ]
        }
      ]
    });

    carriages = schedule.toJSON().Train.Carriages;
    seatIds = carriages.map((carriage) => {
      return carriage.Seats.map((seat) => seat.id);
    });
    seatIds = seatIds.flat();
    seatIds = select80PercentRandomly(seatIds);
    for (const seatId of seatIds)
      dummyData.push(generateOrderedSeatItem(order.id, seatId));

    /* 7: Order 80% of business class seats */
    order = await Order.findByPk(7);
    scheduleId = order.scheduleId;
    schedule = await Schedule.findByPk(scheduleId, {
      include: [
        {
          model: Train,
          include: [
            {
              model: Carriage,
              include: [
                {
                  model: Seat,
                  where: { seatClass: 'business' }
                }
              ]
            }
          ]
        }
      ]
    });

    carriages = schedule.toJSON().Train.Carriages;
    seatIds = carriages.map((carriage) => {
      return carriage.Seats.map((seat) => seat.id);
    });
    seatIds = seatIds.flat();
    seatIds = select80PercentRandomly(seatIds);
    for (const seatId of seatIds)
      dummyData.push(generateOrderedSeatItem(order.id, seatId));

    /* 8: Order 80% of economy class seats */
    order = await Order.findByPk(8);
    scheduleId = order.scheduleId;
    schedule = await Schedule.findByPk(scheduleId, {
      include: [
        {
          model: Train,
          include: [
            {
              model: Carriage,
              include: [
                {
                  model: Seat,
                  where: { seatClass: 'economy' }
                }
              ]
            }
          ]
        }
      ]
    });

    carriages = schedule.toJSON().Train.Carriages;
    seatIds = carriages.map((carriage) => {
      return carriage.Seats.map((seat) => seat.id);
    });
    seatIds = seatIds.flat();
    seatIds = select80PercentRandomly(seatIds);
    for (const seatId of seatIds)
      dummyData.push(generateOrderedSeatItem(order.id, seatId));

    await queryInterface.bulkInsert('OrderedSeats', dummyData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('OrderedSeats', null, {});
  }
};
