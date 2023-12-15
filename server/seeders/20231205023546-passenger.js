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
        dateOfBirth: new Date(1995, 9, 14),
        idCard: '1243567890123456',
        name: 'Bang Joe',
        email: 'bangjoe@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
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
        userId: 2,
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
        userId: 3,
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
        userId: 4,
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
        userId: 4,
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
        userId: 4,
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
        isUser: false,
        gender: 'Female',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123502',
        name: 'Siti Cantik',
        email: 'siti@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        isUser: false,
        gender: 'Female',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123503',
        name: 'Sri Cantik',
        email: 'sri@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        isUser: false,
        gender: 'Female',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123504',
        name: 'Nur Cantik',
        email: 'nur@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        isUser: false,
        gender: 'Female',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123505',
        name: 'Ni Cantik',
        email: 'ni@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        isUser: false,
        gender: 'Female',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123506',
        name: 'Dewi Cantik',
        email: 'dewi@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        isUser: false,
        gender: 'Female',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123507',
        name: 'Endang Cantik',
        email: 'endang@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        isUser: false,
        gender: 'Female',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123508',
        name: 'Maria Cantik',
        email: 'maria@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        isUser: false,
        gender: 'Female',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123509',
        name: 'Ida Cantik',
        email: 'ida@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        isUser: false,
        gender: 'Female',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123510',
        name: 'Nurul Cantik',
        email: 'nurul@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        isUser: false,
        gender: 'Female',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123511',
        name: 'Wayan Cantik',
        email: 'wayan@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        isUser: false,
        gender: 'Male',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123512',
        name: 'Andy Tulen',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        isUser: false,
        gender: 'Male',
        dateOfBirth: new Date(1998, 1, 30),
        idCard: '1234567890123513',
        name: 'Satria Tulen',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 5,
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
        userId: 6,
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
