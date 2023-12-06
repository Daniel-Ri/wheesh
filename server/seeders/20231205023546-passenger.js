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
    return queryInterface.bulkInsert('Passengers', [
      {
        userId: 1,
        isUser: true,
        gender: 'Male',
        dateOfBirth: new Date(1995, 10, 12),
        idCard: '1234567890123456',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        isUser: false,
        gender: 'Female',
        dateOfBirth: new Date(1997, 1, 1),
        idCard: '1234567890123496',
        name: 'Jean Doe',
        email: 'jeandoe@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        isUser: true,
        gender: 'Female',
        dateOfBirth: new Date(1997, 1, 1),
        idCard: '1234567890123496',
        name: 'Jean Doe',
        email: 'jeandoe@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        isUser: true,
        gender: 'Male',
        dateOfBirth: new Date(1995, 10, 12),
        idCard: '1234567890123457',
        name: 'Agus Ganteng',
        email: 'agus@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        isUser: false,
        gender: 'Male',
        dateOfBirth: new Date(1997, 2, 3),
        idCard: '1234567890123499',
        name: 'Asep Ganteng',
        email: 'asep@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        isUser: false,
        gender: 'Male',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123500',
        name: 'Slamet Ganteng',
        email: 'slamet@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        isUser: true,
        gender: 'Male',
        dateOfBirth: new Date(1997, 2, 3),
        idCard: '1234567890123499',
        name: 'Asep Ganteng',
        email: 'asep@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 5,
        isUser: true,
        gender: 'Male',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123500',
        name: 'Slamet Ganteng',
        email: 'slamet@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Passengers', null, {});
  }
};
