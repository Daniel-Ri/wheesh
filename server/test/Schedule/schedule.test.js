const request = require('supertest');
const Redis = require("ioredis-mock");
const { Op } = require("sequelize");
const app = require('../../index');
const { Schedule, sequelize } = require('../../models/index');
const { up: upUser, down: downUser } = require('../../seeders/20231205021723-user');
const { up: upPassenger, down: downPassenger } = require('../../seeders/20231205023546-passenger');
const { up: upStation, down: downStation } = require('../../seeders/20231208023152-station');
const { up: upScheduleDay, down: downScheduleDay } = require('../../seeders/20231208040653-scheduleDay');
const { up: upTrain, down: downTrain } = require('../../seeders/20231208041837-train');
const { up: upSchedule, down: downSchedule } = require('../../seeders/20231208043910-schedule');
const { up: upSchedulePrice, down: downSchedulePrice } = require('../../seeders/20231208070828-schedulePrice');
const { up: upCarriage, down: downCarriage } = require('../../seeders/20231211040055-carriage');
const { up: upSeat, down: downSeat } = require('../../seeders/20231211041822-seat');
const { up: upOrder, down: downOrder } = require('../../seeders/20231211054219-order');
const { up: upOrderedSeat, down: downOrderedSeat } = require('../../seeders/20231211063308-orderedSeat');
const { formatDate } = require('../../utils/handleValue');
const { queryInterface } = sequelize;

const mockRedisClient = new Redis();
jest.mock("ioredis", () => require("ioredis-mock"));

beforeAll(async () => {
  await upUser(queryInterface, sequelize);
  await upPassenger(queryInterface, sequelize);
  await upStation(queryInterface, sequelize);
  await upScheduleDay(queryInterface, sequelize);
  await upTrain(queryInterface, sequelize);
  await upSchedule(queryInterface, sequelize);
  await upSchedulePrice(queryInterface, sequelize);
  await upCarriage(queryInterface, sequelize);
  await upSeat(queryInterface, sequelize);
  await upOrder(queryInterface, sequelize);
  await upOrderedSeat(queryInterface, sequelize);
});

afterAll(async () => {
  await downUser(queryInterface, sequelize);
  await downPassenger(queryInterface, sequelize);
  await downStation(queryInterface, sequelize);
  await downScheduleDay(queryInterface, sequelize);
  await downTrain(queryInterface, sequelize);
  await downSchedule(queryInterface, sequelize);
  await downSchedulePrice(queryInterface, sequelize);
  await downCarriage(queryInterface, sequelize);
  await downSeat(queryInterface, sequelize);
  await downOrder(queryInterface, sequelize);
  await downOrderedSeat(queryInterface, sequelize);
});

describe('Get Latest Date Schedule', () => {
  test('Success get latest date schedule with status 200', async () => {
    let response;
    let lastScheduleString;
    try {
      response = await request(app).get('/api/schedule/latestDate');
      const lastSchedule = await Schedule.findOne({
        order: [
          ['departureTime', 'DESC'],
        ],
      });
      lastScheduleString = new Date(lastSchedule.departureTime).toDateString();
    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { body } = response;
    expect(new Date(body.data).toDateString()).toEqual(lastScheduleString);
  });
});

describe('Get Schedules', () => {
  test('Success get schedules with status 200', async () => {
    let response;
    const departureStationId = 1;  // Halim
    const arrivalStationId = 3;    // Padalarang
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    try {
      response = 
        await request(app)
          .get(`/api/schedule/${departureStationId}/${arrivalStationId}/${formatDate(tomorrow)}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    data.forEach(obj => {
      expect(obj).toHaveProperty('id');
      expect(obj).toHaveProperty('Train');
      expect(obj.Train).toHaveProperty('name');
      expect(obj).toHaveProperty('departureStation');
      expect(obj.departureStation.id).toEqual(departureStationId);
      expect(obj).toHaveProperty('arrivalStation');
      expect(obj.arrivalStation.id).toEqual(arrivalStationId);
      expect(formatDate(tomorrow)).toEqual(formatDate(new Date(obj.departureTime)));
    })
  });
});

describe('Get Schedule', () => {
  beforeEach(() => {
    mockRedisClient.flushall();
  });

  test('Success get schedule with status 200', async () => {
    let response;
    const whichOrderTomorrow = 2; // second order
    let schedule;
    
    try {
      const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

      const tomorrowSchedules = await Schedule.findAll({
        where: {
          departureTime: {[Op.gte]: tomorrow},
        },
        order: [
          ['departureTime', 'ASC']
        ]
      });
      
      schedule = tomorrowSchedules[whichOrderTomorrow - 1];
      response = await request(app).get(`/api/schedule/${schedule.id}`);

    } catch (err) {
      console.error(err);
    }

    expect(response.status).toBe(200);
    const { data } = response.body;
    expect(data.id).toEqual(schedule.id);
    expect(data).toHaveProperty('Train');
    expect(data.Train).toHaveProperty('name');
    expect(data).toHaveProperty('departureStation');
    expect(data).toHaveProperty('arrivalStation');
  });
});