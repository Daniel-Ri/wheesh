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
    return queryInterface.bulkInsert('Banners', [
      {
        imageDesktop: 'public/Frame 1 - Desktop.png',
        imageMobile: 'public/Frame 1 - Mobile.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, 
      {
        imageDesktop: 'public/Frame 2 - Desktop.png',
        imageMobile: 'public/Frame 2 - Mobile.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        imageDesktop: 'public/Frame 3 - Desktop.png',
        imageMobile: 'public/Frame 3 - Mobile.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, 
      {
        imageDesktop: 'public/Frame 4 - Desktop.png',
        imageMobile: 'public/Frame 4 - Mobile.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      }, 
      {
        imageDesktop: 'public/Frame 5 - Desktop.png',
        imageMobile: 'public/Frame 5 - Mobile.png',
        createdAt: new Date(),
        updatedAt: new Date(),
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
    return queryInterface.bulkDelete('Banners', null, {});
  }
};
