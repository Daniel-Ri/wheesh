'use strict';

const { Order, OrderedSeat } = require("../models");

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
    const orders = await Order.findAll({
      include: [
        {
          model: OrderedSeat
        }
      ]
    });

    const dummyData = [];
    for (const order of orders) {
      const totalPrice = order.OrderedSeats.reduce((accumulator, orderedSeat) =>
        accumulator + orderedSeat.price, 0
      );
      dummyData.push({
        orderId: order.id,
        amount: totalPrice,
        isPaid: true,
        duePayment: new Date(),
        createdAt: new Date(new Date().getTime() - 60 * 60 * 1000),
        updatedAt: new Date(new Date().getTime() - 30 * 60 * 1000),
      });
    }

    await queryInterface.bulkInsert('Payments', dummyData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Payments', null, {});
  }
};
