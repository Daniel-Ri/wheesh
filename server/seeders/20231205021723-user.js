'use strict';

const { hash } = require('../utils/handlePassword');

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
    let userId = 1;
    return queryInterface.bulkInsert('Users', [
      {
        id: userId++,
        username: "bangjoe",
        password: hash("123456"),
        role: "admin",
        email: "bangjoe@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: userId++,
        username: "johndoe",
        password: hash("123456"),
        role: "user",
        email: "johndoe@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: userId++,
        username: "jeandoe",
        password: hash("123456"),
        role: "user",
        email: "jeandoe@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: userId++,
        username: "agus",
        password: hash("123456"),
        role: "user",
        email: "agus@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: userId++,
        username: "asep",
        password: hash("123456"),
        role: "user",
        email: "asep@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: userId++,
        username: "slamet",
        password: hash("123456"),
        role: "user",
        email: "slamet@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
