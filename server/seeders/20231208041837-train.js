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
    const dummyData = [];
    for (let i = 1; i <= 60; i++) {
      const item = { id: i, createdAt: new Date(), updatedAt: new Date() };
      item.name = 'G' + (1200 + i);
      dummyData.push(item);
    }

    await queryInterface.bulkInsert('Trains', dummyData);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Trains', null, {});
  }
};
