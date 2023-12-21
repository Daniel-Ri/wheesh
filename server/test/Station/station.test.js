const request = require('supertest');
const app = require('../../index');
const { sequelize } = require('../../models/index');
const { up: upStation, down: downStation } = require('../../seeders/20231208023152-station');
const { queryInterface } = sequelize;

jest.mock("ioredis", () => require("ioredis-mock"));

// Mock node-cron
jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

beforeAll(async () => {
  await upStation(queryInterface, sequelize);
});

afterAll(async () => {
  await downStation(queryInterface, sequelize);
});

describe('Get All Stations', () => {
  test('Success get all stations with status 200', async () => {
    let response;
    try {
      response = await request(app).get('/api/station');
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);

    const { body } = response;
    body.data.forEach(obj => {
      expect(obj).toHaveProperty('id');
      expect(obj).toHaveProperty('name');
    });
  });
});